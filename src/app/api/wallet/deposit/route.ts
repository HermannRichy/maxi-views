import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/deposit
   Initie un paiement FeexPay et renvoie le lien de paiement.
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

        if (!process.env.FEEXPAY_API_KEY || !process.env.FEEXPAY_SHOP_ID) {
            return NextResponse.json(
                { error: "FeexPay non configuré" },
                { status: 503 },
            );
        }

        // Générer une référence unique
        const reference = `DEP_${user.id}_${Date.now()}`;
        const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/wallet/callback`;

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

        // Appel FeexPay pour générer le lien de paiement
        const feexResponse = await fetch(
            "https://feexpay.me/api/orders/v1/create",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.FEEXPAY_API_KEY}`,
                },
                body: JSON.stringify({
                    shop_id: process.env.FEEXPAY_SHOP_ID,
                    amount,
                    currency: "XOF",
                    description: `Rechargement Maxi Views — ${user.email}`,
                    custom_id: reference,
                    callback_url: callbackUrl,
                    redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet?success=true`,
                }),
            },
        );

        if (!feexResponse.ok) {
            const err = await feexResponse.text();
            console.error("FeexPay error:", err);
            // Supprimer la transaction en échec
            await prisma.transaction.delete({ where: { reference } });
            return NextResponse.json(
                { error: "Erreur FeexPay" },
                { status: 502 },
            );
        }

        const feexData = (await feexResponse.json()) as {
            payment_url?: string;
        };

        return NextResponse.json({
            paymentUrl: feexData.payment_url,
            reference,
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
