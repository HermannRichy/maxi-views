import type { Metadata } from "next";
import Link from "next/link";
import { GeoCircle, GeoRing, SectionTitle, SectionBorder } from "@/components/ui/futuristic";
import { IconArrowRight } from "@tabler/icons-react";

export const metadata: Metadata = {
    title: "Conditions Générales d'Utilisation",
    description:
        "Conditions générales d'utilisation et de vente de Maxi Views : commandes, paiement, livraison des services et responsabilités.",
    alternates: { canonical: "/cgu" },
};

const LAST_UPDATED = "25 août 2026";

const SECTIONS: { title: string; paragraphs: string[]; list?: string[] }[] = [
    {
        title: "1. Objet",
        paragraphs: [
            "Les présentes Conditions Générales d'Utilisation et de Vente (« CGU ») régissent l'accès et l'utilisation du site maxiviews.me (« le Site »), édité par Maxi Views, ainsi que la vente des services de visibilité sur réseaux sociaux proposés (vues, likes, followers, abonnés) pour TikTok, Instagram, YouTube, Facebook et autres plateformes prises en charge.",
            "L'utilisation du Site implique l'acceptation pleine et entière des présentes CGU.",
        ],
    },
    {
        title: "2. Compte utilisateur",
        paragraphs: [
            "L'accès à certains services nécessite la création d'un compte via une adresse email valide, avec ou sans authentification par mot de passe, ou via un fournisseur tiers (Google).",
            "Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. Toute création de compte avec des informations fausses ou trompeuses peut entraîner sa suspension.",
        ],
    },
    {
        title: "3. Description des services",
        paragraphs: [
            "Maxi Views propose des services payants de promotion de comptes et de contenus sur des plateformes sociales tierces. Ces services sont fournis à titre indicatif de visibilité et ne garantissent ni engagement qualifié, ni résultat commercial particulier.",
            "Maxi Views n'est affilié à aucune des plateformes sociales sur lesquelles portent les services (TikTok, Instagram, YouTube, Facebook, etc.).",
        ],
    },
    {
        title: "4. Commandes et prix",
        paragraphs: [
            "Les prix affichés sur le Site sont indiqués en Francs CFA (FCFA), toutes taxes comprises le cas échéant. Maxi Views se réserve le droit de modifier ses tarifs à tout moment ; les commandes déjà passées ne sont pas affectées par un changement ultérieur de prix.",
            "Toute commande implique le débit du solde disponible sur le portefeuille (wallet) de l'utilisateur, préalablement rechargé.",
        ],
    },
    {
        title: "5. Paiement",
        paragraphs: [
            "Le rechargement du portefeuille s'effectue via Mobile Money, par l'intermédiaire du prestataire de paiement FedaPay. Maxi Views ne stocke aucune donnée bancaire ou de paiement : ces informations sont traitées directement par FedaPay conformément à sa propre politique de sécurité.",
            "Toute transaction validée par FedaPay est considérée comme définitive et crédite immédiatement le solde du compte concerné.",
        ],
    },
    {
        title: "6. Livraison des services",
        paragraphs: [
            "Le traitement des commandes débute généralement peu après leur validation. Les délais de livraison affichés sont donnés à titre indicatif et peuvent varier selon la disponibilité du service et les conditions propres à chaque plateforme sociale.",
            "L'utilisateur s'engage à fournir un lien ou identifiant de cible exact et accessible publiquement au moment de la commande ; Maxi Views ne saurait être tenu responsable d'une erreur de livraison résultant d'une information incorrecte fournie par l'utilisateur.",
        ],
    },
    {
        title: "7. Politique de remboursement",
        paragraphs: [
            "Compte tenu de la nature numérique et immédiate des services proposés, aucun remboursement n'est possible une fois une commande passée en traitement, sauf en cas de non-livraison avérée imputable à Maxi Views.",
            "En cas d'incident (commande non livrée, service défaillant), l'utilisateur peut contacter le support via la page Contact ; un recrédit du solde ou une nouvelle tentative de livraison pourra être proposé après vérification.",
        ],
    },
    {
        title: "8. Responsabilité de l'utilisateur",
        paragraphs: [
            "L'utilisateur s'engage à :",
        ],
        list: [
            "N'utiliser les services que sur des comptes et contenus dont il est le titulaire ou pour lesquels il dispose d'une autorisation ;",
            "Respecter les conditions d'utilisation des plateformes sociales tierces concernées ;",
            "Ne pas utiliser le Site à des fins frauduleuses, illicites, ou portant atteinte aux droits de tiers.",
        ],
    },
    {
        title: "9. Limitation de responsabilité",
        paragraphs: [
            "Maxi Views ne saurait être tenu responsable des actions prises par une plateforme tierce (suspension, limitation, suppression de contenu) à la suite de l'utilisation des services, ni des interruptions de service liées à des facteurs indépendants de sa volonté (panne technique, indisponibilité d'un fournisseur, cas de force majeure).",
        ],
    },
    {
        title: "10. Propriété intellectuelle",
        paragraphs: [
            "L'ensemble des éléments du Site (textes, marque « Maxi Views », logo, éléments graphiques) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.",
        ],
    },
    {
        title: "11. Suspension et résiliation",
        paragraphs: [
            "Maxi Views se réserve le droit de suspendre ou de résilier tout compte en cas de non-respect des présentes CGU, sans préjudice de toute action judiciaire qui pourrait en découler.",
        ],
    },
    {
        title: "12. Modification des CGU",
        paragraphs: [
            "Maxi Views se réserve le droit de modifier les présentes CGU à tout moment. La version applicable est celle en vigueur au moment de l'utilisation du Site ou de la passation d'une commande.",
        ],
    },
    {
        title: "13. Droit applicable et litiges",
        paragraphs: [
            "Les présentes CGU sont soumises au droit applicable au lieu d'établissement de Maxi Views. Tout litige sera, autant que possible, réglé à l'amiable avant toute action contentieuse.",
        ],
    },
    {
        title: "14. Contact",
        paragraphs: [
            "Pour toute question relative aux présentes CGU, vous pouvez nous contacter à contact@maxiviews.me ou via la page Contact du Site.",
        ],
    },
];

export default function CguPage() {
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
                    Conditions Générales <span className="text-primary">d&apos;Utilisation</span>
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
