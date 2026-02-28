import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/admin/orders — Toutes les commandes + infos user
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        await requireAdmin();

        const orders = await prisma.order.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        return NextResponse.json({ orders });
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
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
