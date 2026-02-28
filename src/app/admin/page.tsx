import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FuturisticCard, CLIP_TR_SM } from "@/components/ui/futuristic";
import {
    Clock,
    Loader2,
    CheckCircle2,
    XCircle,
    Users,
    ShoppingCart,
} from "lucide-react";

export default async function AdminDashboardPage() {
    // Vérifier que c'est un admin
    const admin = await requireAdmin().catch(() => null);
    if (!admin) redirect("/dashboard");

    const [pending, processing, completed, failed, totalUsers, totalOrders] =
        await Promise.all([
            prisma.order.count({ where: { status: "PENDING" } }),
            prisma.order.count({ where: { status: "PROCESSING" } }),
            prisma.order.count({ where: { status: "COMPLETED" } }),
            prisma.order.count({ where: { status: "FAILED" } }),
            prisma.user.count(),
            prisma.order.count(),
        ]);

    const recentOrders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true, email: true } } },
    });

    const stats = [
        {
            label: "En attente",
            value: pending,
            Icon: Clock,
            color: "text-yellow-400",
            bg: "bg-yellow-400/10",
        },
        {
            label: "En cours",
            value: processing,
            Icon: Loader2,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Terminées",
            value: completed,
            Icon: CheckCircle2,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            label: "Échouées",
            value: failed,
            Icon: XCircle,
            color: "text-red-400",
            bg: "bg-red-400/10",
        },
        {
            label: "Utilisateurs",
            value: totalUsers,
            Icon: Users,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            label: "Total commandes",
            value: totalOrders,
            Icon: ShoppingCart,
            color: "text-primary",
            bg: "bg-primary/10",
        },
    ];

    const STATUS_LABELS: Record<string, { label: string; color: string }> = {
        PENDING: { label: "En attente", color: "text-yellow-400" },
        PROCESSING: { label: "En cours", color: "text-blue-400" },
        COMPLETED: { label: "Terminée", color: "text-green-400" },
        FAILED: { label: "Échouée", color: "text-red-400" },
        CANCELLED: { label: "Annulée", color: "text-zinc-400" },
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">Panel Admin</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Vue d&apos;ensemble de la plateforme
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                    <FuturisticCard key={s.label} className="p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                                    {s.label}
                                </p>
                                <p
                                    className={`text-3xl font-black tabular-nums ${s.color}`}
                                >
                                    {s.value}
                                </p>
                            </div>
                            <div
                                className={`w-9 h-9 flex items-center justify-center ${s.color} ${s.bg}`}
                                style={{ clipPath: CLIP_TR_SM }}
                            >
                                <s.Icon className="w-4 h-4" />
                            </div>
                        </div>
                    </FuturisticCard>
                ))}
            </div>

            {/* Recent orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">Dernières commandes</h2>
                    <Link
                        href="/admin/orders"
                        className="text-xs text-primary hover:underline"
                    >
                        Gérer →
                    </Link>
                </div>
                <div className="space-y-2">
                    {recentOrders.map((order) => {
                        const st = STATUS_LABELS[order.status];
                        return (
                            <FuturisticCard
                                key={order.id}
                                className="p-4 flex items-center gap-4"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-bold text-sm">
                                            #{order.id.slice(-8).toUpperCase()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {order.user.name ??
                                                order.user.email}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {order.network} · {order.serviceName} ·{" "}
                                        {order.quantity.toLocaleString("fr-FR")}{" "}
                                        unités
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p
                                        className={`text-xs font-medium ${st.color}`}
                                    >
                                        {st.label}
                                    </p>
                                    <p className="font-bold text-primary tabular-nums text-sm">
                                        {order.amount.toLocaleString("fr-FR")}{" "}
                                        FCFA
                                    </p>
                                </div>
                            </FuturisticCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
