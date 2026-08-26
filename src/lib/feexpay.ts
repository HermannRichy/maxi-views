import "server-only";
import type { FeexPayNetwork } from "./feexpay-networks";

export {
    FEEXPAY_NETWORKS,
    FEEXPAY_COUNTRIES,
    FEEXPAY_MIN_AMOUNT,
    FEEXPAY_MAX_AMOUNT,
    getFeexPayNetwork,
    type FeexPayNetwork,
} from "./feexpay-networks";

const FEEXPAY_BASE_URL = "https://api-v2.feexpay.me/api";

export type FeexPayStatus = "PENDING" | "SUCCESSFUL" | "FAILED";

export interface FeexPayPayinResponse {
    reference: string;
    message: string;
    status: FeexPayStatus;
    amount: number;
    description?: string;
    callback_info?: string | null;
    phoneNumber: string;
}

export interface FeexPayStatusResponse {
    reference: string;
    amount: number;
    phoneNumber: string;
    status: FeexPayStatus;
    reason?: string;
}

function getCredentials() {
    const apiKey = process.env.FEEXPAY_API_KEY;
    const shop = process.env.FEEXPAY_SHOP_ID;
    if (!apiKey || !shop) {
        throw new Error("FEEXPAY_NOT_CONFIGURED");
    }
    return { apiKey, shop };
}

/**
 * Déclenche un push Mobile Money (payin) : FeexPay envoie une demande de
 * confirmation directement sur le téléphone du client. Renvoie un statut
 * PENDING immédiat — la confirmation finale arrive par webhook.
 */
export async function initiateFeexPayPayin({
    network,
    phoneNumber,
    amount,
    description,
    callback_info,
}: {
    network: FeexPayNetwork;
    phoneNumber: string;
    amount: number;
    description?: string;
    callback_info?: string;
}): Promise<FeexPayPayinResponse> {
    const { apiKey, shop } = getCredentials();

    const res = await fetch(
        `${FEEXPAY_BASE_URL}/transactions/public/requesttopay/${network.slug}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                shop,
                amount,
                phoneNumber,
                ...(description ? { description } : {}),
                ...(callback_info ? { callback_info } : {}),
            }),
        },
    );

    const data = await res.json();

    if (!res.ok) {
        const message =
            typeof data?.message === "string"
                ? data.message
                : Array.isArray(data?.message)
                  ? data.message.join(", ")
                  : "Échec de l'initialisation du paiement FeexPay";
        throw new Error(message);
    }

    return data as FeexPayPayinResponse;
}

/**
 * Vérifie le statut réel d'une transaction directement auprès de FeexPay
 * (appel authentifié serveur → serveur). À utiliser pour confirmer un
 * webhook plutôt que de faire confiance à son contenu brut, FeexPay ne
 * documentant pas de mécanisme de signature sur ce webhook.
 */
export async function checkFeexPayStatus(
    reference: string,
): Promise<FeexPayStatusResponse> {
    const { apiKey } = getCredentials();

    const res = await fetch(
        `${FEEXPAY_BASE_URL}/transactions/public/single/status/${reference}`,
        {
            headers: { Authorization: `Bearer ${apiKey}` },
        },
    );

    const data = await res.json();

    if (!res.ok) {
        throw new Error(
            typeof data?.message === "string"
                ? data.message
                : "Impossible de vérifier le statut FeexPay",
        );
    }

    return data as FeexPayStatusResponse;
}
