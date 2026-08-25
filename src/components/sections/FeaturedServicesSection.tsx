"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FuturisticCard, SectionTitle, SectionBorder, GeoCircle } from "@/components/ui/futuristic";
import { IconArrowRight } from "@tabler/icons-react";
import { FEATURED_SERVICES } from "@/data/landing";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useTiltCards } from "@/hooks/useTiltCards";

export default function FeaturedServicesSection() {
    const sectionRef = useScrollReveal<HTMLElement>();
    useTiltCards(sectionRef, 5);

    return (
        <section id="services" ref={sectionRef} className="relative overflow-hidden py-24 bg-muted/20">
            <GeoCircle className="-bottom-20 -right-20 opacity-20 -z-10" size={300} />
            <GeoCircle className="-top-16 -left-16 opacity-15 -z-10" size={220} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="Les services les plus commandés par nos clients, à des prix imbattables.">
                    Services <span className="text-primary">populaires</span>
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_SERVICES.map((s) => (
                        <div key={s.name} data-reveal data-tilt style={{ transformStyle: "preserve-3d" }}>
                            <FuturisticCard className="p-6 flex flex-col min-h-48 h-full">
                                {/* Badge */}
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
