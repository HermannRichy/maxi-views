/* ─────────────────────────────────────────────────────────────────
   Réseaux Mobile Money supportés (Bénin, Togo, Côte d'Ivoire).
   Fichier sans secret — importable côté client (formulaire de recharge)
   et côté serveur (src/lib/feexpay.ts).

   Chaque `slug` correspond exactement à l'URL FeexPay :
   https://api-v2.feexpay.me/api/transactions/public/requesttopay/{slug}

   Coris Bénin est volontairement absent : le slug exact (`coris` ou
   `coris_bj`) n'a pas pu être confirmé auprès de FeexPay — mieux vaut
   ne pas le proposer que de risquer un mauvais endpoint sur un vrai
   paiement.
───────────────────────────────────────────────────────────────── */
export interface FeexPayNetwork {
    slug: string;
    label: string;
    country: "BJ" | "TG" | "CI";
    countryLabel: string;
    countryCallingCode: string;
}

export const FEEXPAY_NETWORKS: FeexPayNetwork[] = [
    { slug: "mtn", label: "MTN", country: "BJ", countryLabel: "Bénin", countryCallingCode: "229" },
    { slug: "moov", label: "Moov", country: "BJ", countryLabel: "Bénin", countryCallingCode: "229" },
    { slug: "celtiis_bj", label: "Celtiis", country: "BJ", countryLabel: "Bénin", countryCallingCode: "229" },
    { slug: "togocom_tg", label: "Togocom", country: "TG", countryLabel: "Togo", countryCallingCode: "228" },
    { slug: "moov_tg", label: "Moov", country: "TG", countryLabel: "Togo", countryCallingCode: "228" },
    { slug: "mtn_ci", label: "MTN", country: "CI", countryLabel: "Côte d'Ivoire", countryCallingCode: "225" },
    { slug: "moov_ci", label: "Moov", country: "CI", countryLabel: "Côte d'Ivoire", countryCallingCode: "225" },
    { slug: "orange_ci", label: "Orange", country: "CI", countryLabel: "Côte d'Ivoire", countryCallingCode: "225" },
    { slug: "wave_ci", label: "Wave", country: "CI", countryLabel: "Côte d'Ivoire", countryCallingCode: "225" },
];

export const FEEXPAY_COUNTRIES = Array.from(
    new Map(
        FEEXPAY_NETWORKS.map((n) => [n.country, { code: n.country, label: n.countryLabel, callingCode: n.countryCallingCode }]),
    ).values(),
);

export function getFeexPayNetwork(slug: string): FeexPayNetwork | undefined {
    return FEEXPAY_NETWORKS.find((n) => n.slug === slug);
}

export const FEEXPAY_MIN_AMOUNT = 100;
export const FEEXPAY_MAX_AMOUNT = 2_000_000;
