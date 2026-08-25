import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const FROM = process.env.RESEND_FROM ?? "noreply@maxiviews.me";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@maxiviews.me";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/* ─── Types ─────────────────────────────────────────────────────── */
interface DepositConfirmedProps {
    to: string;
    name: string;
    amount: number;
    newBalance: number;
}

interface OrderCreatedUserProps {
    to: string;
    name: string;
    orderId: string;
    serviceName: string;
    network: string;
    quantity: number;
    amount: number;
}

interface OrderCreatedAdminProps {
    orderId: string;
    userName: string;
    userEmail: string;
    serviceName: string;
    network: string;
    quantity: number;
    amount: number;
    link: string;
}

interface OrderStatusChangedProps {
    to: string;
    name: string;
    orderId: string;
    serviceName: string;
    status: string;
    adminNote?: string | null;
}

/* ─── Status labels ─────────────────────────────────────────────── */
const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    PROCESSING: "En cours de traitement",
    COMPLETED: "Terminée",
    FAILED: "Échouée",
    CANCELLED: "Annulée",
};

/* ─── Helpers ───────────────────────────────────────────────────── */
function fcfa(amount: number) {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
}

function button(url: string, label: string) {
    return `
        <div style="text-align:center;margin:32px 0">
            <a href="${url}" style="background:#9542ff;color:#fff;padding:12px 28px;border-radius:6px;font-weight:700;text-decoration:none;font-size:15px">
                ${label}
            </a>
        </div>`;
}

function layout(title: string, body: string) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>${title}</title></head>
<body style="margin:0;font-family:sans-serif;background:#f4f4f5;padding:40px 0">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <div style="background:#9542ff;padding:24px 32px">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                <td style="width:32px;height:32px;background:rgba(255,255,255,.18);border-radius:8px;text-align:center;vertical-align:middle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle">
                        <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M12.597 17.981a9.467 9.467 0 0 1 -.597 .019c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6c-.205 .342 -.415 .67 -.63 .983" />
                        <path d="M16 22l5 -5" />
                        <path d="M21 21.5v-4.5h-4.5" />
                    </svg>
                </td>
                <td style="padding-left:10px">
                    <span style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.5px">Maxi<span style="opacity:.8"> Views</span></span>
                </td>
            </tr></table>
        </div>
        <div style="padding:32px">
            ${body}
            <hr style="border:none;border-top:1px solid #e4e4e7;margin:32px 0">
            <p style="font-size:12px;color:#71717a;margin:0">
                © ${new Date().getFullYear()} MaxiViews · <a href="${APP_URL}" style="color:#71717a">${APP_URL}</a>
            </p>
        </div>
    </div>
