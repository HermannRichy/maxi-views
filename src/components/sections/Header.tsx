"use client";

import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export default function Header() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold tracking-tight">
                        Maxi<span className="text-primary"> Views</span>
                    </span>
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
                    <Link
                        href="#services"
                        className="hover:text-foreground transition-colors"
                    >
                        Services
                    </Link>
                    <Link
                        href="#reseaux"
                        className="hover:text-foreground transition-colors"
                    >
                        Réseaux
                    </Link>
                    <Link
                        href="#pourquoi"
                        className="hover:text-foreground transition-colors"
                    >
                        Pourquoi nous
                    </Link>
                    <Link
                        href="#faq"
                        className="hover:text-foreground transition-colors"
                    >
                        FAQ
                    </Link>
                </div>

                {/* CTA */}
                <div className="flex items-center gap-3">
                    <SignedOut>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/sign-in">Se connecter</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/sign-up">Commencer</Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        <Button size="sm" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    </SignedIn>
                </div>
            </div>
        </nav>
    );
}
