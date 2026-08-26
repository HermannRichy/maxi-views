import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { AdminSidebar } from "@/components/admin-sidebar";
import { GlowOrb } from "@/components/ui/futuristic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");
    if (user.role !== "ADMIN") redirect("/dashboard");

    const cookieStore = await cookies();
    const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

    return (
        <TooltipProvider delayDuration={0}>
            <SidebarProvider defaultOpen={defaultOpen}>
                <AdminSidebar email={user.email} />
                <SidebarInset className="relative">
                    <GlowOrb className="top-0 right-0 -z-10" size={400} blur={120} />

                    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-white/10 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="h-4" />
                        <span className="text-sm font-semibold text-muted-foreground">
                            Panel Admin
                        </span>
                    </header>

                    <main className="flex-1 p-6 overflow-auto">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    );
}
