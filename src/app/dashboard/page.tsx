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
import { Card, CardContent } from "@/components/ui/card";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

const STATUS_CONFIG: Record<
    string,
    { label: string; variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]> }
> = {
    PENDING: { label: "En attente", variant: "warning" },
    PROCESSING: { label: "En cours", variant: "info" },
    COMPLETED: { label: "Terminée", variant: "success" },
    FAILED: { label: "Échouée", variant: "destructive" },
    CANCELLED: { label: "Annulée", variant: "secondary" },
};

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

            {/* Stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-5">
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
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
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-5">
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
                    </CardContent>
                </Card>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-3">
                <Button asChild>
                    <Link href="/dashboard/new-order">
                        <IconPlus data-icon="inline-start" />
                        Nouvelle commande
                    </Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link href="/dashboard/wallet">
                        <IconWallet data-icon="inline-start" />
                        Recharger
                    </Link>
                </Button>
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
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconShoppingCart />
                            </EmptyMedia>
                            <EmptyTitle>Aucune commande</EmptyTitle>
                            <EmptyDescription>
                                Vous n&apos;avez pas encore passé de commande.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <Button asChild size="sm">
                                <Link href="/dashboard/new-order">
                                    Passer une commande
                                </Link>
                            </Button>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Réseau</TableHead>
                                    <TableHead>Quantité</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">
                                        Montant
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentOrders.map((order) => {
                                    const st = STATUS_CONFIG[order.status];
                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-medium">
                                                {order.serviceName}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {order.network}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {order.quantity.toLocaleString(
                                                    "fr-FR",
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={st.variant}>
                                                    {st.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-primary tabular-nums">
                                                {order.amount.toLocaleString(
                                                    "fr-FR",
                                                )}{" "}
                                                FCFA
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </div>
    );
}
