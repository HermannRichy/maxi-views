import { Section, Text, Heading, Button } from "@react-email/components";
import * as React from "react";
import Layout from "./Layout";

interface AdminNewOrderProps {
    orderId: string;
    customerEmail: string;
    serviceName: string;
    quantity: number;
    amount: number;
    link: string;
}

export const AdminNewOrderEmail = ({
    orderId = "ORD_XXX",
    customerEmail = "client@example.com",
    serviceName = "Vues TikTok",
    quantity = 5000,
    amount = 1500,
    link = "https://tiktok.com/@user/video",
}: AdminNewOrderProps) => {
    return (
        <Layout
            previewText={`Nouvelle commande - ${serviceName} (${amount} FCFA)`}
        >
            <Heading className="text-black text-[20px] font-normal text-center p-0 my-[10px] mx-0">
                🚨 Nouvelle commande !
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Un client vient de passer une nouvelle commande. L'argent a déjà
                été débité de son solde.
            </Text>

            <Section className="bg-gray-100 rounded p-[16px] my-[20px] border border-solid border-gray-200">
                <Text className="text-black text-[14px] font-bold m-0 mb-[8px]">
                    Détails de la commande ({orderId}) :
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Client :{" "}
                    <span className="font-bold text-black">
                        {customerEmail}
                    </span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Service :{" "}
                    <span className="font-bold text-black">{serviceName}</span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Quantité :{" "}
                    <span className="text-black">
                        {quantity.toLocaleString("fr-FR")}
                    </span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Total débité :{" "}
                    <span className="text-black">
                        {amount.toLocaleString("fr-FR")} FCFA
                    </span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mt-[12px] p-[8px] bg-white border border-gray-300 rounded overflow-x-auto">
                    👉 URL cible :{" "}
                    <a href={link} className="text-blue-600 underline">
                        {link}
                    </a>
                </Text>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
                Veuillez vous rendre sur le panel JustAnotherPanel pour passer
                la commande manuellement, puis changez le statut sur le
                Dashboard Admin Maxi Views.
            </Text>

            <Section className="text-center my-[32px]">
                <Button
                    href="https://maxiviews.me/admin/orders"
                    className="bg-[#23ce6b] text-white px-6 py-3 rounded text-[14px] font-bold text-center no-underline"
                >
                    Ouvrir le Panel Admin
                </Button>
            </Section>
        </Layout>
    );
};

export default AdminNewOrderEmail;
