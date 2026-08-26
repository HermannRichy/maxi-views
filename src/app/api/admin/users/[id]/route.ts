import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Role } from "@prisma/client";

const VALID_ROLES: Role[] = ["USER", "ADMIN"];

/* ─────────────────────────────────────────────────────────────────
   PATCH /api/admin/users/[id]
   Change le rôle d'un utilisateur et/ou ajuste son solde (delta,
   positif pour créditer, négatif pour débiter). Tout ajustement de
   solde crée une Transaction pour garder un historique cohérent.
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
        };
        const { role, balanceAdjustment } = body;

        if (role && !VALID_ROLES.includes(role)) {
            return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
        }

        if (role && id === admin.id && role !== "ADMIN") {
            return NextResponse.json(
                { error: "Vous ne pouvez pas retirer votre propre rôle admin" },
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
                    },
                }),
            ]);

            return NextResponse.json({ user: updated });
        }

        if (role) {
            const updated = await prisma.user.update({
                where: { id },
                data: { role },
            });
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