</body>
</html>`;
}

/* ─── Email senders ─────────────────────────────────────────────── */

type OtpType = "sign-in" | "email-verification" | "forget-password" | "change-email";

const OTP_SUBJECTS: Record<OtpType, string> = {
    "email-verification": "Vérifiez votre adresse email",
    "forget-password": "Réinitialisation de votre mot de passe",
    "sign-in": "Votre code de connexion",
    "change-email": "Confirmez votre nouvel email",
};

/** 0. Code de vérification à 6 chiffres (Better Auth emailOTP) */
export async function sendVerificationOtpEmail({
    email,
    otp,
    type,
}: {
    email: string;
    otp: string;
    type: OtpType;
}) {
    if (!resend) return;
    try {
        const { error } = await resend.emails.send({
            from: FROM,
            to: email,
            subject: OTP_SUBJECTS[type] ?? "Votre code de vérification",
            html: layout(
                OTP_SUBJECTS[type] ?? "Code de vérification",
                `
                <h2 style="color:#111;margin:0 0 8px">Votre code Maxi Views</h2>
                <p style="color:#3f3f46;margin:0 0 24px">Utilisez le code ci-dessous pour continuer. Il expire dans 5 minutes.</p>
                <div style="background:#f0eaff;border:1px solid #d2c2ff;border-radius:8px;padding:24px;margin-bottom:24px;text-align:center">
                    <p style="margin:0;font-size:36px;font-weight:900;letter-spacing:0.3em;color:#5e0eb3">${otp}</p>
                </div>
                <p style="color:#71717a;font-size:13px">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
            `,
            ),
        });
        if (error) console.error("Erreur d'envoi email OTP:", error);
    } catch (error) {
        console.error("Erreur d'envoi email OTP:", error);
    }
}

/** 0b. Nouveau message de contact → admin */
export async function sendContactMessage({
    name,
    email,
    subject,
    message,
}: {
    name: string;
    email: string;
    subject: string;
    message: string;
}) {
    if (!resend) return;
    try {
        const { error } = await resend.emails.send({
            from: FROM,
            to: ADMIN_EMAIL,
            replyTo: email,
            subject: `📨 Contact — ${subject}`,
            html: layout(
                "Nouveau message de contact",
                `
                <h2 style="color:#111;margin:0 0 8px">Nouveau message</h2>
                <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3f3f46">
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Nom</td><td style="font-weight:700">${name}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Email</td><td>${email}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Sujet</td><td>${subject}</td></tr>
                </table>
                <p style="margin-top:24px;color:#3f3f46;white-space:pre-wrap">${message}</p>
            `,
            ),
        });
        if (error) console.error("Erreur d'envoi email de contact:", error);
    } catch (error) {
        console.error("Erreur d'envoi email de contact:", error);
    }
}

/** 1. Dépôt confirmé → user */
export async function sendDepositConfirmed({
    to,
    name,
    amount,
    newBalance,
}: DepositConfirmedProps) {
    if (!resend) return;
    try {
        const { error } = await resend.emails.send({
            from: FROM,
            to,
            subject: `✅ Rechargement de ${fcfa(amount)} confirmé — Maxi Views`,
            html: layout(
                "Rechargement confirmé",
                `
                <h2 style="color:#111;margin:0 0 8px">Bonjour ${name} 👋</h2>
                <p style="color:#3f3f46;margin:0 0 24px">Votre rechargement a bien été pris en compte.</p>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px 24px;margin-bottom:24px">
                    <p style="margin:0;color:#15803d;font-size:14px">Montant crédité</p>
                    <p style="margin:4px 0 0;font-size:28px;font-weight:900;color:#15803d">${fcfa(amount)}</p>
                </div>
                <p style="color:#3f3f46;font-size:14px">Votre solde actuel : <strong>${fcfa(newBalance)}</strong></p>
                ${button(`${APP_URL}/dashboard/new-order`, "Commander un service")}
            `,
            ),
        });
        if (error) console.error("Erreur d'envoi email de dépôt confirmé:", error);
    } catch (error) {
        console.error("Erreur d'envoi email de dépôt confirmé:", error);
    }
}

/** 2. Nouvelle commande → user */
export async function sendOrderCreatedUser({
    to,
    name,
    orderId,
    serviceName,
    network,
    quantity,
    amount,
}: OrderCreatedUserProps) {
    if (!resend) return;
    try {
        const { error } = await resend.emails.send({
            from: FROM,
            to,
            subject: `🛒 Commande #${orderId.slice(-8).toUpperCase()} reçue — Maxi Views`,
            html: layout(
                "Commande reçue",
                `
                <h2 style="color:#111;margin:0 0 8px">Bonjour ${name} 👋</h2>
                <p style="color:#3f3f46;margin:0 0 24px">Votre commande a bien été enregistrée et est en attente de traitement.</p>
                <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3f3f46">
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Référence</td><td style="font-weight:700">#${orderId.slice(-8).toUpperCase()}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Réseau</td><td>${network}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Service</td><td>${serviceName}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Quantité</td><td>${quantity.toLocaleString("fr-FR")}</td></tr>
                    <tr><td style="padding:8px 0">Montant débité</td><td style="font-weight:700;color:#9542ff">${fcfa(amount)}</td></tr>
                </table>
                ${button(`${APP_URL}/dashboard/orders`, "Suivre ma commande")}
            `,
            ),
        });
        if (error) console.error("Erreur d'envoi email de commande (user):", error);
    } catch (error) {
        console.error("Erreur d'envoi email de commande (user):", error);
    }
}

