import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { sendDepositConfirmed } from "@/lib/emails";

/* ─────────────────────────────────────────────────────────────────
   GET|POST /api/wallet/callback
   Webhook FedaPay : crédite le solde utilisateur sur paiement réussi.
   Cette route est PUBLIQUE (pas de auth Clerk).

   Format header X-FEDAPAY-SIGNATURE : t=<timestamp>,s=<hmac_hex>
   La signature HMAC-SHA256 est calculée sur "<timestamp>.<payload_brut>".
───────────────────────────────────────────────────────────────── */

const SIGNATURE_TOLERANCE_SECONDS = 300; // 5 minutes

interface ParsedSignatureHeader {
    timestamp: number;
    signatures: string[];
}

function parseSignatureHeader(header: string): ParsedSignatureHeader | null {
    const result: ParsedSignatureHeader = { timestamp: -1, signatures: [] };

    for (const part of header.split(",")) {
        const [key, value] = part.split("=");
        if (key === "t") {
            result.timestamp = parseInt(value, 10);
        } else if (key === "s") {
            result.signatures.push(value);
        }
    }

    if (result.timestamp === -1 || result.signatures.length === 0) {
        return null;
    }

    return result;
}

function verifyFedaPaySignature(
    payload: string,
    header: string,
    secret: string,
): { valid: boolean; error?: string } {
    const parsed = parseSignatureHeader(header);

    if (!parsed) {
        return {
            valid: false,
            error: "Impossible de parser le header de signature",
        };
    }

    // Vérification de la tolérance temporelle (anti-replay)
    const now = Math.floor(Date.now() / 1000);
    if (now - parsed.timestamp > SIGNATURE_TOLERANCE_SECONDS) {
        return {
            valid: false,
            error: "Timestamp trop ancien (possible attaque par replay)",
        };
    }

    // FedaPay signe sur "<timestamp>.<payload_brut>"
    const signedPayload = `${parsed.timestamp}.${payload}`;
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(signedPayload, "utf8")
        .digest("hex");

    const signatureFound = parsed.signatures.some((sig) => {
        try {
            const sigBuf = Buffer.from(sig, "utf8");
            const expectedBuf = Buffer.from(expectedSignature, "utf8");
            return (
                sigBuf.length === expectedBuf.length &&
                crypto.timingSafeEqual(sigBuf, expectedBuf)
            );
        } catch {
            return false;
        }
    });

    if (!signatureFound) {
        return { valid: false, error: "Signature invalide" };
    }

    return { valid: true };
}

async function handleCallback(req: NextRequest) {
    try {
        // ── GET : redirect navigateur depuis FedaPay ──────────────────────
        if (req.method === "GET") {
            return NextResponse.redirect(
                `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/wallet`,
            );
        }

        // ── POST : webhook FedaPay ────────────────────────────────────────
        const signatureHeader = req.headers.get("x-fedapay-signature");
        const payload = await req.text();

        if (!signatureHeader) {
            return NextResponse.json(
                { error: "Header de signature manquant" },
                { status: 400 },
            );
        }

        const secret = process.env.FEDAPAY_WEBHOOK_SECRET;
        if (!secret) {
            return NextResponse.json(
                { error: "Webhook FedaPay non configuré" },
                { status: 503 },
            );
        }

        // Vérification de la signature
        const { valid, error: sigError } = verifyFedaPaySignature(
            payload,
            signatureHeader,
            secret,
        );
        if (!valid) {
            console.warn("Webhook FedaPay — signature rejetée :", sigError);
            return NextResponse.json({ error: sigError }, { status: 400 });
        }

        // Parsing du body
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

        // Filtrage : on ne traite que les événements transaction.*
        if (!eventName || !eventName.startsWith("transaction.")) {
            return NextResponse.json({ ok: true, message: "Événement ignoré" });
        }

        const reference: string | null =
            body?.entity?.custom_metadata?.reference ?? null;
        const status: string | null = body?.entity?.status ?? null;

        if (!reference) {
            return NextResponse.json(
                { error: "Référence manquante dans le payload" },
                { status: 400 },
            );
        }

        // Récupération de la transaction en base
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
        // Exception : un remboursement peut arriver après COMPLETED
        const isRefundEvent = (status ?? "").toLowerCase() === "refunded";
        if (
            (transaction.status === "COMPLETED" && !isRefundEvent) ||
            transaction.status === "FAILED"
        ) {
            return NextResponse.json({ ok: true, message: "Déjà traité" });
        }

        const normalizedStatus = (status ?? "").toLowerCase();
        const isSuccess = normalizedStatus === "approved";
        const isFailureTerminal = [
            "declined",
            "canceled",
            "cancelled",
            "failed",
            "expired", // transaction.expired → dépôt expiré sans paiement
            "deleted", // transaction.deleted → supprimée côté FedaPay
        ].includes(normalizedStatus);

        const isRefunded = normalizedStatus === "refunded";

        // ── Paiement approuvé ─────────────────────────────────────────────
        if (isSuccess) {
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

            // Email de confirmation (non bloquant)
            sendDepositConfirmed({
                to: transaction.user.email,
                name: transaction.user.name ?? "Utilisateur",
                amount: transaction.amount,
                newBalance: updatedUser.balance,
            }).catch(console.error);

            return NextResponse.json({ ok: true });
        }

        // ── Échec terminal ────────────────────────────────────────────────
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

        // ── Remboursement ─────────────────────────────────────────────────
        if (isRefunded && transaction.status === "COMPLETED") {
            await prisma.$transaction([
                prisma.transaction.update({
                    where: { reference },
                    data: { status: "FAILED" }, // statut le plus proche dispo dans le schéma
                }),
                prisma.user.update({
                    where: { id: transaction.userId },
                    // Décrémente sans passer sous 0
                    data: {
                        balance: {
                            decrement: transaction.amount,
                        },
                    },
                }),
            ]);

            return NextResponse.json({
                ok: true,
                message: "Remboursement enregistré, solde décrémenté",
            });
        }

        // Statut non terminal (ex: transaction.updated en cours) → ignorer
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
