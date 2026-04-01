import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FedaPay, Transaction } from "fedapay";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/deposit
   Initie un paiement FedaPay via SDK Node.js et renvoie l'url de redirection.
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

        const fedapaySecret = process.env.FEDAPAY_SECRET_KEY;
        const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "").trim();

        if (!fedapaySecret || !appUrl) {
            return NextResponse.json(
                { error: "FedaPay ou URL de l'app non configuré" },
                { status: 503 },
            );
        }

        // Configuration du SDK FedaPay
        FedaPay.setApiKey(fedapaySecret);
        FedaPay.setEnvironment(
            fedapaySecret.includes("live") ? "live" : "sandbox"
        );

        // Nettoyage de l'URL pour éviter les double-slash
        const baseUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
        
        // Générer une référence unique
        const reference = `DEP_${user.id}_${Date.now()}`;
        const callbackUrl = `${baseUrl}/api/wallet/callback`;

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

        // Appel au SDK pour créer la transaction FedaPay
        const transaction = await Transaction.create({
            description: `Rechargement Maxi Views — ${user.email}`,
            amount: amount,
            callback_url: callbackUrl,
            currency: { iso: "XOF" },
            custom_metadata: { reference },
            customer: {
                email: user.email,
                firstname: user.name ?? "Client",
            },
        });

        // Générer le lien de paiement via le token
        const token = await transaction.generateToken();

        return NextResponse.json({
            url: token.url,
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
        return NextResponse.json({ error: "Erreur serveur lors de l'initialisation du paiement FedaPay" }, { status: 500 });
    }
}

