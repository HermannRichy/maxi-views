"use client";

import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    IconLoader2,
    IconSearch,
    IconTrendingUp,
    IconWallet,
    IconArrowsExchange,
    IconReceipt2,
    IconX,
    IconShoppingCart,
    IconCrown,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type Transaction = {
    id: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    status: "PENDING" | "COMPLETED" | "FAILED";
    reference: string;
    createdAt: string;
    user: { name: string | null; email: string };
};

type Stats = {
    totalRevenue: number;
    totalDeposits: number;
    netAdjustments: number;
    walletFloat: number;
    transactionsCount: number;
    ordersCount: number;
    averageOrderValue: number;
    daily: { date: string; ca: number; deposits: number }[];
    weeklyOrders: { weekStart: string; count: number; revenue: number }[];
    revenueByNetwork: { network: string; revenue: number; count: number }[];
    topServices: {
        network: string;
        serviceName: string;
        revenue: number;
        count: number;
    }[];
    topSpenders: {
        userId: string;
        name: string | null;
        email: string;
        totalSpent: number;
    }[];
};

function fcfa(n: number) {
    return `${n.toLocaleString("fr-FR")} FCFA`;
}

function kindOf(reference: string): "Commande" | "Rechargement" | "Ajustement" {
    if (reference.startsWith("ORD_")) return "Commande";
    if (reference.startsWith("DEP_")) return "Rechargement";
    return "Ajustement";
}

const STATUS_CONFIG: Record<
    Transaction["status"],
    { label: string; variant: "success" | "warning" | "destructive" }
> = {
    PENDING: { label: "En attente", variant: "warning" },
    COMPLETED: { label: "Terminée", variant: "success" },
    FAILED: { label: "Échouée", variant: "destructive" },
};

const chartConfig = {
    ca: { label: "Chiffre d'affaires", color: "var(--primary)" },
    deposits: { label: "Rechargements", color: "var(--info)" },
} satisfies ChartConfig;

const weeklyChartConfig = {
    count: { label: "Commandes", color: "var(--primary)" },
} satisfies ChartConfig;

const NETWORK_COLORS = [
    "var(--primary)",
    "var(--info)",
    "var(--success)",
    "var(--warning)",
    "var(--destructive)",
];

