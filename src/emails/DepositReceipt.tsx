import { Section, Text, Heading } from "@react-email/components";
import * as React from "react";
import Layout from "./Layout";

interface DepositReceiptProps {
    name: string;
    amount: number;
    reference: string;
}

export const DepositReceiptEmail = ({
    name = "Client",
    amount = 5000,
    reference = "DEP_XXX",
}: DepositReceiptProps) => {
    return (
        <Layout previewText={`Reçu de rechargement - ${amount} FCFA`}>
            <Heading className="text-black text-[20px] font-normal text-center p-0 my-[10px] mx-0">
                Paiement Confirmé
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
                Bonjour {name},
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Nous confirmons que votre portefeuille Maxi Views a été crédité
                avec succès.
            </Text>

            <Section className="bg-gray-100 rounded p-[16px] my-[20px] border border-solid border-gray-200">
                <Text className="text-black text-[14px] font-bold m-0 mb-[8px]">
                    Détails de la transaction :
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Montant :{" "}
                    <span className="font-bold text-black">
                        {amount.toLocaleString("fr-FR")} FCFA
                    </span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0 mb-[4px]">
                    Référence : <span className="text-black">{reference}</span>
                </Text>
                <Text className="text-gray-600 text-[14px] m-0">
                    Date :{" "}
                    <span className="text-black">
                        {new Date().toLocaleDateString("fr-FR")}
                    </span>
                </Text>
            </Section>

            <Text className="text-black text-[14px] leading-[24px]">
                Vous pouvez dès maintenant utiliser ce solde pour booster vos
                réseaux sociaux depuis votre tableau de bord.
            </Text>
            <Text className="text-black text-[14px] leading-[24px]">
                Merci pour votre confiance,
                <br />
                L'équipe Maxi Views
            </Text>
        </Layout>
    );
};

export default DepositReceiptEmail;
