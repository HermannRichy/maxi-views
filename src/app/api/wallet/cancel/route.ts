import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   POST /api/wallet/cancel
   Marque une transaction de dépôt comme échouée si le client ferme le widget
───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        const user = await requireUser();
        const { reference } = await req.json();

        if (!reference) {
            return NextResponse.json(
                { error: "Référence manquante" },
                { status: 400 },
            );
        }

        // On ne met à jour que si c'est PENDING pour ne pas écraser COMPLETED
        await prisma.transaction.updateMany({
            where: {
                reference,
                userId: user.id,
                status: "PENDING",
                type: "CREDIT",
            },
            data: {
                status: "FAILED",
            },
        });

        return NextResponse.json({ ok: true });
    } catch (err: any) {
        if (err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        console.error("Cancel transaction error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