export default function AdminTransactionsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [kindFilter, setKindFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");

    useEffect(() => {
        Promise.all([
            fetch("/api/admin/stats").then((r) => r.json()),
            fetch("/api/admin/transactions").then((r) => r.json()),
        ])
            .then(([statsData, txData]) => {
                setStats(statsData);
                setTransactions(txData.transactions ?? []);
            })
            .finally(() => setLoading(false));
    }, []);

    const filtered = useMemo(() => {
        return transactions.filter((t) => {
            if (kindFilter !== "ALL" && kindOf(t.reference) !== kindFilter)
                return false;
            if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
            if (search.trim()) {
                const q = search.trim().toLowerCase();
                const haystack =
                    `${t.reference} ${t.user.name ?? ""} ${t.user.email}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });
    }, [transactions, kindFilter, statusFilter, search]);

    const hasActiveFilters =
        search.trim() !== "" || kindFilter !== "ALL" || statusFilter !== "ALL";

    const resetFilters = () => {
        setSearch("");
        setKindFilter("ALL");
        setStatusFilter("ALL");
    };

    const chartData = stats?.daily.map((d) => ({
        date: new Date(d.date).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
        }),
        ca: d.ca,
        deposits: d.deposits,
    }));

    const weeklyChartData = stats?.weeklyOrders.map((w) => ({
        week: new Date(w.weekStart).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
        }),
        count: w.count,
        revenue: w.revenue,
    }));

    const maxNetworkRevenue = stats?.revenueByNetwork[0]?.revenue ?? 0;

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center h-40">
                <IconLoader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Transactions</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Chiffre d&apos;affaires, rechargements et historique complet
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Chiffre d&apos;affaires
                            </p>
                            <p className="text-2xl font-black tabular-nums text-primary">
                                {stats ? fcfa(stats.totalRevenue) : "—"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-primary bg-primary/10">
                            <IconTrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Total rechargé
                            </p>
                            <p className="text-2xl font-black tabular-nums text-info">
                                {stats ? fcfa(stats.totalDeposits) : "—"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-info bg-info/10">
                            <IconWallet className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Solde en circulation
                            </p>
                            <p className="text-2xl font-black tabular-nums">
                                {stats ? fcfa(stats.walletFloat) : "—"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground bg-muted">
                            <IconArrowsExchange className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Panier moyen
                            </p>
                            <p className="text-2xl font-black tabular-nums">
                                {stats ? fcfa(stats.averageOrderValue) : "—"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {stats?.ordersCount ?? 0} commande
                                {(stats?.ordersCount ?? 0) !== 1 ? "s" : ""}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground bg-muted">
                            <IconShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Transactions
                            </p>
                            <p className="text-2xl font-black tabular-nums">
                                {stats?.transactionsCount ?? "—"}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground bg-muted">
                            <IconReceipt2 className="w-4 h-4" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Chart */}
            <Card className="p-4">
                <div className="mb-2">
                    <h2 className="font-bold text-sm">
                        CA & rechargements — 30 derniers jours
                    </h2>
                </div>
                <ChartContainer config={chartConfig} className="h-[260px] w-full">
                    <AreaChart data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            interval="preserveStartEnd"
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <defs>
                            <linearGradient id="fillCa" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-ca)"
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-ca)"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                            <linearGradient id="fillDeposits" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-deposits)"
                                    stopOpacity={0.5}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-deposits)"
                                    stopOpacity={0.05}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="deposits"
                            type="monotone"
                            fill="url(#fillDeposits)"
                            stroke="var(--color-deposits)"
                            stackId="a"
                        />
                        <Area
                            dataKey="ca"
                            type="monotone"
                            fill="url(#fillCa)"
                            stroke="var(--color-ca)"
                            stackId="b"
                        />
                    </AreaChart>
                </ChartContainer>
            </Card>

            {/* Commandes par semaine */}
            <Card className="p-4">
                <div className="mb-2">
                    <h2 className="font-bold text-sm">
                        Commandes par semaine — 8 dernières semaines
                    </h2>
                </div>
                <ChartContainer
                    config={weeklyChartConfig}
                    className="h-[220px] w-full"
                >
                    <BarChart data={weeklyChartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="week"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </Card>

            {/* CA par réseau + Top clients */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                    <h2 className="font-bold text-sm mb-4">CA par réseau</h2>
                    {!stats || stats.revenueByNetwork.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Aucune commande pour le moment.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {stats.revenueByNetwork.map((n, i) => (
                                <div key={n.network}>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <span className="font-medium">{n.network}</span>
                                        <span className="text-muted-foreground tabular-nums">
                                            {fcfa(n.revenue)} · {n.count} commande
                                            {n.count !== 1 ? "s" : ""}
                                        </span>
                                    </div>
                                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${maxNetworkRevenue > 0 ? (n.revenue / maxNetworkRevenue) * 100 : 0}%`,
                                                backgroundColor:
                                                    NETWORK_COLORS[i % NETWORK_COLORS.length],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card className="p-4">
                    <h2 className="font-bold text-sm mb-4 flex items-center gap-2">
                        <IconCrown className="w-4 h-4 text-warning" />
                        Top clients
                    </h2>
                    {!stats || stats.topSpenders.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            Aucune commande pour le moment.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {stats.topSpenders.map((s, i) => (
                                <div
                                    key={s.userId}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <span className="w-5 shrink-0 text-muted-foreground tabular-nums">
                                        {i + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate">
                                            {s.name ?? s.email}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {s.email}
                                        </p>
                                    </div>
                                    <span className="font-bold text-primary tabular-nums shrink-0">
                                        {fcfa(s.totalSpent)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>

            {/* Top services */}
            <Card className="p-4">
                <h2 className="font-bold text-sm mb-4">
                    Services les plus rentables
                </h2>
                {!stats || stats.topServices.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Aucune commande pour le moment.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Réseau</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead className="text-right">Commandes</TableHead>
                                <TableHead className="text-right">CA généré</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stats.topServices.map((s) => (
                                <TableRow key={`${s.network}-${s.serviceName}`}>
                                    <TableCell className="text-muted-foreground">
                                        {s.network}
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {s.serviceName}
                                    </TableCell>
                                    <TableCell className="text-right text-muted-foreground tabular-nums">
                                        {s.count}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-primary tabular-nums">
                                        {fcfa(s.revenue)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par référence, nom ou email..."
                        className="pl-9"
                    />
                </div>
                <Select value={kindFilter} onValueChange={setKindFilter}>
                    <SelectTrigger className="sm:w-[180px]">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les types</SelectItem>
                        <SelectItem value="Commande">Commandes</SelectItem>
                        <SelectItem value="Rechargement">Rechargements</SelectItem>
                        <SelectItem value="Ajustement">Ajustements admin</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="sm:w-[160px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="PENDING">En attente</SelectItem>
                        <SelectItem value="COMPLETED">Terminée</SelectItem>
                        <SelectItem value="FAILED">Échouée</SelectItem>
                    </SelectContent>
                </Select>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        <IconX data-icon="inline-start" />
                        Réinitialiser
                    </Button>
                )}
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Référence</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-sm text-muted-foreground py-8"
                                >
                                    Aucune transaction ne correspond à ces filtres.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((t) => {
                                const kind = kindOf(t.reference);
                                const st = STATUS_CONFIG[t.status];
                                return (
                                    <TableRow key={t.id}>
                                        <TableCell>
                                            <p className="font-medium">
                                                {t.user.name ?? "—"}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t.user.email}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {kind}
                                        </TableCell>
                                        <TableCell
                                            className={`text-right font-bold tabular-nums ${t.type === "CREDIT" ? "text-success" : "text-destructive"}`}
                                        >
                                            {t.type === "CREDIT" ? "+" : "−"}
                                            {fcfa(t.amount)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={st.variant}>{st.label}</Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-muted-foreground">
                                            {t.reference}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(t.createdAt).toLocaleDateString(
                                                "fr-FR",
                                                {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                },
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
