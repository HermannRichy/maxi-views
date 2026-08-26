import type { Metadata } from "next";
import Link from "next/link";
import { GeoCircle, GeoRing, SectionTitle, SectionBorder } from "@/components/ui/futuristic";
import { IconArrowRight } from "@tabler/icons-react";

export const metadata: Metadata = {
    title: "Politique de Confidentialité",
    description:
        "Politique de confidentialité de Maxi Views : données collectées, finalités, partage avec les prestataires et vos droits.",
    alternates: { canonical: "/privacy" },
};

const LAST_UPDATED = "25 août 2026";

const SECTIONS: { title: string; paragraphs: string[]; list?: string[] }[] = [
    {
        title: "1. Responsable du traitement",
        paragraphs: [
            "La présente politique de confidentialité s'applique au site maxiviews.me, édité par Maxi Views (« nous »). Pour toute question relative à vos données personnelles, vous pouvez nous contacter à contact@maxiviews.me.",
        ],
    },
    {
        title: "2. Données collectées",
        paragraphs: ["Dans le cadre de l'utilisation du Site, nous collectons :"],
        list: [
            "Données d'identité et de contact : nom, adresse email ;",
            "Données de compte : mot de passe (stocké de façon chiffrée), méthode de connexion (email/mot de passe ou Google) ;",
            "Données de commande : historique des commandes, service demandé, lien ou identifiant cible, montant ;",
            "Données de transaction : montant et statut des rechargements de portefeuille (les moyens de paiement eux-mêmes sont traités exclusivement par FeexPay, jamais stockés par nos soins) ;",
            "Données techniques : cookies de session nécessaires à l'authentification.",
        ],
    },
    {
        title: "3. Finalités du traitement",
        paragraphs: ["Vos données sont utilisées pour :"],
        list: [
            "Créer et gérer votre compte utilisateur ;",
            "Traiter vos commandes et rechargements de portefeuille ;",
            "Vous envoyer des emails transactionnels (codes de vérification, confirmations de commande, changements de statut, reçus de dépôt) ;",
            "Assurer la sécurité du Site et prévenir la fraude ;",
            "Répondre à vos demandes via le formulaire de contact.",
        ],
    },
    {
        title: "4. Base légale",
        paragraphs: [
            "Le traitement de vos données repose sur l'exécution du contrat de vente qui nous lie (fourniture des services commandés), ainsi que, le cas échéant, sur votre consentement (formulaire de contact) et sur notre intérêt légitime à sécuriser le Site.",
        ],
    },
    {
        title: "5. Partage des données",
        paragraphs: [
            "Nous ne vendons jamais vos données. Elles peuvent être transmises aux prestataires suivants, uniquement dans la mesure nécessaire à la fourniture du service :",
        ],
        list: [
            "FeexPay — traitement des paiements Mobile Money ;",
            "Resend — envoi des emails transactionnels ;",
            "Notre hébergeur de base de données — stockage sécurisé des données de compte et de commande.",
        ],
    },
    {
        title: "6. Cookies",
        paragraphs: [
            "Le Site utilise un cookie de session strictement nécessaire à l'authentification (gestion de votre connexion). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.",
        ],
    },
    {
        title: "7. Durée de conservation",
        paragraphs: [
            "Vos données de compte sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont supprimées ou anonymisées dans un délai raisonnable, sous réserve des obligations légales de conservation applicables aux données de facturation.",
        ],
    },
    {
        title: "8. Sécurité",
        paragraphs: [
            "Les mots de passe sont stockés de façon chiffrée. L'accès aux données est restreint aux besoins opérationnels du service. Aucune méthode de transmission ou de stockage n'étant totalement sécurisée, nous ne pouvons garantir une sécurité absolue.",
        ],
    },
    {
        title: "9. Vos droits",
        paragraphs: [
            "Vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition concernant vos données personnelles. Vous pouvez exercer ces droits en nous contactant à contact@maxiviews.me ou via la page Contact ; nous nous engageons à répondre dans un délai raisonnable.",
        ],
    },
    {
        title: "10. Modification de la présente politique",
        paragraphs: [
            "Nous pouvons modifier cette politique de confidentialité à tout moment. La version applicable est celle publiée sur cette page à la date de votre visite.",
        ],
    },
    {
        title: "11. Contact",
        paragraphs: [
            "Pour toute question relative à cette politique ou à vos données personnelles : contact@maxiviews.me.",
        ],
    },
];

export default function PrivacyPage() {
    return (
        <main className="relative min-h-screen bg-background text-foreground pt-24 pb-16 overflow-hidden">
            <GeoCircle className="top-1/4 -right-32 opacity-10 -z-10" size={420} />
            <GeoRing className="bottom-10 -left-24 opacity-20 -z-10" size={280} />
            <div
                className="fixed inset-0 -z-10 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <IconArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Retour à l&apos;accueil
                    </Link>
                </div>

                <SectionTitle subtitle={`Dernière mise à jour : ${LAST_UPDATED}`}>
                    Politique de <span className="text-primary">Confidentialité</span>
                </SectionTitle>

                <div className="rounded-2xl border border-white/10 bg-card p-6 sm:p-10 space-y-8">
                    {SECTIONS.map((section, i) => (
                        <div key={section.title}>
                            <h2 className="font-display text-xl font-bold mb-3">
                                {section.title}
                            </h2>
                            <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                                {section.paragraphs.map((p) => (
                                    <p key={p}>{p}</p>
                                ))}
                                {section.list && (
                                    <ul className="list-disc pl-5 space-y-1.5">
                                        {section.list.map((item) => (
                                            <li key={item}>{item}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {i < SECTIONS.length - 1 && (
                                <SectionBorder className="mt-8" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
