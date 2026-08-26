import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/wallet/deposit/status?reference=...
   Permet au frontend de sonder l'état d'un dépôt en attente, sans
   jamais appeler FeexPay directement depuis le navigateur. La mise à
   jour réelle du statut est faite par le webhook /api/wallet/callback.
───────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
    try {
        const user = await requireUser();
        const reference = req.nextUrl.searchParams.get("reference");

        if (!reference) {
            return NextResponse.json(
                { error: "Référence manquante" },
                { status: 400 },
            );
        }

        const transaction = await prisma.transaction.findFirst({
            where: { reference, userId: user.id },
            select: { status: true, amount: true },
        });

        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction inconnue" },
                { status: 404 },
            );
        }

        return NextResponse.json({ status: transaction.status });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
