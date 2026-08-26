import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    FEEXPAY_MIN_AMOUNT,
    FEEXPAY_MAX_AMOUNT,
    getFeexPayNetwork,
    initiateFeexPayPayin,
} from "@/lib/feexpay";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/deposit
   Déclenche un push Mobile Money FeexPay (requesttopay) vers le
   téléphone du client. Ne renvoie pas d'URL : la confirmation arrive
   par webhook sur /api/wallet/callback.
───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        const user = await requireUser();

        const { amount, phoneNumber, network: networkSlug } = (await req.json()) as {
            amount: number;
            phoneNumber: string;
            network: string;
        };

        if (
            !amount ||
            amount < 500 ||
            amount < FEEXPAY_MIN_AMOUNT ||
            amount > FEEXPAY_MAX_AMOUNT
        ) {
            return NextResponse.json(
                { error: "Le montant minimum est de 500 FCFA (maximum 2 000 000 FCFA)" },
                { status: 400 },
            );
        }

        const network = getFeexPayNetwork(networkSlug);
        if (!network) {
            return NextResponse.json(
                { error: "Réseau Mobile Money invalide" },
                { status: 400 },
            );
        }

        const localNumber = (phoneNumber ?? "").replace(/\D/g, "");
        if (localNumber.length < 8) {
            return NextResponse.json(
                { error: "Numéro de téléphone invalide" },
                { status: 400 },
            );
        }
        const fullPhoneNumber = `${network.countryCallingCode}${localNumber}`;

        const reference = `DEP_${user.id}_${Date.now()}`;

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

        try {
            await initiateFeexPayPayin({
                network,
                phoneNumber: fullPhoneNumber,
                amount,
                description: `Rechargement Maxi Views`,
                callback_info: reference,
            });
        } catch (err) {
            // L'appel FeexPay a échoué : on retire la transaction PENDING
            // créée juste avant, elle n'a jamais été soumise.
            await prisma.transaction.update({
                where: { reference },
                data: { status: "FAILED" },
            });

            const message =
                err instanceof Error && err.message !== "FEEXPAY_NOT_CONFIGURED"
                    ? err.message
                    : "FeexPay n'est pas configuré ou a rejeté la demande";
            return NextResponse.json({ error: message }, { status: 502 });
        }

        return NextResponse.json({
            reference,
            message:
                "Vérifiez votre téléphone pour confirmer le paiement Mobile Money.",
        });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        console.error("Deposit error:", err);
        return NextResponse.json(
            { error: "Erreur serveur lors de l'initialisation du paiement" },
            { status: 500 },
        );
    }
}
