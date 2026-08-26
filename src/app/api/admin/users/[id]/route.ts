import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Role } from "@prisma/client";

const VALID_ROLES: Role[] = ["USER", "ADMIN"];

/* ─────────────────────────────────────────────────────────────────
   PATCH /api/admin/users/[id]
   Change le rôle et/ou le statut banni d'un utilisateur, et/ou
   ajuste son solde (delta, positif pour créditer, négatif pour
   débiter). Tout ajustement de solde crée une Transaction pour
   garder un historique cohérent. Bannir révoque immédiatement
   toutes les sessions actives de l'utilisateur.
───────────────────────────────────────────────────────────────── */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const admin = await requireAdmin();
        const { id } = await params;

        const body = (await req.json()) as {
            role?: Role;
            balanceAdjustment?: number;
            banned?: boolean;
            banReason?: string;
        };
        const { role, balanceAdjustment, banned, banReason } = body;

        if (role && !VALID_ROLES.includes(role)) {
            return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
        }

        if (id === admin.id && ((role && role !== "ADMIN") || banned === true)) {
            return NextResponse.json(
                {
                    error:
                        "Vous ne pouvez pas retirer votre propre rôle admin ou vous bannir vous-même",
                },
                { status: 400 },
            );
        }

        const target = await prisma.user.findUnique({ where: { id } });
        if (!target) {
            return NextResponse.json(
                { error: "Utilisateur introuvable" },
                { status: 404 },
            );
        }

        const banData =
            banned === undefined
                ? {}
                : banned
                  ? { banned: true, banReason: banReason ?? null }
                  : { banned: false, banReason: null };

        if (balanceAdjustment && balanceAdjustment !== 0) {
            const reference = `ADJ_${id}_${Date.now()}`;
            const [, updated] = await prisma.$transaction([
                prisma.transaction.create({
                    data: {
                        userId: id,
                        amount: Math.abs(balanceAdjustment),
                        type: balanceAdjustment > 0 ? "CREDIT" : "DEBIT",
                        status: "COMPLETED",
                        reference,
                    },
                }),
                prisma.user.update({
                    where: { id },
                    data: {
                        balance: { increment: balanceAdjustment },
                        ...(role ? { role } : {}),
                        ...banData,
                    },
                }),
            ]);

            if (banned === true) {
                await prisma.session.deleteMany({ where: { userId: id } });
            }

            return NextResponse.json({ user: updated });
        }

        if (role || banned !== undefined) {
            const updated = await prisma.user.update({
                where: { id },
                data: { ...(role ? { role } : {}), ...banData },
            });

            if (banned === true) {
                await prisma.session.deleteMany({ where: { userId: id } });
            }

            return NextResponse.json({ user: updated });
        }

        return NextResponse.json(
            { error: "Aucune modification fournie" },
            { status: 400 },
        );
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 },
            );
        console.error("Patch user error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

/* ─────────────────────────────────────────────────────────────────
   DELETE /api/admin/users/[id]
   Supprime définitivement un utilisateur. Refusé s'il a la moindre
   commande ou transaction (contrainte de clé étrangère en RESTRICT,
   et surtout pour ne jamais perdre un historique financier/commande).
   Utiliser le bannissement pour ces cas-là.
───────────────────────────────────────────────────────────────── */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const admin = await requireAdmin();
        const { id } = await params;

        if (id === admin.id) {
            return NextResponse.json(
                { error: "Vous ne pouvez pas supprimer votre propre compte" },
                { status: 400 },
            );
        }

        const target = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                _count: { select: { orders: true, transactions: true } },
            },
        });

        if (!target) {
            return NextResponse.json(
                { error: "Utilisateur introuvable" },
                { status: 404 },
            );
        }

        if (target._count.orders > 0 || target._count.transactions > 0) {
            return NextResponse.json(
                {
                    error:
                        "Impossible de supprimer un compte avec des commandes ou transactions. Bannissez-le à la place.",
                },
                { status: 409 },
            );
        }

        await prisma.user.delete({ where: { id } });

        return NextResponse.json({ ok: true });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 },
            );
        console.error("Delete user error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
