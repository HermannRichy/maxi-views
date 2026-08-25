"use client";

import Link from "next/link";
import { IconEyeShare, IconCircleCheck, IconArrowUpRight } from "@tabler/icons-react";
import { SectionBorder, GeoCircle } from "@/components/ui/futuristic";
import { FOOTER_SOCIAL_ICONS, FOOTER_LINKS } from "@/data/landing";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FOOTER_SERVICES = [
    "TikTok",
    "Instagram",
    "YouTube",
    "Facebook",
    "Telegram",
];

export default function Footer() {
    const sectionRef = useScrollReveal<HTMLElement>();

    return (
        <footer ref={sectionRef} className="relative overflow-hidden pt-2">
            <GeoCircle className="-top-32 right-[10%] opacity-10 -z-10" size={360} />
            <SectionBorder />

            {/* Big CTA statement */}
            <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] max-w-2xl">
                        Prêt à faire décoller{" "}
                        <span className="text-primary">votre audience ?</span>
                    </h2>
                    <Link
                        href="/sign-up"
                        className="group inline-flex items-center gap-3 shrink-0 rounded-full bg-primary text-primary-foreground px-8 py-4 text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl transition-all w-fit"
                    >
                        Créer un compte gratuit
                        <IconArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div data-reveal className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                                <IconEyeShare className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-display text-xl font-bold">
                                Maxi<span className="text-primary"> Views</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            La plateforme SMM de référence pour booster votre
                            présence sur les réseaux sociaux.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3 mt-4">
                            {FOOTER_SOCIAL_ICONS.map(({ Icon, color }) => (
                                <div
                                    key={color}
                                    className="w-8 h-8 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
                                >
                                    <Icon
                                        className="w-4 h-4"
                                        style={{ color }}
                                        stroke={1.5}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground/90 uppercase tracking-widest">
                            Services
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {FOOTER_SERVICES.map((n) => (
                                <li key={n}>
                                    <Link
                                        href="/dashboard/new-order"
                                        className="hover:text-primary transition-colors"
                                    >
                                        {n}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liens utiles */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4 text-foreground/90 uppercase tracking-widest">
                            Liens utiles
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {FOOTER_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom row */}
                <SectionBorder />
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Maxi Views. Tous droits
                        réservés.
                    </p>
                    <div className="flex items-center gap-2">
                        <span>Paiement sécurisé par</span>
                        <span className="font-semibold text-foreground">
                            FeexPay
                        </span>
                        <IconCircleCheck className="w-3.5 h-3.5 text-success" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
