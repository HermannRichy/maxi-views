import prisma from "@/lib/prisma";
import { sendRevenueMilestoneEmail } from "@/lib/emails";

/* ─────────────────────────────────────────────────────────────────
   Chiffre d'affaires = somme des Transaction DEBIT COMPLETED liées
   à une commande (référence "ORD_..."). Les rechargements ("DEP_")
   et les ajustements manuels admin ("ADJ_") ne comptent pas comme CA.
───────────────────────────────────────────────────────────────── */
export const REVENUE_MILESTONE_STEP = 100_000; // FCFA

const LAST_MILESTONE_KEY = "lastRevenueMilestone";

export async function getTotalRevenue(): Promise<number> {
    const agg = await prisma.transaction.aggregate({
        where: {
            type: "DEBIT",
            status: "COMPLETED",
            reference: { startsWith: "ORD_" },
        },
        _sum: { amount: true },
    });
    return agg._sum.amount ?? 0;
}

/**
 * À appeler après qu'une commande a débité le solde d'un client.
 * Envoie un email admin pour chaque palier de 100 000 FCFA de CA
 * cumulé franchi depuis le dernier appel. Non bloquant : à appeler
 * avec .catch(console.error).
 */
export async function checkAndNotifyRevenueMilestone(): Promise<void> {
    const totalRevenue = await getTotalRevenue();
    const reached = Math.floor(totalRevenue / REVENUE_MILESTONE_STEP) * REVENUE_MILESTONE_STEP;
    if (reached < REVENUE_MILESTONE_STEP) return;

    const setting = await prisma.appSetting.findUnique({
        where: { key: LAST_MILESTONE_KEY },
    });
    const lastNotified = setting ? parseInt(setting.value, 10) : 0;

    if (reached <= lastNotified) return;

    await prisma.appSetting.upsert({
        where: { key: LAST_MILESTONE_KEY },
        update: { value: String(reached) },
        create: { key: LAST_MILESTONE_KEY, value: String(reached) },
    });

    for (
        let milestone = lastNotified + REVENUE_MILESTONE_STEP;
        milestone <= reached;
        milestone += REVENUE_MILESTONE_STEP
    ) {
        await sendRevenueMilestoneEmail({ milestone, totalRevenue });
    }
}
