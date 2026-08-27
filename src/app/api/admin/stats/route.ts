import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/admin/stats
   Chiffres clés + série quotidienne (30 jours) pour le graphique
   du panel admin.

   Définitions :
   - CA (chiffre d'affaires) = Transaction DEBIT COMPLETED "ORD_..."
     (montant débité à la création d'une commande)
   - Rechargements = Transaction CREDIT COMPLETED "DEP_..." (FeexPay)
   - Ajustements = Transaction "ADJ_..." (créés/débités manuellement
     par un admin depuis /admin/users) — exclus du CA
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        await requireAdmin();

        const [
            revenueAgg,
            depositsAgg,
            adjCreditAgg,
            adjDebitAgg,
            balanceAgg,
            transactionsCount,
        ] = await Promise.all([
            prisma.transaction.aggregate({
                where: {
                    type: "DEBIT",
                    status: "COMPLETED",
                    reference: { startsWith: "ORD_" },
                },
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: {
                    type: "CREDIT",
                    status: "COMPLETED",
                    reference: { startsWith: "DEP_" },
                },
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: {
                    type: "CREDIT",
                    status: "COMPLETED",
                    reference: { startsWith: "ADJ_" },
                },
                _sum: { amount: true },
            }),
            prisma.transaction.aggregate({
                where: {
                    type: "DEBIT",
                    status: "COMPLETED",
                    reference: { startsWith: "ADJ_" },
                },
                _sum: { amount: true },
            }),
            prisma.user.aggregate({ _sum: { balance: true } }),
            prisma.transaction.count(),
        ]);

        // Série quotidienne (30 derniers jours) CA + rechargements
        const since = new Date();
        since.setDate(since.getDate() - 29);
        since.setHours(0, 0, 0, 0);

        const recentTx = await prisma.transaction.findMany({
            where: {
                status: "COMPLETED",
                createdAt: { gte: since },
                OR: [
                    { reference: { startsWith: "ORD_" } },
                    { reference: { startsWith: "DEP_" } },
                ],
            },
            select: { amount: true, reference: true, createdAt: true },
        });

        const days: { date: string; ca: number; deposits: number }[] = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date(since);
            d.setDate(d.getDate() + i);
            days.push({ date: d.toISOString().slice(0, 10), ca: 0, deposits: 0 });
        }
        const dayIndex = new Map(days.map((d, i) => [d.date, i]));

        for (const tx of recentTx) {
            const key = tx.createdAt.toISOString().slice(0, 10);
            const idx = dayIndex.get(key);
            if (idx === undefined) continue;
            if (tx.reference.startsWith("ORD_")) days[idx].ca += tx.amount;
            else if (tx.reference.startsWith("DEP_")) days[idx].deposits += tx.amount;
        }

        return NextResponse.json({
            totalRevenue: revenueAgg._sum.amount ?? 0,
            totalDeposits: depositsAgg._sum.amount ?? 0,
            netAdjustments:
                (adjCreditAgg._sum.amount ?? 0) - (adjDebitAgg._sum.amount ?? 0),
            walletFloat: balanceAgg._sum.balance ?? 0,
            transactionsCount,
            daily: days,
        });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        console.error("Admin stats error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
