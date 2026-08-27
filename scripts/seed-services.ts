/**
 * One-off migration: seeds the Service table from the catalog that used to
 * be hard-coded in src/app/dashboard/new-order/page.tsx. Safe to re-run
 * (upserts on the [network, name] unique constraint).
 *
 * Usage: npx tsx scripts/seed-services.ts
 */
import "dotenv/config";
import prisma from "../src/lib/prisma";

const CATALOG: Record<
    string,
    {
        name: string;
        unitPrice: number;
        minQty: number;
        step: number;
        note: string;
    }[]
> = {
    TikTok: [
        {
            name: "Vues",
            unitPrice: 300,
            minQty: 10000,
            step: 10000,
            note: "Livraison rapide, aucune information de connexion requise. La vidéo doit être publique.",
        },
        {
            name: "Followers",
            unitPrice: 7500,
            minQty: 1000,
            step: 1000,
            note: "Followers de qualité mixte. Le compte doit rester public pendant toute la livraison.",
        },
        {
            name: "Likes",
            unitPrice: 500,
            minQty: 1000,
            step: 1000,
            note: "Ajoutés progressivement. La vidéo doit être publique et accepter les likes.",
        },
        {
            name: "Partages",
            unitPrice: 300,
            minQty: 10000,
            step: 10000,
            note: "Partages internes TikTok, comptabilisés dans les statistiques de la vidéo.",
        },
        {
            name: "Vues story",
            unitPrice: 700,
            minQty: 10000,
            step: 10000,
            note: "La story doit rester active et visible pendant toute la durée de la livraison.",
        },
        {
            name: "Enregistrements",
            unitPrice: 150,
            minQty: 10000,
            step: 10000,
            note: "Comptabilisés comme favoris sur la vidéo ciblée. La vidéo doit être publique.",
        },
        {
            name: "Auto-likes",
            unitPrice: 400,
            minQty: 1000,
            step: 1000,
            note: "S'applique automatiquement aux prochaines publications du compte pendant la durée choisie.",
        },
        {
            name: "Commentaires",
            unitPrice: 3500,
            minQty: 50,
            step: 50,
            note: "Commentaires génériques positifs. Le compte doit être public et autoriser les commentaires.",
        },
    ],
    Instagram: [
        {
            name: "Followers",
            unitPrice: 7500,
            minQty: 1000,
            step: 1000,
            note: "Le compte doit être public. Aucun mot de passe n'est jamais demandé.",
        },
        {
            name: "Likes",
            unitPrice: 4000,
            minQty: 1000,
            step: 1000,
            note: "La publication ciblée doit être publique. Livraison possible sur plusieurs posts.",
        },
        {
            name: "Vues",
            unitPrice: 500,
            minQty: 10000,
            step: 10000,
            note: "Fonctionne sur les Reels et vidéos publiques du compte.",
        },
        {
            name: "Vues story",
            unitPrice: 150,
            minQty: 10000,
            step: 10000,
            note: "La story doit être active au moment du lancement de la commande.",
        },
        {
            name: "Enregistrements",
            unitPrice: 150,
            minQty: 10000,
            step: 10000,
            note: "Comptabilisés dans les statistiques Insights de la publication.",
        },
        {
            name: "Impressions",
            unitPrice: 350,
            minQty: 10000,
            step: 10000,
            note: "Comprend les impressions Explorer, Hashtags et Profil.",
        },
        {
            name: "Auto-likes",
            unitPrice: 450,
            minQty: 1000,
            step: 1000,
            note: "S'applique automatiquement aux prochaines publications pendant la durée choisie.",
        },
        {
            name: "Commentaires",
            unitPrice: 2800,
            minQty: 50,
            step: 50,
            note: "Commentaires génériques en français ou en anglais selon disponibilité.",
        },
    ],
    YouTube: [
        {
            name: "Vues",
            unitPrice: 900,
            minQty: 10000,
            step: 10000,
            note: "Livraison progressive conforme aux règles YouTube. Aucune baisse garantie sous 30 jours.",
        },
        {
            name: "Abonnés",
            unitPrice: 15000,
            minQty: 1000,
            step: 1000,
            note: "Abonnés de qualité mixte. La chaîne doit être publique.",
        },
        {
            name: "Likes",
            unitPrice: 5000,
            minQty: 1000,
            step: 1000,
            note: "La vidéo doit être publique et les likes doivent être activés.",
        },
        {
            name: "Partages",
            unitPrice: 3200,
            minQty: 1000,
            step: 1000,
            note: "Partages comptabilisés sur les réseaux sociaux liés à la vidéo.",
        },
        {
            name: "Commentaires",
            unitPrice: 6000,
            minQty: 50,
            step: 50,
            note: "Commentaires génériques liés au contenu. Les commentaires doivent être activés.",
        },
        {
            name: "Watch Time (heures)",
            unitPrice: 18000,
            minQty: 500,
            step: 500,
            note: "Utile pour la monétisation. Livraison étalée sur plusieurs jours pour rester naturelle.",
        },
    ],
    Facebook: [
        {
            name: "Likes page",
            unitPrice: 4000,
            minQty: 1000,
            step: 1000,
            note: "La page doit être publique et accepter les nouveaux likes.",
        },
        {
            name: "Followers",
            unitPrice: 6000,
            minQty: 1000,
            step: 1000,
            note: "Followers sur la page, distincts des likes de page.",
        },
        {
            name: "Vues Reels",
            unitPrice: 250,
            minQty: 10000,
            step: 10000,
            note: "Le Reel doit être public au moment du lancement de la commande.",
        },
        {
            name: "Vues vidéo",
            unitPrice: 450,
            minQty: 10000,
            step: 10000,
            note: "Fonctionne sur les vidéos publiques du profil ou de la page.",
        },
        {
            name: "Membres groupe",
            unitPrice: 2200,
            minQty: 1000,
            step: 1000,
            note: "Le groupe doit être public ou accepter automatiquement les demandes d'adhésion.",
        },
        {
            name: "Vues story",
            unitPrice: 2800,
            minQty: 10000,
            step: 10000,
            note: "La story doit être active au moment du lancement de la commande.",
        },
        {
            name: "Commentaires",
            unitPrice: 60000,
            minQty: 10,
            step: 10,
            note: "Commentaires génériques positifs. Les commentaires doivent être activés sur le post.",
        },
    ],
    Telegram: [
        {
            name: "Membres",
            unitPrice: 12500,
            minQty: 1000,
            step: 1000,
            note: "Le canal ou groupe doit être public avec un lien d'invitation valide.",
        },
        {
            name: "Vues",
            unitPrice: 500,
            minQty: 10000,
            step: 10000,
            note: "S'applique aux derniers posts publiés du canal.",
        },
    ],
    "X (Twitter)": [
        {
            name: "Followers",
            unitPrice: 9500,
            minQty: 1000,
            step: 1000,
            note: "Le compte doit être public.",
        },
        {
            name: "Likes",
            unitPrice: 5000,
            minQty: 1000,
            step: 1000,
            note: "Le tweet ciblé doit être public.",
        },
        {
            name: "Retweets",
            unitPrice: 600,
            minQty: 1000,
            step: 1000,
            note: "Le tweet doit être public et autoriser les retweets.",
        },
        {
            name: "Vues vidéo",
            unitPrice: 250,
            minQty: 10000,
            step: 10000,
            note: "Fonctionne sur les vidéos intégrées à des tweets publics.",
        },
        {
            name: "Commentaires",
            unitPrice: 30000,
            minQty: 10,
            step: 10,
            note: "Réponses génériques positives sous le tweet ciblé.",
        },
    ],
    WhatsApp: [
        {
            name: "Membres canal",
            unitPrice: 10000,
            minQty: 1000,
            step: 1000,
            note: "Le canal WhatsApp doit être public avec un lien d'invitation actif.",
        },
    ],
};

async function main() {
    let count = 0;
    for (const [network, services] of Object.entries(CATALOG)) {
        for (let i = 0; i < services.length; i++) {
            const s = services[i];
            await prisma.service.upsert({
                where: { network_name: { network, name: s.name } },
                update: {
                    unitPrice: s.unitPrice,
                    minQty: s.minQty,
                    step: s.step,
                    note: s.note,
                    position: i,
                },
                create: {
                    network,
                    name: s.name,
                    unitPrice: s.unitPrice,
                    minQty: s.minQty,
                    step: s.step,
                    note: s.note,
                    position: i,
                },
            });
            count++;
        }
    }
    console.log(`Seeded ${count} services.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
