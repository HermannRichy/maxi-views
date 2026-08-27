/* ─────────────────────────────────────────────────────────────────
   Réseaux Mobile Money supportés (Bénin, Togo, Côte d'Ivoire, Congo
   Brazzaville, Sénégal, Burkina Faso, Mali).
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
    country: "BJ" | "TG" | "CI" | "CG" | "SN" | "BF" | "ML";
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
    { slug: "mtn_cg", label: "MTN", country: "CG", countryLabel: "Congo Brazzaville", countryCallingCode: "242" },
    { slug: "orange_sn", label: "Orange", country: "SN", countryLabel: "Sénégal", countryCallingCode: "221" },
    { slug: "wave_sn", label: "Wave", country: "SN", countryLabel: "Sénégal", countryCallingCode: "221" },
    { slug: "free_sn", label: "Free", country: "SN", countryLabel: "Sénégal", countryCallingCode: "221" },
    { slug: "moov_bf", label: "Moov", country: "BF", countryLabel: "Burkina Faso", countryCallingCode: "226" },
    { slug: "orange_bf", label: "Orange", country: "BF", countryLabel: "Burkina Faso", countryCallingCode: "226" },
    { slug: "wave_bf", label: "Wave", country: "BF", countryLabel: "Burkina Faso", countryCallingCode: "226" },
    { slug: "orange_ml", label: "Orange", country: "ML", countryLabel: "Mali", countryCallingCode: "223" },
    { slug: "mobicash_ml", label: "Mobicash", country: "ML", countryLabel: "Mali", countryCallingCode: "223" },
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
