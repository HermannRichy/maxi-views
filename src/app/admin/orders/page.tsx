"use client";

import { useEffect, useState } from "react";
import { FuturisticCard } from "@/components/ui/futuristic";
import {
    IconRefresh,
    IconCircleCheck,
    IconClock,
    IconCircleX,
    IconBan,
    IconLoader2,
    IconDeviceFloppy,
    IconCopy,
    IconCheck,
} from "@tabler/icons-react";
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
        color: "text-warning",
        bg: "bg-warning/10",
        Icon: IconClock,
    },
    PROCESSING: {
        label: "En cours",
        color: "text-info",
        bg: "bg-info/10",
        Icon: IconLoader2,
    },
    COMPLETED: {
        label: "Terminée",
        color: "text-success",
        bg: "bg-success/10",
        Icon: IconCircleCheck,
    },
    FAILED: {
        label: "Échouée",
        color: "text-destructive",
        bg: "bg-destructive/10",
        Icon: IconCircleX,
    },
    CANCELLED: {
        label: "Annulée",
        color: "text-muted-foreground",
        bg: "bg-muted",
        Icon: IconBan,
    },
};

const ALL_STATUSES: OrderStatus[] = [
    "PENDING",
    "PROCESSING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
];

function CopyButton({
    text,
    label,
    className,
}: {
    text: string;
    label?: string;
    className?: string;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(label ? `${label} copié` : "Copié dans le presse-papiers");
            setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error("Impossible de copier");
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={label ? `Copier : ${label}` : "Copier"}
            className={
                className ??
                "shrink-0 p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            }
        >
            {copied ? (
                <IconCheck className="w-3.5 h-3.5 text-success" />
            ) : (
                <IconCopy className="w-3.5 h-3.5" />
            )}
        </button>
    );
}

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
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/30 transition-colors"
                onClick={() => setExpanded((e) => !e)}
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">
                            #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground bg-muted/50 rounded-full px-2 py-0.5">
                            {order.network}
                        </span>
                        <span
                            className={`text-xs font-medium rounded-full px-2 py-0.5 flex items-center gap-1 ${st.color} ${st.bg}`}
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
                <div className="border-t border-white/10 p-4 space-y-4 bg-muted/10">
                    {/* Détails à copier pour JAP */}
                    <div className="rounded-xl border border-white/10 divide-y divide-white/10 overflow-hidden">
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
                                Référence
                            </span>
                            <span className="font-mono text-xs truncate">
                                #{order.id.slice(-8).toUpperCase()}
                            </span>
                            <CopyButton
                                text={order.id.slice(-8).toUpperCase()}
                                label="Référence"
                            />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
                                Réseau
                            </span>
                            <span className="text-xs truncate">{order.network}</span>
                            <CopyButton text={order.network} label="Réseau" />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
                                Service
                            </span>
                            <span className="text-xs truncate">
                                {order.serviceName}
                            </span>
                            <CopyButton text={order.serviceName} label="Service" />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
                                Lien
                            </span>
                            <a
                                href={order.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline truncate text-xs"
                            >
                                {order.link}
                            </a>
                            <CopyButton text={order.link} label="Lien" />
                        </div>
                        <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                            <span className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">
                                Quantité
                            </span>
                            <span className="text-xs truncate">
                                {order.quantity.toLocaleString("fr-FR")}
                            </span>
                            <CopyButton
                                text={String(order.quantity)}
                                label="Quantité"
                            />
                        </div>
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
                                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${status === s ? `${cfg.color} ${cfg.bg} border-current` : "border-white/10 text-muted-foreground hover:border-primary/50"}`}
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
                            className="w-full bg-muted/30 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
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
                            className="w-full bg-muted/30 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                        />
                    </div>

                    {/* Save */}
                    <div className="flex justify-end">
                        <button
                            onClick={save}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30 transition-all disabled:opacity-50"
                        >
                            {saving ? (
                                <IconRefresh className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <IconDeviceFloppy className="w-3.5 h-3.5" />
                            )}
                            Enregistrer
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
                <IconRefresh className="w-6 h-6 animate-spin text-primary" />
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
                    <IconRefresh className="w-4 h-4" /> Rafraîchir
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                {(["ALL", ...ALL_STATUSES] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${filter === s ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted-foreground hover:border-primary/50"}`}
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