/** 3. Nouvelle commande → admin */
export async function sendOrderCreatedAdmin({
    orderId,
    userName,
    userEmail,
    serviceName,
    network,
    quantity,
    amount,
    link,
}: OrderCreatedAdminProps) {
    if (!resend) return;
    try {
        const { error } = await resend.emails.send({
            from: FROM,
            to: ADMIN_EMAIL,
            subject: `🔔 Nouvelle commande #${orderId.slice(-8).toUpperCase()} — ${network} / ${serviceName}`,
            html: layout(
                "Nouvelle commande",
                `
                <h2 style="color:#111;margin:0 0 8px">Nouvelle commande reçue</h2>
                <p style="color:#3f3f46;margin:0 0 24px">Un utilisateur vient de passer une commande.</p>
                <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3f3f46">
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Référence</td><td style="font-weight:700">#${orderId.slice(-8).toUpperCase()}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Utilisateur</td><td>${userName} (${userEmail})</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Réseau</td><td>${network}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Service</td><td>${serviceName}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Quantité</td><td>${quantity.toLocaleString("fr-FR")}</td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #f4f4f5">Lien / cible</td><td><a href="${link}">${link}</a></td></tr>
                    <tr><td style="padding:8px 0">Montant</td><td style="font-weight:700;color:#9542ff">${fcfa(amount)}</td></tr>
                </table>
                ${button(`${APP_URL}/admin/orders`, "Gérer les commandes")}
            `,
            ),
        });
        if (error) console.error("Erreur d'envoi email de commande (admin):", error);
    } catch (error) {
        console.error("Erreur d'envoi email de commande (admin):", error);
    }
}

/** 4. Statut commande modifié → user */
export async function sendOrderStatusChanged({
    to,
    name,
    orderId,
    serviceName,
    status,
    adminNote,
}: OrderStatusChangedProps) {
    if (!resend) return;
    const label = STATUS_LABELS[status] ?? status;
    const emoji =
        status === "COMPLETED"
            ? "🎉"
            : status === "FAILED"
              ? "❌"
              : status === "PROCESSING"
                ? "⚙️"
                : "ℹ️";
    try {
        const { error } = await resend.emails.send({
            from: FROM,
            to,
            subject: `${emoji} Commande #${orderId.slice(-8).toUpperCase()} — ${label}`,
            html: layout(
                `Statut : ${label}`,
                `
                <h2 style="color:#111;margin:0 0 8px">Bonjour ${name} 👋</h2>
                <p style="color:#3f3f46;margin:0 0 24px">Le statut de votre commande <strong>#${orderId.slice(-8).toUpperCase()}</strong> a été mis à jour.</p>
                <div style="background:#f0eaff;border:1px solid #d2c2ff;border-radius:8px;padding:20px 24px;margin-bottom:24px">
                    <p style="margin:0;color:#5e0eb3;font-size:14px">Nouveau statut</p>
                    <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#5e0eb3">${emoji} ${label}</p>
                </div>
                <p style="color:#3f3f46;font-size:14px">Service : <strong>${serviceName}</strong></p>
                ${adminNote ? `<p style="color:#71717a;font-size:13px;background:#f4f4f5;border-radius:6px;padding:12px">Note : ${adminNote}</p>` : ""}
                ${button(`${APP_URL}/dashboard/orders`, "Voir mes commandes")}
            `,
            ),
        });
        if (error) console.error("Erreur d'envoi email de changement de statut:", error);
    } catch (error) {
        console.error("Erreur d'envoi email de changement de statut:", error);
    }
}
