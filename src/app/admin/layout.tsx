import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Zap, ShieldCheck, LayoutDashboard, ShoppingCart } from "lucide-react";
import { SignOutConfirm } from "@/components/ui/sign-out-confirm";
import { CLIP_TR_SM } from "@/components/ui/futuristic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");
    if (user.role !== "ADMIN") redirect("/dashboard");

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-56 bg-card border-r border-border/50 shrink-0">
                <div className="p-5 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2">
                        <div
                            className="w-7 h-7 bg-primary flex items-center justify-center"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <Zap className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-sm">
                            Maxi<span className="text-primary"> Views</span>
                        </span>
                    </Link>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                        <ShieldCheck className="w-3.5 h-3.5" /> Panel Admin
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        style={{ clipPath: CLIP_TR_SM }}
                    >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        style={{ clipPath: CLIP_TR_SM }}
                    >
                        <ShoppingCart className="w-4 h-4" /> Commandes
                    </Link>
                    <div className="h-px bg-border/50 my-2" />
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        style={{ clipPath: CLIP_TR_SM }}
                    >
                        ← Mon dashboard
                    </Link>
                </nav>

                <div className="p-4 border-t border-border/50">
                    <p className="text-xs text-muted-foreground truncate mb-2">
                        {user.email}
                    </p>
                    <SignOutConfirm className="text-xs text-red-400 hover:text-red-300 transition-colors">
                        Se déconnecter
                    </SignOutConfirm>
                </div>
            </aside>

            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    );
}
