"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    IconEyeShare,
    IconLayoutDashboard,
    IconShoppingCart,
    IconUsers,
    IconShieldCheck,
    IconArrowLeft,
    IconLogout,
    IconAdjustments,
    IconMail,
    IconReceipt2,
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
import { SignOutConfirm } from "@/components/ui/sign-out-confirm";

const NAV_ITEMS = [
    { href: "/admin", label: "Dashboard", Icon: IconLayoutDashboard },
    { href: "/admin/orders", label: "Commandes", Icon: IconShoppingCart },
    { href: "/admin/transactions", label: "Transactions", Icon: IconReceipt2 },
    { href: "/admin/users", label: "Utilisateurs", Icon: IconUsers },
    { href: "/admin/services", label: "Services", Icon: IconAdjustments },
    { href: "/admin/emails", label: "Emails", Icon: IconMail },
];

interface AdminSidebarProps {
    email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
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

                <div className="mx-1 mt-1 flex items-center gap-1.5 px-2 text-xs text-primary group-data-[collapsible=icon]:hidden">
                    <IconShieldCheck className="w-3.5 h-3.5" /> Panel Admin
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

                <SidebarGroup>
                    <SidebarGroupLabel>Espace client</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Mon dashboard">
                                    <Link href="/dashboard">
                                        <IconArrowLeft />
                                        <span>Mon dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarSeparator />
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            tooltip={email}
                            className="cursor-default hover:bg-transparent active:bg-transparent"
                        >
                            <span className="truncate text-xs text-muted-foreground">
                                {email}
                            </span>
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
