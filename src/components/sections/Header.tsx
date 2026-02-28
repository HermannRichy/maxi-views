"use client";

import { useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Zap, Menu, X, ArrowRight } from "lucide-react";
import {
    CornerBracket,
    CLIP_TR_SM,
    SectionBorder,
} from "@/components/ui/futuristic";

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
            <span className="absolute bottom-0 right-0 w-1 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200" />
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
                className="relative px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
                <CornerBracket
                    size={7}
                    className="absolute top-0 left-0 text-border group-hover:text-primary transition-colors"
                    rotate={0}
                />
                <CornerBracket
                    size={7}
                    className="absolute bottom-0 right-0 text-border group-hover:text-primary transition-colors"
                    rotate={180}
                />
                <span>{children}</span>
            </Link>
        );
    }

    return (
        <Link
            href={href}
            onClick={onClick}
            className="relative group inline-block"
        >
            <div
                className="absolute inset-0 bg-primary/30 translate-x-[2px] translate-y-[2px]"
                style={{ clipPath: CLIP_TR_SM }}
            />
            <div
                className="relative px-4 py-1.5 bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1.5 group-hover:bg-primary/90 transition-colors"
                style={{ clipPath: CLIP_TR_SM }}
            >
                {children}
                <Zap className="w-3 h-3" />
            </div>
            <svg
                className="absolute top-0 right-0 text-primary-foreground/40"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
            >
                <path d="M 10 0 L 0 10 L 10 10 Z" fill="currentColor" />
            </svg>
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
                className={`fixed top-0 right-0 z-50 h-full w-72 bg-background transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                {/* Top border accent */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

                {/* Header row */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-6 h-6 bg-primary flex items-center justify-center"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <Zap className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <span className="font-display font-bold text-sm">
                            Maxi<span className="text-primary"> Views</span>
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="Fermer le menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="px-6 py-6 flex flex-col gap-1 border-b border-border/50">
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
                            <div className="w-1 h-1 bg-primary/40 rotate-45 group-hover:bg-primary transition-colors" />
                            {item.label}
                            <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
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

                {/* Bottom corner bracket decoration */}
                <CornerBracket
                    size={14}
                    thickness={1}
                    className="absolute bottom-4 left-4 text-primary/20"
                    rotate={270}
                />
                <CornerBracket
                    size={14}
                    thickness={1}
                    className="absolute bottom-4 right-4 text-primary/20"
                    rotate={180}
                />
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
                {/* Top accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div
                                className="w-8 h-8 bg-primary flex items-center justify-center"
                                style={{ clipPath: CLIP_TR_SM }}
                            >
                                <Zap className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <CornerBracket
                                size={6}
                                className="absolute -bottom-1 -left-1 text-primary/50 group-hover:text-primary transition-colors"
                                rotate={270}
                            />
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
                        className="lg:hidden relative w-9 h-9 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        style={{ clipPath: CLIP_TR_SM }}
                        aria-label="Ouvrir le menu"
                    >
                        <div
                            className="absolute inset-0 bg-muted/50"
                            style={{ clipPath: CLIP_TR_SM }}
                        />
                        <Menu className="w-5 h-5 relative z-10" />
                    </button>
                </div>

                {/* ── Bottom border with notch ── */}
                <SectionBorder />

                {/* Corner brackets */}
                <CornerBracket
                    size={10}
                    thickness={1}
                    className="absolute bottom-0 right-6 text-primary/30"
                    rotate={180}
                />
                <CornerBracket
                    size={10}
                    thickness={1}
                    className="absolute bottom-0 left-6 text-primary/30"
                    rotate={270}
                />
            </header>

            {/* Mobile Drawer */}
            <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
    );
}
