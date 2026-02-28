import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import {
    LayoutDashboard,
    Wallet,
    ShoppingCart,
    Plus,
    Settings,
    LogOut,
    Zap,
    ShieldCheck,
} from "lucide-react";
import { SignOutConfirm } from "@/components/ui/sign-out-confirm";
import { CLIP_TR_SM } from "@/components/ui/futuristic";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
    { href: "/dashboard/new-order", label: "Nouvelle commande", Icon: Plus },
    { href: "/dashboard/orders", label: "Mes commandes", Icon: ShoppingCart },
    { href: "/dashboard/wallet", label: "Portefeuille", Icon: Wallet },
];

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="min-h-screen bg-background flex">
            {/* ── Sidebar ── */}
            <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border/50 shrink-0">
                {/* Logo */}
                <div className="p-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div
                            className="w-8 h-8 bg-primary flex items-center justify-center"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <Zap className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-display text-lg font-bold">
                            Maxi<span className="text-primary"> Views</span>
                        </span>
                    </Link>
                </div>

                {/* Balance chip */}
                <div
                    className="mx-4 mt-4 p-3 bg-primary/5 border border-primary/20"
                    style={{ clipPath: CLIP_TR_SM }}
                >
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Solde
                    </p>
                    <p className="font-black text-primary tabular-nums">
                        {(user.balance ?? 0).toLocaleString("fr-FR")} FCFA
                    </p>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group rounded-none"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <item.Icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                            {item.label}
                        </Link>
                    ))}

                    {/* Admin link */}
                    {user.role === "ADMIN" && (
                        <>
                            <div className="h-px bg-border/50 my-2" />
                            <Link
                                href="/admin"
                                className="flex items-center gap-3 px-3 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors"
                                style={{ clipPath: CLIP_TR_SM }}
                            >
                                <ShieldCheck className="w-4 h-4" />
                                Panel Admin
                            </Link>
                        </>
                    )}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-border/50 space-y-1">
                    <div className="px-3 py-2">
                        <p className="text-xs font-medium truncate">
                            {user.name ?? user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                        </p>
                    </div>
                    <SignOutConfirm className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors w-full" />
                </div>
            </aside>

            {/* ── Main ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile top bar */}
                <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card">
                    <Link href="/" className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 bg-primary flex items-center justify-center"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-base">
                            Maxi<span className="text-primary"> Views</span>
                        </span>
                    </Link>
                    <span className="text-sm font-bold text-primary tabular-nums">
                        {(user.balance ?? 0).toLocaleString("fr-FR")} FCFA
                    </span>
                </div>

                {/* Page content */}
                <main className="flex-1 p-6 overflow-auto">{children}</main>

                {/* Mobile bottom nav */}
                <nav className="md:hidden flex border-t border-border/50 bg-card">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex-1 flex flex-col items-center gap-1 py-3 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                            <item.Icon className="w-5 h-5" />
                            <span className="text-[10px]">
                                {item.label.split(" ")[0]}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
