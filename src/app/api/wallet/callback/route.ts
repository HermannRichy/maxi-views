import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendDepositConfirmed } from "@/lib/emails";
import { checkFeexPayStatus } from "@/lib/feexpay";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/callback
   Webhook FeexPay : crédite le solde utilisateur sur paiement réussi.
   Cette route est PUBLIQUE (pas d'auth de session).

   FeexPay ne documente pas de signature HMAC sur ce webhook, mais son
   dashboard permet d'ajouter un en-tête "Authorization: Bearer <secret>"
   personnalisé envoyé à chaque appel — c'est notre premier filtre.
   En complément (défense en profondeur), on ne fait jamais confiance
   au statut du payload brut : on revérifie toujours auprès de l'API
   FeexPay avant de créditer quoi que ce soit.
───────────────────────────────────────────────────────────────── */

interface FeexPayWebhookPayload {
    reference?: string;
    order_id?: string;
    status?: string;
    amount?: number;
}

function isAuthorized(req: NextRequest): boolean {
    const expected = process.env.FEEXPAY_WEBHOOK_SECRET;
    if (!expected) return true; // pas configuré : ne bloque pas (dev/preview)

    const header = req.headers.get("authorization") ?? "";
    const provided = header.replace(/^Bearer\s+/i, "");

    const providedBuf = Buffer.from(provided);
    const expectedBuf = Buffer.from(expected);
    return (
        providedBuf.length === expectedBuf.length &&
        crypto.timingSafeEqual(providedBuf, expectedBuf)
    );
}

export async function POST(req: NextRequest) {
    try {
        if (!isAuthorized(req)) {
            console.warn("Webhook FeexPay — en-tête Authorization invalide ou manquant");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

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
