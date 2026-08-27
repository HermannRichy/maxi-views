import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendWeeklyDigestEmail } from "@/lib/emails";

/* ─────────────────────────────────────────────────────────────────
   GET /api/cron/weekly-digest
   Déclenché par Vercel Cron chaque lundi matin (voir vercel.json).
   Calcule les chiffres des 7 derniers jours et envoie un résumé à
   l'admin. Protégé par CRON_SECRET (en-tête Authorization: Bearer,
   ajouté automatiquement par Vercel Cron quand la variable d'env est
   définie).
───────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
    const expected = process.env.CRON_SECRET;
    if (expected) {
        const header = req.headers.get("authorization") ?? "";
        if (header !== `Bearer ${expected}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    try {
        const since = new Date();
        since.setDate(since.getDate() - 7);

        const [revenueAgg, depositsAgg, newOrders, newUsers, byNetwork] =
            await Promise.all([
                prisma.transaction.aggregate({
                    where: {
                        type: "DEBIT",
                        status: "COMPLETED",
                        reference: { startsWith: "ORD_" },
                        createdAt: { gte: since },
                    },
                    _sum: { amount: true },
                }),
                prisma.transaction.aggregate({
                    where: {
                        type: "CREDIT",
                        status: "COMPLETED",
                        reference: { startsWith: "DEP_" },
                        createdAt: { gte: since },
                    },
                    _sum: { amount: true },
                }),
                prisma.order.count({ where: { createdAt: { gte: since } } }),
                prisma.user.count({ where: { createdAt: { gte: since } } }),
                prisma.order.groupBy({
                    by: ["network"],
                    where: { createdAt: { gte: since } },
                    _sum: { amount: true },
                    orderBy: { _sum: { amount: "desc" } },
                    take: 1,
                }),
            ]);

        const periodLabel = `Semaine du ${since.toLocaleDateString("fr-FR")} au ${new Date().toLocaleDateString("fr-FR")}`;

        await sendWeeklyDigestEmail({
            periodLabel,
            revenue: revenueAgg._sum.amount ?? 0,
            deposits: depositsAgg._sum.amount ?? 0,
            newOrders,
            newUsers,
            topNetwork: byNetwork[0]?.network ?? null,
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Weekly digest cron error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
