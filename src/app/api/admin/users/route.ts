import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/admin/users — Tous les utilisateurs + compteurs
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        await requireAdmin();

        const users = await prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                balance: true,
                emailVerified: true,
                banned: true,
                banReason: true,
                createdAt: true,
                _count: { select: { orders: true, transactions: true } },
            },
        });

        return NextResponse.json({ users });
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
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
