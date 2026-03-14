import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/deposit
   Initie un paiement FedaPay et renvoie le lien de paiement.
───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        const user = await requireUser();

        const { amount } = (await req.json()) as { amount: number };

        if (!amount || amount < 500) {
            return NextResponse.json(
                { error: "Le montant minimum est de 500 FCFA" },
                { status: 400 },
            );
        }

        if (!process.env.FEDAPAY_SECRET_KEY) {
            return NextResponse.json(
                { error: "FedaPay non configuré" },
                { status: 503 },
            );
        }

        // Générer une référence unique
        const reference = `DEP_${user.id}_${Date.now()}`;
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?success=true`;

        // Créer la Transaction PENDING en DB
        await prisma.transaction.create({
            data: {
                userId: user.id,
                amount,
                type: "CREDIT",
                status: "PENDING",
                reference,
            },
        });

        // L'API FedaPay est désormais appelée directement sur le Frontend via le widget Checkout.js.
        // La redirection sera gérée côté client.

        return NextResponse.json({
            reference,
            amount,
            customerEmail: user.email,
            customerName: user.name ?? "Client",
        });
    } catch (err: any) {
        if (err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        console.error("Deposit error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
