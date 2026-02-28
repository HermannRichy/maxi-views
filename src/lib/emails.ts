import { resend } from "./resend";

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
            <a href="${url}" style="background:#2563eb;color:#fff;padding:12px 28px;border-radius:6px;font-weight:700;text-decoration:none;font-size:15px">
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
        <div style="background:#2563eb;padding:24px 32px">
            <span style="color:#fff;font-size:20px;font-weight:900;letter-spacing:-0.5px">Maxi<span style="opacity:.8"> Views</span></span>
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

/** 1. Dépôt confirmé → user */
export async function sendDepositConfirmed({
    to,
    name,
    amount,
    newBalance,
}: DepositConfirmedProps) {
    return resend.emails.send({
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
    return resend.emails.send({
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
                <tr><td style="padding:8px 0">Montant débité</td><td style="font-weight:700;color:#2563eb">${fcfa(amount)}</td></tr>
            </table>
            ${button(`${APP_URL}/dashboard/orders`, "Suivre ma commande")}
        `,
        ),
    });
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
    return resend.emails.send({
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
                <tr><td style="padding:8px 0">Montant</td><td style="font-weight:700;color:#2563eb">${fcfa(amount)}</td></tr>
            </table>
            ${button(`${APP_URL}/admin/orders`, "Gérer les commandes")}
        `,
        ),
    });
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
    const label = STATUS_LABELS[status] ?? status;
    const emoji =
        status === "COMPLETED"
            ? "🎉"
            : status === "FAILED"
              ? "❌"
              : status === "PROCESSING"
                ? "⚙️"
                : "ℹ️";
    return resend.emails.send({
        from: FROM,
        to,
        subject: `${emoji} Commande #${orderId.slice(-8).toUpperCase()} — ${label}`,
        html: layout(
            `Statut : ${label}`,
            `
            <h2 style="color:#111;margin:0 0 8px">Bonjour ${name} 👋</h2>
            <p style="color:#3f3f46;margin:0 0 24px">Le statut de votre commande <strong>#${orderId.slice(-8).toUpperCase()}</strong> a été mis à jour.</p>
            <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:20px 24px;margin-bottom:24px">
                <p style="margin:0;color:#1d4ed8;font-size:14px">Nouveau statut</p>
                <p style="margin:4px 0 0;font-size:22px;font-weight:900;color:#1d4ed8">${emoji} ${label}</p>
            </div>
            <p style="color:#3f3f46;font-size:14px">Service : <strong>${serviceName}</strong></p>
            ${adminNote ? `<p style="color:#71717a;font-size:13px;background:#f4f4f5;border-radius:6px;padding:12px">Note : ${adminNote}</p>` : ""}
            ${button(`${APP_URL}/dashboard/orders`, "Voir mes commandes")}
        `,
        ),
    });
}
