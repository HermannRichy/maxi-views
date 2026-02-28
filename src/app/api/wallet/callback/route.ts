import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendDepositConfirmed } from "@/lib/emails";

/* ─────────────────────────────────────────────────────────────────
   GET|POST /api/wallet/callback
   Webhook FeexPay : crédite le solde utilisateur sur paiement réussi.
   Cette route est PUBLIQUE (pas de auth Clerk).
───────────────────────────────────────────────────────────────── */
async function handleCallback(req: NextRequest) {
    try {
        // FeexPay peut envoyer en GET (query params) ou POST (json/form)
        let reference: string | null = null;
        let status: string | null = null;

        if (req.method === "GET") {
            reference = req.nextUrl.searchParams.get("custom_id");
            status = req.nextUrl.searchParams.get("status");
        } else {
            const body = (await req.json().catch(() => ({}))) as Record<
                string,
                string
            >;
            reference = body.custom_id ?? body.reference ?? null;
            status = body.status ?? null;
        }

        if (!reference) {
            return NextResponse.json(
                { error: "Référence manquante" },
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

        // Statut FeexPay : "successful" | "success" | "paid" → COMPLETED
        const isSuccess = [
            "successful",
            "success",
            "paid",
            "approved",
        ].includes((status ?? "").toLowerCase());

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

        // Echec FeexPay
        await prisma.transaction.update({
            where: { reference },
            data: { status: "FAILED" },
        });

        return NextResponse.json({
            ok: true,
            message: "Paiement échoué enregistré",
        });
    } catch (err) {
        console.error("Callback error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const GET = handleCallback;
export const POST = handleCallback;
