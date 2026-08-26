"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
    IconEyeShare,
    IconMenu,
    IconX,
    IconArrowRight,
} from "@tabler/icons-react";
import { SectionBorder } from "@/components/ui/futuristic";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";

function SignedIn({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();
    if (isPending || !session) return null;
    return <>{children}</>;
}

function SignedOut({ children }: { children: React.ReactNode }) {
    const { data: session, isPending } = authClient.useSession();
    if (isPending || session) return null;
    return <>{children}</>;
}

/* ─────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
    { href: "#services", label: "Services" },
    { href: "#reseaux", label: "Réseaux" },
    { href: "#pourquoi", label: "Pourquoi nous" },
    { href: "#faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
];

/* ─────────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────────── */
function NavLink({
    href,
    children,
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    onClick?: () => void;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="relative text-sm text-muted-foreground hover:text-foreground transition-colors group py-1"
        >
            {children}
            <span className="absolute bottom-0 left-0 h-px w-0 bg-primary group-hover:w-full transition-all duration-300 origin-left" />
        </Link>
    );
}

function FuturisticCta({
    href,
    children,
    variant = "primary",
    onClick,
}: {
    href: string;
    children: React.ReactNode;
    variant?: "primary" | "ghost";
    onClick?: () => void;
}) {
    if (variant === "ghost") {
        return (
            <Link
                href={href}
                onClick={onClick}
                className="px-4 py-1.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            >
                {children}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
        >
            {children}
        </Link>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Mobile Drawer
───────────────────────────────────────────────────────────────── */
function MobileMenu({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const close = () => onOpenChange(false);

    useGSAP(
        () => {
            if (!open) return;
            gsap.fromTo(
                "[data-menu-item]",
                { autoAlpha: 0, y: 12 },
                {
                    autoAlpha: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.06,
                    ease: "power3.out",
                    delay: 0.1,
                    overwrite: true,
                },
            );
        },
        { dependencies: [open], scope: contentRef },
    );

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerTrigger asChild>
                <button
                    className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                    aria-label="Ouvrir le menu"
                >
                    <IconMenu className="w-5 h-5" />
                </button>
            </DrawerTrigger>
            <DrawerContent
                ref={contentRef}
                showSwipeHandle
                className="bg-background border-white/10 max-h-[85vh]"
            >
                <DrawerDescription className="sr-only">
                    Menu de navigation Maxi Views
                </DrawerDescription>

                {/* Header row */}
                <div className="flex items-center justify-between px-6 pt-2 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                            <IconEyeShare className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <DrawerTitle className="font-display font-bold text-sm">
                            Maxi<span className="text-primary"> Views</span>
                        </DrawerTitle>
                    </div>
                    <DrawerClose asChild>
                        <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                            aria-label="Fermer le menu"
                        >
                            <IconX className="w-5 h-5" />
                        </button>
                    </DrawerClose>
                </div>

                {/* Nav links */}
                <nav className="px-6 pt-4 pb-6 flex flex-col gap-1 border-t border-white/10">
                    <p data-menu-item className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">
                        Navigation
                    </p>
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={close}
                            data-menu-item
                            className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                            {item.label}
                            <IconArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </nav>

                {/* CTA area */}
                <div className="px-6 pt-6 pb-8 flex flex-col gap-3 border-t border-white/10">
                    <p data-menu-item className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">
                        Compte
                    </p>
                    <SignedOut>
                        <div data-menu-item>
                            <FuturisticCta href="/sign-in" variant="ghost" onClick={close}>
                                Se connecter
                            </FuturisticCta>
                        </div>
                        <div data-menu-item>
                            <FuturisticCta href="/sign-up" variant="primary" onClick={close}>
                                Commencer
                            </FuturisticCta>
                        </div>
                    </SignedOut>
                    <SignedIn>
                        <div data-menu-item>
                            <FuturisticCta href="/dashboard" variant="primary" onClick={close}>
                                Dashboard
                            </FuturisticCta>
                        </div>
                    </SignedIn>
                </div>
            </DrawerContent>
        </Drawer>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Main Header
───────────────────────────────────────────────────────────────── */
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* ── Logo ── */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                        <IconEyeShare className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold tracking-tight">
                        Maxi<span className="text-primary"> Views</span>
                    </span>
                </Link>

                {/* ── Desktop nav ── */}
                <nav className="hidden lg:flex items-center gap-8">
                    {NAV_LINKS.map((item) => (
                        <NavLink key={item.label} href={item.href}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                {/* ── Desktop CTAs ── */}
                <div className="hidden lg:flex items-center gap-3">
                    <SignedOut>
                        <FuturisticCta href="/sign-in" variant="ghost">
                            Se connecter
                        </FuturisticCta>
                        <FuturisticCta href="/sign-up" variant="primary">
                            Commencer
                        </FuturisticCta>
                    </SignedOut>
                    <SignedIn>
                        <FuturisticCta href="/dashboard" variant="primary">
                            Dashboard
                        </FuturisticCta>
                    </SignedIn>
                </div>

                {/* ── Hamburger (mobile + tablet) ── */}
                <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} />
            </div>

            {/* ── Bottom border ── */}
            <SectionBorder />
        </header>
    );
}
