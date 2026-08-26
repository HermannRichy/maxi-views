"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconEyeShare,
    IconLayoutDashboard,
    IconWallet,
    IconShoppingCart,
    IconPlus,
    IconShieldCheck,
    IconLogout,
} from "@tabler/icons-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignOutConfirm } from "@/components/ui/sign-out-confirm";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Tableau de bord", Icon: IconLayoutDashboard },
    { href: "/dashboard/new-order", label: "Nouvelle commande", Icon: IconPlus },
    { href: "/dashboard/orders", label: "Mes commandes", Icon: IconShoppingCart },
    { href: "/dashboard/wallet", label: "Portefeuille", Icon: IconWallet },
];

interface DashboardSidebarProps {
    user: {
        name: string | null;
        email: string;
        balance: number;
        role: string;
    };
}

function initials(name: string | null, email: string) {
    const source = name?.trim() || email;
    return source.slice(0, 2).toUpperCase();
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
    const pathname = usePathname();

    return (
        <Sidebar collapsible="icon" className="border-white/10">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="hover:bg-transparent active:bg-transparent"
                        >
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <IconEyeShare className="size-4" />
                                </div>
                                <span className="font-display font-bold text-sm truncate">
                                    Maxi<span className="text-primary"> Views</span>
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <div className="mx-1 mt-1 rounded-xl bg-primary/5 border border-primary/20 p-3 group-data-[collapsible=icon]:hidden">
                    <p className="text-[11px] text-muted-foreground mb-0.5">Solde</p>
                    <p className="font-black text-primary tabular-nums text-sm">
                        {user.balance.toLocaleString("fr-FR")} FCFA
                    </p>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {NAV_ITEMS.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        tooltip={item.label}
                                    >
                                        <Link href={item.href}>
                                            <item.Icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {user.role === "ADMIN" && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip="Panel Admin"
                                        className="text-primary hover:text-primary"
                                    >
                                        <Link href="/admin">
                                            <IconShieldCheck />
                                            <span>Panel Admin</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            tooltip={user.name ?? user.email}
                            className="cursor-default hover:bg-transparent active:bg-transparent"
                        >
                            <Avatar className="size-6 rounded-lg">
                                <AvatarFallback className="rounded-lg text-[10px]">
                                    {initials(user.name, user.email)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate text-xs font-medium">
                                    {user.name ?? user.email}
                                </span>
                                <span className="truncate text-[11px] text-muted-foreground">
                                    {user.email}
                                </span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SignOutConfirm>
                            <SidebarMenuButton
                                tooltip="Se déconnecter"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <IconLogout />
                                <span>Se déconnecter</span>
                            </SidebarMenuButton>
                        </SignOutConfirm>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
