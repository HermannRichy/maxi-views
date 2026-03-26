import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendDepositConfirmed } from "@/lib/emails";

/* ─────────────────────────────────────────────────────────────────
   GET|POST /api/wallet/callback
   Webhook FedaPay : crédite le solde utilisateur sur paiement réussi.
   Cette route est PUBLIQUE (pas de auth Clerk).
───────────────────────────────────────────────────────────────── */
async function handleCallback(req: NextRequest) {
    try {
        let reference: string | null = null;
        let status: string | null = null;

        if (req.method === "GET") {
            // Callback browser redirect depuis FedaPay: ?status=approved&id=...
            // Note: Le FedaPay redirect ne contient pas le custom_metadata, on dépendra plutôt du webhook POST pour la validation serveur.
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet`,
            );
        } else {
            // Webhook POST envoyé par FedaPay
            const signature = req.headers.get("x-fedapay-signature");
            const payload = await req.text();

            if (!signature) {
                return NextResponse.json(
                    { error: "Signature manquante" },
                    { status: 400 },
                );
            }

            // Vérification de la signature FedaPay (OBLIGATOIRE)
            // Utiliser la clé secrète dédiée au webhook (signing secret), pas la clé API.
            const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
            if (!secret) {
                return NextResponse.json(
                    { error: "Webhook FedaPay non configuré" },
                    { status: 503 },
                );
            }

            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(payload)
                .digest("hex");

            const sigBuf = Buffer.from(signature, "utf8");
            const expectedBuf = Buffer.from(expectedSignature, "utf8");
            const signaturesMatch =
                sigBuf.length === expectedBuf.length &&
                crypto.timingSafeEqual(sigBuf, expectedBuf);

            if (!signaturesMatch) {
                return NextResponse.json(
                    { error: "Signature invalide" },
                    { status: 400 },
                );
            }

            let body: any;
            try {
                body = JSON.parse(payload);
            } catch {
                return NextResponse.json(
                    { error: "Payload JSON invalide" },
                    { status: 400 },
                );
            }

            const eventName = body?.name as string | undefined;
            // FedaPay structure: { name: "transaction.approved", entity: { status: "approved", custom_metadata: { reference: "DEP_..." } } }
            if (body.entity) {
                reference = body.entity.custom_metadata?.reference ?? null;
                status = body.entity.status ?? null;
            }

            // Ne traiter que les événements transaction.* (défense en profondeur)
            if (!eventName || !eventName.startsWith("transaction.")) {
                return NextResponse.json({ ok: true, message: "Événement ignoré" });
            }
        }

        if (!reference) {
            return NextResponse.json(
                { error: "Référence manquante dans le webhook" },
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

        // Idempotence : ne pas retraiter
        if (transaction.status === "COMPLETED") {
            return NextResponse.json({ ok: true, message: "Déjà traité" });
        }

        // Statut FedaPay : "approved" → COMPLETED
        const normalizedStatus = (status ?? "").toLowerCase();
        const isSuccess = normalizedStatus === "approved";
        const isFailureTerminal = ["declined", "canceled", "cancelled", "failed"].includes(
            normalizedStatus,
        );

        if (isSuccess) {
            const [updatedTx, updatedUser] = await prisma.$transaction([
                prisma.transaction.update({
                    where: { reference },
                    data: { status: "COMPLETED" },
                }),
                prisma.user.update({
                    where: { id: transaction.userId },
                    data: { balance: { increment: transaction.amount } },
                }),
            ]);

            // Envoi email de confirmation (non bloquant)
            sendDepositConfirmed({
                to: transaction.user.email,
                name: transaction.user.name ?? "Utilisateur",
                amount: transaction.amount,
                newBalance: updatedUser.balance,
            }).catch(console.error);

            return NextResponse.json({ ok: true });
        }

        // Échec terminal uniquement (ne pas marquer FAILED sur statuts non terminaux)
        if (isFailureTerminal) {
            await prisma.transaction.update({
                where: { reference },
                data: { status: "FAILED" },
            });

            return NextResponse.json({
                ok: true,
                message: "Paiement échoué enregistré",
            });
        }

        return NextResponse.json({
            ok: true,
            message: "Statut non terminal ignoré",
        });
    } catch (err) {
        console.error("Callback error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const GET = handleCallback;
export const POST = handleCallback;
