"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconShoppingCart } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Order = {
    id: string;
    network: string;
    serviceName: string;
    quantity: number;
    amount: number;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
    japOrderId: string | null;
    createdAt: string;
};

const STATUS_CONFIG: Record<
    Order["status"],
    { label: string; variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]> }
> = {
    PENDING: { label: "En attente", variant: "warning" },
    PROCESSING: { label: "En cours", variant: "info" },
    COMPLETED: { label: "Terminée", variant: "success" },
    FAILED: { label: "Échouée", variant: "destructive" },
    CANCELLED: { label: "Annulée", variant: "secondary" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/orders")
            .then((r) => r.json())
            .then((d) => setOrders(d.orders ?? []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Mes commandes</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {loading
                        ? "Chargement..."
                        : `${orders.length} commande${orders.length !== 1 ? "s" : ""} au total`}
                </p>
            </div>

            {loading ? (
                <Card>
                    <div className="p-5 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))}
                    </div>
                </Card>
            ) : orders.length === 0 ? (
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
                                <TableHead>Référence</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Réseau</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">
                                    Montant
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const st = STATUS_CONFIG[order.status];
                                return (
                                    <TableRow key={order.id}>
                                        <TableCell className="text-muted-foreground font-mono text-xs">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {order.serviceName}
                                            {order.japOrderId && (
                                                <span className="block text-xs text-muted-foreground font-normal">
                                                    JAP #{order.japOrderId}
                                                </span>
                                            )}
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
                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
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
    );
}
