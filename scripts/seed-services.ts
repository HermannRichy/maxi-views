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
    { name: string; unitPrice: number; minQty: number; step: number }[]
> = {
    TikTok: [
        { name: "Vues", unitPrice: 300, minQty: 10000, step: 10000 },
        { name: "Followers", unitPrice: 7500, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 500, minQty: 1000, step: 1000 },
        { name: "Partages", unitPrice: 300, minQty: 10000, step: 10000 },
        { name: "Vues story", unitPrice: 700, minQty: 10000, step: 10000 },
        { name: "Enregistrements", unitPrice: 150, minQty: 10000, step: 10000 },
        { name: "Auto-likes", unitPrice: 400, minQty: 1000, step: 1000 },
        { name: "Commentaires", unitPrice: 3500, minQty: 50, step: 50 },
    ],
    Instagram: [
        { name: "Followers", unitPrice: 7500, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 4000, minQty: 1000, step: 1000 },
        { name: "Vues", unitPrice: 500, minQty: 10000, step: 10000 },
        { name: "Vues story", unitPrice: 150, minQty: 10000, step: 10000 },
        { name: "Enregistrements", unitPrice: 150, minQty: 10000, step: 10000 },
        { name: "Impressions", unitPrice: 350, minQty: 10000, step: 10000 },
        { name: "Auto-likes", unitPrice: 450, minQty: 1000, step: 1000 },
        { name: "Commentaires", unitPrice: 2800, minQty: 50, step: 50 },
    ],
    YouTube: [
        { name: "Vues", unitPrice: 900, minQty: 10000, step: 10000 },
        { name: "Abonnés", unitPrice: 15000, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 5000, minQty: 1000, step: 1000 },
        { name: "Partages", unitPrice: 3200, minQty: 1000, step: 1000 },
        { name: "Commentaires", unitPrice: 6000, minQty: 50, step: 50 },
        { name: "Watch Time (heures)", unitPrice: 18000, minQty: 500, step: 500 },
    ],
    Facebook: [
        { name: "Likes page", unitPrice: 4000, minQty: 1000, step: 1000 },
        { name: "Followers", unitPrice: 6000, minQty: 1000, step: 1000 },
        { name: "Vues Reels", unitPrice: 250, minQty: 10000, step: 10000 },
        { name: "Vues vidéo", unitPrice: 450, minQty: 10000, step: 10000 },
        { name: "Membres groupe", unitPrice: 2200, minQty: 1000, step: 1000 },
        { name: "Vues story", unitPrice: 2800, minQty: 10000, step: 10000 },
        { name: "Commentaires", unitPrice: 60000, minQty: 10, step: 10 },
    ],
    Telegram: [
        { name: "Membres", unitPrice: 12500, minQty: 1000, step: 1000 },
        { name: "Vues", unitPrice: 500, minQty: 10000, step: 10000 },
    ],
    "X (Twitter)": [
        { name: "Followers", unitPrice: 9500, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 5000, minQty: 1000, step: 1000 },
        { name: "Retweets", unitPrice: 600, minQty: 1000, step: 1000 },
        { name: "Vues vidéo", unitPrice: 250, minQty: 10000, step: 10000 },
        { name: "Commentaires", unitPrice: 30000, minQty: 10, step: 10 },
    ],
    WhatsApp: [
        { name: "Membres canal", unitPrice: 10000, minQty: 1000, step: 1000 },
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
                    position: i,
                },
                create: {
                    network,
                    name: s.name,
                    unitPrice: s.unitPrice,
                    minQty: s.minQty,
                    step: s.step,
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
