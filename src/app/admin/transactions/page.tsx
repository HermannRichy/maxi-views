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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
    IconLoader2,
    IconSearch,
    IconTrendingUp,
    IconWallet,
    IconArrowsExchange,
    IconReceipt2,
    IconX,
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
    daily: { date: string; ca: number; deposits: number }[];
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                                Solde total en circulation
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
