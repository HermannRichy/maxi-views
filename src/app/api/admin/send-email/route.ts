import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { sendAdminMessage } from "@/lib/emails";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─────────────────────────────────────────────────────────────────
   POST /api/admin/send-email
   Envoie un email libre (objet + message) à une adresse donnée,
   qu'elle corresponde à un utilisateur existant ou non.
───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

        const body = (await req.json()) as {
            to?: string;
            subject?: string;
            message?: string;
        };
        const { to, subject, message } = body;

        if (!to || !EMAIL_REGEX.test(to)) {
            return NextResponse.json(
                { error: "Adresse email invalide" },
                { status: 400 },
            );
        }
        if (!subject || !message) {
            return NextResponse.json(
                { error: "Objet et message obligatoires" },
                { status: 400 },
            );
        }

        await sendAdminMessage({ to, subject, message });

        return NextResponse.json({ ok: true });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 },
            );
        console.error("Send admin email error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
