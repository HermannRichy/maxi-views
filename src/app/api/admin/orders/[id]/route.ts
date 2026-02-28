import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendOrderStatusChanged } from "@/lib/emails";
import type { OrderStatus } from "@prisma/client";

const VALID_STATUSES: OrderStatus[] = [
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
];

/* ─────────────────────────────────────────────────────────────────
   PATCH /api/admin/orders/[id] — Changer le statut d'une commande
───────────────────────────────────────────────────────────────── */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin();

        const { id } = await params;
        const body = (await req.json()) as {
            status?: OrderStatus;
            japOrderId?: string;
            adminNote?: string;
        };

        const { status, japOrderId, adminNote } = body;

        if (status && !VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: "Statut invalide" },
                { status: 400 },
            );
        }

        const order = await prisma.order.findUnique({
            where: { id },
            include: { user: true },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Commande introuvable" },
                { status: 404 },
            );
        }

        const updated = await prisma.order.update({
            where: { id },
            data: {
                ...(status ? { status } : {}),
                ...(japOrderId !== undefined ? { japOrderId } : {}),
                ...(adminNote !== undefined ? { adminNote } : {}),
            },
            include: { user: true },
        });

        // Notifier le user si le statut a changé
        if (status && status !== order.status) {
            sendOrderStatusChanged({
                to: order.user.email,
                name: order.user.name ?? "Utilisateur",
                orderId: order.id,
                serviceName: order.serviceName,
                status,
                adminNote: adminNote ?? order.adminNote,
            }).catch(console.error);
        }

        return NextResponse.json({ order: updated });
    } catch (err: any) {
        if (err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        if (err.message === "FORBIDDEN")
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 },
            );
        console.error("Patch order error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
