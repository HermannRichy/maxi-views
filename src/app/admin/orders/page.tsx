"use client";

import { useEffect, useState } from "react";
import { FuturisticCard, CLIP_TR_SM } from "@/components/ui/futuristic";
import {
    RefreshCw,
    CheckCircle2,
    Clock,
    XCircle,
    Ban,
    Loader2,
    Save,
    Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

type OrderStatus =
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED";

type Order = {
    id: string;
    network: string;
    serviceName: string;
    link: string;
    quantity: number;
    amount: number;
    status: OrderStatus;
    japOrderId: string | null;
    adminNote: string | null;
    createdAt: string;
    user: { name: string | null; email: string };
};

const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; color: string; bg: string; Icon: React.ElementType }
> = {
    PENDING: {
        label: "En attente",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        Icon: Clock,
    },
    PROCESSING: {
        label: "En cours",
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        Icon: Loader2,
    },
    COMPLETED: {
        label: "Terminée",
        color: "text-green-400",
        bg: "bg-green-400/10",
        Icon: CheckCircle2,
    },
    FAILED: {
        label: "Échouée",
        color: "text-red-400",
        bg: "bg-red-400/10",
        Icon: XCircle,
    },
    CANCELLED: {
        label: "Annulée",
        color: "text-zinc-400",
        bg: "bg-zinc-400/10",
        Icon: Ban,
    },
};

const ALL_STATUSES: OrderStatus[] = [
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
];

function OrderRow({
    order,
    onUpdated,
}: {
    order: Order;
    onUpdated: (o: Order) => void;
}) {
    const [status, setStatus] = useState<OrderStatus>(order.status);
    const [japOrderId, setJapOrderId] = useState(order.japOrderId ?? "");
    const [adminNote, setAdminNote] = useState(order.adminNote ?? "");
    const [saving, setSaving] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const st = STATUS_CONFIG[status];

    const save = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    japOrderId: japOrderId || undefined,
                    adminNote: adminNote || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success("Commande mise à jour");
            onUpdated(data.order);
        } catch {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setSaving(false);
        }
    };

    return (
        <FuturisticCard className="overflow-hidden">
            {/* Header row */}
            <button
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/20 transition-colors"
                onClick={() => setExpanded((e) => !e)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">
                            #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <span
                            className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            {order.network}
                        </span>
                        <span
                            className={`text-xs font-medium px-2 py-0.5 flex items-center gap-1 ${st.color} ${st.bg}`}
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <st.Icon className="w-3 h-3" /> {st.label}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {order.user.name ?? order.user.email} ·{" "}
                        {order.serviceName} ·{" "}
                        {order.quantity.toLocaleString("fr-FR")} unités
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="font-black text-primary tabular-nums">
                        {order.amount.toLocaleString("fr-FR")} FCFA
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                </div>
            </button>

            {/* Expanded panel */}
            {expanded && (
                <div className="border-t border-border/50 p-4 space-y-4 bg-muted/10">
                    {/* Link */}
                    <div className="flex items-center gap-2 text-sm">
                        <LinkIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <a
                            href={order.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline truncate text-xs"
                        >
                            {order.link}
                        </a>
                    </div>

                    {/* Status change */}
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                            Statut
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {ALL_STATUSES.map((s) => {
                                const cfg = STATUS_CONFIG[s];
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setStatus(s)}
                                        className={`text-xs font-semibold px-3 py-1.5 border transition-colors ${status === s ? `${cfg.color} ${cfg.bg} border-current` : "border-border text-muted-foreground hover:border-primary/50"}`}
                                        style={{ clipPath: CLIP_TR_SM }}
                                    >
                                        {cfg.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* JAP Order ID */}
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                            ID Commande JAP
                        </label>
                        <input
                            type="text"
                            value={japOrderId}
                            onChange={(e) => setJapOrderId(e.target.value)}
                            placeholder="Saisir après avoir lancé sur JAP"
                            className="w-full bg-muted/30 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
                            style={{ clipPath: CLIP_TR_SM }}
                        />
                    </div>

                    {/* Admin note */}
                    <div>
                        <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                            Note admin (visible par le client)
                        </label>
                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            rows={2}
                            placeholder="Informations complémentaires pour le client..."
                            className="w-full bg-muted/30 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                            style={{ clipPath: CLIP_TR_SM }}
                        />
                    </div>

                    {/* Save */}
                    <div className="flex justify-end">
                        <button
                            onClick={save}
                            disabled={saving}
                            className="group relative inline-block disabled:opacity-50"
                        >
                            <div
                                className="absolute inset-0 bg-primary/30 translate-x-[2px] translate-y-[2px]"
                                style={{ clipPath: CLIP_TR_SM }}
                            />
                            <div
                                className="relative px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-2 group-hover:bg-primary/90 transition-colors"
                                style={{ clipPath: CLIP_TR_SM }}
                            >
                                {saving ? (
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Save className="w-3.5 h-3.5" />
                                )}
                                Enregistrer
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </FuturisticCard>
    );
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<OrderStatus | "ALL">("ALL");

    useEffect(() => {
        fetch("/api/admin/orders")
            .then((r) => r.json())
            .then((d) => setOrders(d.orders ?? []))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdated = (updated: Order) => {
        setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o)),
        );
    };

    const filtered =
        filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Gestion des commandes
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        {orders.length} commande{orders.length !== 1 ? "s" : ""}{" "}
                        au total
                    </p>
                </div>
                <button
                    onClick={() => {
                        setLoading(true);
                        fetch("/api/admin/orders")
                            .then((r) => r.json())
                            .then((d) => setOrders(d.orders ?? []))
                            .finally(() => setLoading(false));
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                    <RefreshCw className="w-4 h-4" /> Rafraîchir
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {(["ALL", ...ALL_STATUSES] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`text-xs font-semibold px-3 py-1.5 border transition-colors ${filter === s ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                        style={{ clipPath: CLIP_TR_SM }}
                    >
                        {s === "ALL"
                            ? `Toutes (${orders.length})`
                            : `${STATUS_CONFIG[s].label} (${orders.filter((o) => o.status === s).length})`}
                    </button>
                ))}
            </div>

            {/* Orders */}
            {filtered.length === 0 ? (
                <FuturisticCard className="p-8 text-center text-sm text-muted-foreground">
                    Aucune commande avec ce filtre.
                </FuturisticCard>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => (
                        <OrderRow
                            key={order.id}
                            order={order as Order}
                            onUpdated={handleUpdated}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
