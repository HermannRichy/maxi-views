import { Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import Layout from "./Layout";

interface OrderConfirmationProps {
    name: string;
    orderId: string;
    serviceName: string;
    quantity: number;
    amount: number;
    link: string;
}

export const OrderConfirmationEmail = ({
    name = "Client",
    orderId = "ORD_XXX",
    serviceName = "Vues TikTok",
    quantity = 5000,
    amount = 1500,
    link = "https://tiktok.com/@user/video",
}: OrderConfirmationProps) => {
    return (
        <Layout previewText={`Confirmation de votre commande - ${serviceName}`}>
            <Heading className="text-black text-[20px] font-normal text-center p-0 my-[10px] mx-0">
                Commande Reçue !
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Bonjour {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Nous avons bien reçu votre commande pour{" "}
                <strong>{serviceName}</strong>. Notre système va la traiter sous
                peu.
            </Text>

            <Section className="bg-gray-100 rounded p-[16px] my-[20px] border border-solid border-gray-200">
                <Text className="text-black text-[14px] font-bold m-0 mb-[8px]">
                    Récapitulatif de la commande :
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    N° Commande :{" "}
                    <span className="font-bold text-black">{orderId}</span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Quantité :{" "}
                    <span className="font-bold text-black">
                        {quantity.toLocaleString("fr-FR")}
                    </span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Lien cible :{" "}
                    <a href={link} className="text-[#23ce6b] underline">
                        {link}
                    </a>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0">
                    Montant débité :{" "}
                    <span className="text-black">
                        {amount.toLocaleString("fr-FR")} FCFA
                    </span>
                </Text>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
                Vous pouvez suivre l'état d'avancement de votre commande
                directement depuis votre tableau de bord Maxi Views.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                L'équipe Maxi Views
            </Text>
        </Layout>
    );
};

export default OrderConfirmationEmail;
