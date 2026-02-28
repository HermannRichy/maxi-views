"use client";

import { useEffect, useState } from "react";
import { FuturisticCard, CLIP_TR_SM } from "@/components/ui/futuristic";
import { ShoppingCart, RefreshCw } from "lucide-react";

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

const STATUS_CONFIG = {
    PENDING: {
        label: "En attente",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
    },
    PROCESSING: {
        label: "En cours",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
    },
    COMPLETED: {
        label: "Terminée",
        color: "text-green-400",
        bg: "bg-green-400/10",
    },
    FAILED: { label: "Échouée", color: "text-red-400", bg: "bg-red-400/10" },
    CANCELLED: {
        label: "Annulée",
        color: "text-zinc-400",
        bg: "bg-zinc-400/10",
    },
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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Mes commandes</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {orders.length} commande{orders.length !== 1 ? "s" : ""} au
                    total
                </p>
            </div>

            {orders.length === 0 ? (
                <FuturisticCard className="p-10 text-center">
                    <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
                    <p className="text-muted-foreground">
                        Aucune commande pour l&apos;instant.
                    </p>
                </FuturisticCard>
            ) : (
                <div className="space-y-3">
                    {orders.map((order) => {
                        const st = STATUS_CONFIG[order.status];
                        return (
                            <FuturisticCard key={order.id} className="p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-sm">
                                                {order.serviceName}
                                            </span>
                                            <span
                                                className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5"
                                                style={{ clipPath: CLIP_TR_SM }}
                                            >
                                                {order.network}
                                            </span>
                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 ${st.color} ${st.bg}`}
                                                style={{ clipPath: CLIP_TR_SM }}
                                            >
                                                {st.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {order.quantity.toLocaleString(
                                                "fr-FR",
                                            )}{" "}
                                            unités
                                            {order.japOrderId && (
                                                <> · JAP #{order.japOrderId}</>
                                            )}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {new Date(
                                                order.createdAt,
                                            ).toLocaleDateString("fr-FR", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="shrink-0">
                                        <p className="font-black text-primary tabular-nums text-lg">
                                            {order.amount.toLocaleString(
                                                "fr-FR",
                                            )}{" "}
                                            FCFA
                                        </p>
                                        <p className="text-xs text-muted-foreground text-right">
                                            Ref: #
                                            {order.id.slice(-8).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </FuturisticCard>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
