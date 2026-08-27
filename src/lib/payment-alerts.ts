import prisma from "@/lib/prisma";
import { sendPaymentFailureAlertEmail } from "@/lib/emails";

const SAMPLE_SIZE = 10;
const FAILURE_RATE_THRESHOLD = 0.5;
const ALERT_COOLDOWN_MS = 60 * 60 * 1000; // 1h
const LAST_ALERT_KEY = "lastPaymentFailureAlert";

/**
 * À appeler après qu'un rechargement FeexPay a été marqué FAILED.
 * Regarde les dernières tentatives de rechargement résolues (succès ou
 * échec) et alerte l'admin si le taux d'échec dépasse le seuil — signe
 * probable d'un problème côté FeexPay plutôt que de simples refus clients
 * isolés. Un cooldown évite de spammer à chaque nouvel échec.
 * Non bloquant : à appeler avec .catch(console.error).
 */
export async function checkAndNotifyPaymentFailureSpike(): Promise<void> {
    const recent = await prisma.transaction.findMany({
        where: {
            type: "CREDIT",
            reference: { startsWith: "DEP_" },
            status: { in: ["COMPLETED", "FAILED"] },
        },
        orderBy: { createdAt: "desc" },
        take: SAMPLE_SIZE,
        select: { status: true },
    });

    if (recent.length < SAMPLE_SIZE) return;

    const failed = recent.filter((t) => t.status === "FAILED").length;
    const failureRate = failed / recent.length;
    if (failureRate < FAILURE_RATE_THRESHOLD) return;

    const setting = await prisma.appSetting.findUnique({
        where: { key: LAST_ALERT_KEY },
    });
    const lastAlertAt = setting ? new Date(setting.value).getTime() : 0;
    if (Date.now() - lastAlertAt < ALERT_COOLDOWN_MS) return;

    await prisma.appSetting.upsert({
        where: { key: LAST_ALERT_KEY },
        update: { value: new Date().toISOString() },
        create: { key: LAST_ALERT_KEY, value: new Date().toISOString() },
    });

    await sendPaymentFailureAlertEmail({
        failed,
        total: recent.length,
        failureRate,
    });
}
