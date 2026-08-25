"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { FuturisticCard, SectionTitle, SectionBorder, GeoCircle } from "@/components/ui/futuristic";
import { IconArrowRight } from "@tabler/icons-react";
import { FEATURED_SERVICES } from "@/data/landing";
import { useTiltCards } from "@/hooks/useTiltCards";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    useTiltCards(sectionRef, 5);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(
                "[data-reveal]",
                sectionRef.current,
            );
            if (!cards.length) return;

            gsap.set(cards, { autoAlpha: 0, y: 50, scale: 0.9 });

            ScrollTrigger.batch(cards, {
                start: "top 88%",
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.7,
                        stagger: 0.08,
                        ease: "back.out(1.5)",
                        overwrite: true,
                    }),
            });
        },
        { scope: sectionRef },
    );

    const [featured, ...rest] = FEATURED_SERVICES;

    return (
        <section id="services" ref={sectionRef} className="relative overflow-hidden py-24 bg-muted/20">
            <GeoCircle className="-bottom-20 -right-20 opacity-20 -z-10" size={300} />
            <GeoCircle className="-top-16 -left-16 opacity-15 -z-10" size={220} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="Les services les plus commandés par nos clients, à des prix imbattables.">
                    Services <span className="text-primary">populaires</span>
                </SectionTitle>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Featured hero card */}
                    <div data-reveal data-tilt style={{ transformStyle: "preserve-3d" }} className="lg:col-span-2">
                        <FuturisticCard className="relative p-8 sm:p-10 h-full flex flex-col justify-between bg-primary/5">
                            <span className="absolute top-6 right-6 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                                {featured.badge}
                            </span>
                            <div className="flex items-start gap-4">
                                <featured.Icon
                                    className="w-14 h-14 shrink-0"
                                    style={{ color: featured.iconColor }}
                                    stroke={1.5}
                                />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                        {featured.network}
                                    </p>
                                    <h3 className="font-display font-black text-2xl sm:text-3xl mb-2">
                                        {featured.name}
                                    </h3>
                                    <p className="text-sm sm:text-base text-muted-foreground max-w-md leading-relaxed">
                                        {featured.desc}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-end justify-between mt-8">
                                <div>
                                    <p className="text-4xl font-black text-primary tabular-nums">
                                        {featured.price.toLocaleString("fr-FR")}
                                        <span className="text-base font-semibold ml-1">
                                            FCFA
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        pour {featured.unit}
                                    </p>
                                </div>
                                <Link
                                    href="/dashboard/new-order"
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    Commander
                                    <IconArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </FuturisticCard>
                    </div>

                    {/* Two compact cards stacked */}
                    <div className="flex flex-col gap-6">
                        {rest.slice(0, 2).map((s) => (
                            <div key={s.name} data-reveal data-tilt style={{ transformStyle: "preserve-3d" }} className="flex-1">
                                <FuturisticCard className="p-5 h-full flex flex-col justify-between">
                                    <div className="flex items-start gap-3">
                                        <s.Icon
                                            className="w-7 h-7 shrink-0"
                                            style={{ color: s.iconColor }}
                                            stroke={1.5}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                                {s.network}
                                            </p>
                                            <h3 className="font-bold text-sm truncate">{s.name}</h3>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <p className="text-lg font-black text-primary tabular-nums">
                                            {s.price.toLocaleString("fr-FR")}
                                            <span className="text-xs font-semibold ml-1">
                                                FCFA
                                            </span>
                                        </p>
                                        <Link
                                            href="/dashboard/new-order"
                                            className="text-primary text-xs font-semibold hover:underline"
                                        >
                                            Commander →
                                        </Link>
                                    </div>
                                </FuturisticCard>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {rest.slice(2).map((s) => (
                        <div key={s.name} data-reveal data-tilt style={{ transformStyle: "preserve-3d" }}>
                            <FuturisticCard className="p-6 flex flex-col min-h-48 h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <s.Icon
                                            className="w-8 h-8 shrink-0 mt-0.5"
                                            style={{ color: s.iconColor }}
                                            stroke={1.5}
                                        />
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                                {s.network}
                                            </p>
                                            <h3 className="font-bold">{s.name}</h3>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-medium shrink-0 ml-2">
                                        {s.badge}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                                    {s.desc}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-black text-primary tabular-nums">
                                            {s.price.toLocaleString("fr-FR")}
                                            <span className="text-sm font-semibold ml-1">
                                                FCFA
                                            </span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            pour {s.unit}
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard/new-order"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm shadow-primary/20 hover:bg-primary/90 hover:shadow-md hover:shadow-primary/30 transition-all"
                                    >
                                        Commander
                                        <IconArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </FuturisticCard>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/dashboard/new-order">
                            Voir tous les services
                            <IconArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
