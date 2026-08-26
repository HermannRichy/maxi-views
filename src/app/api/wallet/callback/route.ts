import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDepositConfirmed } from "@/lib/emails";
import { checkFeexPayStatus } from "@/lib/feexpay";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/callback
   Webhook FeexPay : crédite le solde utilisateur sur paiement réussi.
   Cette route est PUBLIQUE (pas d'auth).

   FeexPay ne documente aucun mécanisme de signature pour ce webhook
   (contrairement aux payouts, protégés par liste d'IP). Par prudence,
   on ne fait jamais confiance au statut envoyé dans le payload brut :
   on rappelle l'API FeexPay (authentifiée par notre clé secrète) pour
   obtenir le statut réel avant de créditer quoi que ce soit.
───────────────────────────────────────────────────────────────── */

interface FeexPayWebhookPayload {
    reference?: string;
    order_id?: string;
    status?: string;
    amount?: number;
}

export async function POST(req: NextRequest) {
    try {
        let body: FeexPayWebhookPayload;
        try {
            body = (await req.json()) as FeexPayWebhookPayload;
        } catch {
            return NextResponse.json(
                { error: "Payload JSON invalide" },
                { status: 400 },
            );
        }

        const reference = body.reference ?? body.order_id ?? null;
        if (!reference) {
            return NextResponse.json(
                { error: "Référence manquante dans le payload" },
                { status: 400 },
            );
        }

        const transaction = await prisma.transaction.findUnique({
            where: { reference },
            include: { user: true },
        });

        if (!transaction) {
            return NextResponse.json(
                { error: "Transaction inconnue" },
                { status: 404 },
            );
        }

        // Idempotence : ne pas retraiter une transaction déjà finalisée
        if (transaction.status !== "PENDING") {
            return NextResponse.json({ ok: true, message: "Déjà traité" });
        }

        // Ne jamais faire confiance au payload brut : on revérifie
        // directement auprès de FeexPay avec notre clé secrète.
        let verifiedStatus: string;
        try {
            const verified = await checkFeexPayStatus(reference);
            verifiedStatus = verified.status;
        } catch (err) {
            console.error("Vérification statut FeexPay échouée:", err);
            return NextResponse.json(
                { error: "Impossible de vérifier le statut" },
                { status: 502 },
            );
        }

        if (verifiedStatus === "SUCCESSFUL") {
            const [, updatedUser] = await prisma.$transaction([
                prisma.transaction.update({
                    where: { reference },
                    data: { status: "COMPLETED" },
                }),
                prisma.user.update({
                    where: { id: transaction.userId },
                    // Le montant est toujours pris en base (jamais depuis le payload)
                    data: { balance: { increment: transaction.amount } },
                }),
            ]);

            sendDepositConfirmed({
                to: transaction.user.email,
                name: transaction.user.name ?? "Utilisateur",
                amount: transaction.amount,
                newBalance: updatedUser.balance,
            }).catch(console.error);

            return NextResponse.json({ ok: true });
        }

        if (verifiedStatus === "FAILED") {
            await prisma.transaction.update({
                where: { reference },
                data: { status: "FAILED" },
            });

            return NextResponse.json({
                ok: true,
                message: "Paiement échoué enregistré",
            });
        }

        // Toujours PENDING côté FeexPay → on ignore, le webhook ou le
        // polling suivant retentera.
        return NextResponse.json({ ok: true, message: "Toujours en attente" });
    } catch (err) {
        console.error("Callback error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
