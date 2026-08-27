import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/admin/stats
   Chiffres clés, séries temporelles et répartitions pour le panel
   admin (page /admin/transactions).

   Définitions :
   - CA (chiffre d'affaires) = Transaction DEBIT COMPLETED "ORD_..."
     (montant débité à la création d'une commande) ou, de façon
     équivalente, la somme des Order.amount (mêmes montants, créés
     atomiquement ensemble).
   - Rechargements = Transaction CREDIT COMPLETED "DEP_..." (FeexPay)
   - Ajustements = Transaction "ADJ_..." (créés/débités manuellement
     par un admin depuis /admin/users) — exclus du CA
───────────────────────────────────────────────────────────────── */

function startOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay(); // 0 (dim) - 6 (sam)
    const diff = (day === 0 ? -6 : 1) - day; // lundi = début de semaine
    date.setDate(date.getDate() + diff);
    date.setHours(0, 0, 0, 0);
    return date;
}

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
            ordersCount,
            byNetwork,
            byService,
            topSpendersRaw,
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
            prisma.order.count(),
            prisma.order.groupBy({
                by: ["network"],
                _sum: { amount: true },
                _count: { _all: true },
                orderBy: { _sum: { amount: "desc" } },
            }),
            prisma.order.groupBy({
                by: ["network", "serviceName"],
                _sum: { amount: true },
                _count: { _all: true },
                orderBy: { _sum: { amount: "desc" } },
                take: 8,
            }),
            prisma.transaction.groupBy({
                by: ["userId"],
                where: {
                    type: "DEBIT",
                    status: "COMPLETED",
                    reference: { startsWith: "ORD_" },
                },
                _sum: { amount: true },
                orderBy: { _sum: { amount: "desc" } },
                take: 10,
            }),
        ]);

        const totalRevenue = revenueAgg._sum.amount ?? 0;

        // Top clients : résoudre les infos utilisateur
        const spenderIds = topSpendersRaw.map((s) => s.userId);
        const spenderUsers = await prisma.user.findMany({
            where: { id: { in: spenderIds } },
            select: { id: true, name: true, email: true },
        });
        const spenderMap = new Map(spenderUsers.map((u) => [u.id, u]));
        const topSpenders = topSpendersRaw.map((s) => ({
            userId: s.userId,
            name: spenderMap.get(s.userId)?.name ?? null,
            email: spenderMap.get(s.userId)?.email ?? "—",
            totalSpent: s._sum.amount ?? 0,
        }));

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

        // Commandes par semaine (8 dernières semaines, lundi → dimanche)
        const firstWeekStart = startOfWeek(new Date());
        firstWeekStart.setDate(firstWeekStart.getDate() - 7 * 7);

        const weeklyOrdersRaw = await prisma.order.findMany({
            where: { createdAt: { gte: firstWeekStart } },
            select: { amount: true, createdAt: true },
        });

        const weeks: { weekStart: string; count: number; revenue: number }[] = [];
        for (let i = 0; i < 8; i++) {
            const d = new Date(firstWeekStart);
            d.setDate(d.getDate() + i * 7);
            weeks.push({ weekStart: d.toISOString().slice(0, 10), count: 0, revenue: 0 });
        }
        for (const order of weeklyOrdersRaw) {
            const ws = startOfWeek(order.createdAt).toISOString().slice(0, 10);
            const week = weeks.find((w) => w.weekStart === ws);
            if (week) {
                week.count += 1;
                week.revenue += order.amount;
            }
        }

        return NextResponse.json({
            totalRevenue,
            totalDeposits: depositsAgg._sum.amount ?? 0,
            netAdjustments:
                (adjCreditAgg._sum.amount ?? 0) - (adjDebitAgg._sum.amount ?? 0),
            walletFloat: balanceAgg._sum.balance ?? 0,
            transactionsCount,
            ordersCount,
            averageOrderValue: ordersCount > 0 ? Math.round(totalRevenue / ordersCount) : 0,
            daily: days,
            weeklyOrders: weeks,
            revenueByNetwork: byNetwork.map((n) => ({
                network: n.network,
                revenue: n._sum.amount ?? 0,
                count: n._count._all,
            })),
            topServices: byService.map((s) => ({
                network: s.network,
                serviceName: s.serviceName,
                revenue: s._sum.amount ?? 0,
                count: s._count._all,
            })),
            topSpenders,
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
