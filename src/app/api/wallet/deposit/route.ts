import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FedaPay, Transaction } from "fedapay";

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

        // Configuration FedaPay
        FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY);
        FedaPay.setEnvironment(
            (process.env.FEDAPAY_ENVIRONMENT as "sandbox" | "live") ||
                "sandbox",
        );

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

        // Appel FedaPay pour générer le lien de paiement
        try {
            const transaction = await Transaction.create({
                description: `Rechargement Maxi Views — ${user.email}`,
                amount,
                currency: { iso: "XOF" },
                callback_url: callbackUrl,
                customer: {
                    email: user.email,
                    firstname: user.name ?? "Client",
                },
                custom_metadata: { reference },
            });

            const token = await transaction.generateToken();

            return NextResponse.json({
                paymentUrl: token.url,
                reference,
            });
        } catch (feexError) {
            console.error("FedaPay error:", feexError);
            // Supprimer la transaction en échec
            await prisma.transaction.delete({ where: { reference } });
            return NextResponse.json(
                { error: "Erreur FedaPay" },
                { status: 502 },
            );
        }
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
