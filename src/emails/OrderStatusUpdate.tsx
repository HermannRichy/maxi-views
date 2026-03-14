import { Section, Text, Heading, Button } from "@react-email/components";
import * as React from "react";
import Layout from "./Layout";

interface OrderStatusUpdateProps {
    name: string;
    orderId: string;
    serviceName: string;
    status: string;
}

const statusDictionary: Record<string, { label: string; color: string }> = {
    PROCESSING: { label: "En cours de traitement", color: "#3b82f6" }, // blue-500
    COMPLETED: { label: "Complétée", color: "#22c55e" }, // green-500
    CANCELLED: { label: "Annulée et remboursée", color: "#64748b" }, // slate-500
    FAILED: { label: "Échec technique (Remboursé)", color: "#ef4444" }, // red-500
};

export const OrderStatusUpdateEmail = ({
    name = "Client",
    orderId = "ORD_XXX",
    serviceName = "Vues TikTok",
    status = "COMPLETED",
}: OrderStatusUpdateProps) => {
    const statusData = statusDictionary[status] || {
        label: status,
        color: "#000000",
    };

    return (
        <Layout
            previewText={`Votre commande est maintenant : ${statusData.label}`}
        >
            <Heading className="text-black text-[20px] font-normal text-center p-0 my-[10px] mx-0">
                Mise à jour de votre commande
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Bonjour {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Le statut de votre commande <strong>{serviceName}</strong> (N°{" "}
                {orderId}) a été mis à jour par notre équipe.
            </Text>

            <Section className="text-center my-[32px]">
                <Text
                    className="inline-block px-[16px] py-[8px] rounded text-white font-bold text-[16px] m-0"
                    style={{ backgroundColor: statusData.color }}
                >
                    Nouveau statut : {statusData.label}
                </Text>
            </Section>

            {status === "COMPLETED" && (
                <Text className="text-black text-[14px] leading-[24px]">
                    La livraison de votre commande est terminée ! Merci de votre
                    confiance.
                </Text>
            )}

            {(status === "CANCELLED" || status === "FAILED") && (
                <Text className="text-black text-[14px] leading-[24px]">
                    Nous n'avons pas pu compléter cette commande. Le montant a
                    été automatiquement recrédité sur votre portefeuille Maxi
                    Views. Vous pouvez repasser commande avec un autre lien.
                </Text>
            )}

            <Section className="text-center my-[32px]">
                <Button
                    href="https://maxiviews.me/dashboard/orders"
                    className="bg-black text-white px-6 py-3 rounded text-[14px] font-semibold text-center no-underline"
                >
                    Voir mes commandes
                </Button>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
                L'équipe Maxi Views
            </Text>
        </Layout>
    );
};

export default OrderStatusUpdateEmail;
