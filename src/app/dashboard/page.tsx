import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import {
    IconArrowRight,
    IconWallet,
    IconShoppingCart,
    IconTrendingUp,
    IconPlus,
} from "@tabler/icons-react";
import { FuturisticCard, SectionBorder } from "@/components/ui/futuristic";

const STATUS_CONFIG = {
    PENDING: {
        label: "En attente",
        color: "text-warning",
        bg: "bg-warning/10",
    },
    PROCESSING: {
        label: "En cours",
        color: "text-info",
        bg: "bg-info/10",
    },
    COMPLETED: {
        label: "Terminée",
        color: "text-success",
        bg: "bg-success/10",
    },
    FAILED: { label: "Échouée", color: "text-destructive", bg: "bg-destructive/10" },
    CANCELLED: {
        label: "Annulée",
        color: "text-muted-foreground",
        bg: "bg-muted",
    },
} as const;

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    const recentOrders = await prisma.order.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    const totalOrders = await prisma.order.count({
        where: { userId: user.id },
    });
    const completedOrders = await prisma.order.count({
        where: { userId: user.id, status: "COMPLETED" },
    });

    return (
        <div className="space-y-8">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-bold">
                    Bonjour,{" "}
                    <span className="text-primary">
                        {user.name ?? user.email.split("@")[0]}
                    </span>{" "}
                    👋
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Bienvenue sur votre espace Maxi Views
                </p>
            </div>

            <SectionBorder />

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Balance */}
                <FuturisticCard className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Solde
                            </p>
                            <p className="text-3xl font-black text-primary tabular-nums">
                                {user.balance.toLocaleString("fr-FR")}
                                <span className="text-sm font-semibold ml-1">
                                    FCFA
                                </span>
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <IconWallet className="w-4 h-4" />
                        </div>
                    </div>
                    <Link
                        href="/dashboard/wallet"
                        className="mt-4 flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                        Recharger <IconArrowRight className="w-3 h-3" />
                    </Link>
                </FuturisticCard>

                {/* Total orders */}
                <FuturisticCard className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Commandes
                            </p>
                            <p className="text-3xl font-black tabular-nums">
                                {totalOrders}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <IconShoppingCart className="w-4 h-4" />
                        </div>
                    </div>
                </FuturisticCard>

                {/* Completed orders */}
                <FuturisticCard className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                Terminées
                            </p>
                            <p className="text-3xl font-black text-success tabular-nums">
                                {completedOrders}
                            </p>
                        </div>
                        <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center text-success">
                            <IconTrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                </FuturisticCard>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
                <Link
                    href="/dashboard/new-order"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                    <IconPlus className="w-4 h-4" /> Nouvelle commande
                </Link>
                <Link
                    href="/dashboard/wallet"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-accent transition-colors"
                >
                    <IconWallet className="w-4 h-4" /> Recharger
                </Link>
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">Dernières commandes</h2>
                    <Link
                        href="/dashboard/orders"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                        Tout voir <IconArrowRight className="w-3 h-3" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <FuturisticCard className="p-8 text-center">
                        <IconShoppingCart className="w-10 h-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground text-sm">
                            Aucune commande pour l&apos;instant
                        </p>
                        <Link
                            href="/dashboard/new-order"
                            className="text-primary text-sm hover:underline mt-2 inline-block"
                        >
                            Passer une commande →
                        </Link>
                    </FuturisticCard>
                ) : (
                    <div className="space-y-3">
                        {recentOrders.map((order) => {
                            const st = STATUS_CONFIG[order.status];
                            return (
                                <FuturisticCard
                                    key={order.id}
                                    className="p-4 flex items-center justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm truncate">
                                            {order.serviceName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {order.network} ·{" "}
                                            {order.quantity.toLocaleString(
                                                "fr-FR",
                                            )}{" "}
                                            unités
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.color} ${st.bg}`}
                                        >
                                            {st.label}
                                        </span>
                                        <span className="text-sm font-bold text-primary tabular-nums">
                                            {order.amount.toLocaleString(
                                                "fr-FR",
                                            )}{" "}
                                            FCFA
                                        </span>
                                    </div>
                                </FuturisticCard>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
