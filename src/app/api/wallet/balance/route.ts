import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/wallet/balance
   Retourne le solde et l'historique des transactions du user.
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        const user = await requireUser();

        const transactions = await prisma.transaction.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({
            balance: user.balance,
            transactions,
        });
    } catch (err: any) {
        if (err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
