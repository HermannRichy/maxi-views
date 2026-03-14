import { Resend } from "resend";
import { DepositReceiptEmail } from "@/emails/DepositReceipt";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmation";
import { OrderStatusUpdateEmail } from "@/emails/OrderStatusUpdate";
import { AdminNewOrderEmail } from "@/emails/AdminNewOrder";

export const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;
const fromEmail =
    process.env.RESEND_FROM || "Maxi Views <noreply@maxiviews.me>";

export async function sendDepositConfirmed({
    to,
    name,
    amount,
    reference,
}: {
    to: string;
    name: string;
    amount: number;
    reference: string;
}) {
    if (!resend) return;
    try {
        await resend.emails.send({
            from: fromEmail,
            to,
            subject: `Reçu de paiement confirmé - ${amount.toLocaleString("fr-FR")} FCFA`,
            react: DepositReceiptEmail({ name, amount, reference }),
        });
    } catch (error) {
        console.error("Erreur d'envoi email DepositReceipt:", error);
    }
}

export async function sendOrderConfirmation({
    to,
    name,
    orderId,
    serviceName,
    quantity,
    amount,
    link,
}: {
    to: string;
    name: string;
    orderId: string;
    serviceName: string;
    quantity: number;
    amount: number;
    link: string;
}) {
    if (!resend) return;
    try {
        await resend.emails.send({
            from: fromEmail,
            to,
            subject: `Confirmation de votre commande - ${serviceName}`,
            react: OrderConfirmationEmail({
                name,
                orderId,
                serviceName,
                quantity,
                amount,
                link,
            }),
        });
    } catch (error) {
        console.error("Erreur d'envoi email OrderConfirmation:", error);
    }
}

export async function sendOrderStatusUpdate({
    to,
    name,
    orderId,
    serviceName,
    status,
}: {
    to: string;
    name: string;
    orderId: string;
    serviceName: string;
    status: string;
}) {
    if (!resend) return;
    try {
        await resend.emails.send({
            from: fromEmail,
            to,
            subject: `Mise à jour de votre commande N°${orderId}`,
            react: OrderStatusUpdateEmail({
                name,
                orderId,
                serviceName,
                status,
            }),
        });
    } catch (error) {
        console.error("Erreur d'envoi email OrderStatusUpdate:", error);
    }
}

export async function sendAdminNewOrderAlert({
    orderId,
    customerEmail,
    serviceName,
    quantity,
    amount,
    link,
}: {
    orderId: string;
    customerEmail: string;
    serviceName: string;
    quantity: number;
    amount: number;
    link: string;
}) {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!resend || !adminEmail) return;

    try {
        await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `🚨 Maxi Views - Nouvelle commande (${amount.toLocaleString("fr-FR")} FCFA)`,
            react: AdminNewOrderEmail({
                orderId,
                customerEmail,
                serviceName,
                quantity,
                amount,
                link,
            }),
        });
    } catch (error) {
        console.error("Erreur d'envoi email AdminNewOrder:", error);
    }
}
