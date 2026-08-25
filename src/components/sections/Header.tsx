"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { IconEyeShare, IconMenu2, IconX, IconArrowRight } from "@tabler/icons-react";
import { SectionBorder } from "@/components/ui/futuristic";

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
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Drawer panel */}
            <div
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-background border-l border-white/10 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Header row */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                            <IconEyeShare className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-sm">
                            Maxi<span className="text-primary"> Views</span>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <IconX className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="px-6 py-6 flex flex-col gap-1 border-b border-white/10">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-medium">
                        Navigation
                    </p>
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={onClose}
                            className="flex items-center gap-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                            {item.label}
                            <IconArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    ))}
                </nav>

                {/* CTA area */}
                <div className="px-6 py-6 flex flex-col gap-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-medium">
                        Compte
                    </p>
                    <SignedOut>
                        <FuturisticCta
                            href="/sign-in"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Se connecter
                        </FuturisticCta>
                        <FuturisticCta
                            href="/sign-up"
                            variant="primary"
                            onClick={onClose}
                        >
                            Commencer
                        </FuturisticCta>
                    </SignedOut>
                    <SignedIn>
                        <FuturisticCta
                            href="/dashboard"
                            variant="primary"
                            onClick={onClose}
                        >
                            Dashboard
                        </FuturisticCta>
                    </SignedIn>
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Main Header
───────────────────────────────────────────────────────────────── */
export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <>
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
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                        aria-label="Ouvrir le menu"
                    >
                        <IconMenu2 className="w-5 h-5" />
                    </button>
                </div>

                {/* ── Bottom border ── */}
                <SectionBorder />
            </header>

            {/* Mobile Drawer */}
            <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
