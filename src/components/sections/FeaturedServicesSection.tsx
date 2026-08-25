"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle, SectionBorder } from "@/components/ui/futuristic";
import { IconArrowRight } from "@tabler/icons-react";
import { FEATURED_SERVICES } from "@/data/landing";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const priceRef = useRef<HTMLParagraphElement>(null);
    const [active, setActive] = useState(0);
    const current = FEATURED_SERVICES[active];
    const priceProxy = useRef({ value: current.price });

    useGSAP(
        () => {
            gsap.from("[data-svc-entrance]", {
                autoAlpha: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.08,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    once: true,
                },
            });
        },
        { scope: sectionRef },
    );

    useGSAP(
        () => {
            if (!stageRef.current) return;
            gsap.fromTo(
                stageRef.current,
                { autoAlpha: 0, x: 24 },
                { autoAlpha: 1, x: 0, duration: 0.4, ease: "power3.out" },
            );

            gsap.to(priceProxy.current, {
                value: current.price,
                duration: 0.6,
                ease: "power2.out",
                onUpdate: () => {
                    if (priceRef.current) {
                        priceRef.current.textContent = Math.round(
                            priceProxy.current.value,
                        ).toLocaleString("fr-FR");
                    }
                },
            });
        },
        { scope: sectionRef, dependencies: [active] },
    );

    // Keep proxy in sync on mount
    useEffect(() => {
        priceProxy.current.value = FEATURED_SERVICES[0].price;
    }, []);

    return (
        <section
            id="services"
            ref={sectionRef}
            className="relative overflow-hidden py-24 bg-muted/20"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-svc-entrance>
                    <SectionTitle subtitle="Les services les plus commandés par nos clients, à des prix imbattables.">
                        Services <span className="text-primary">populaires</span>
                    </SectionTitle>
                </div>

                <div
                    data-svc-entrance
                    className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6"
                >
                    {/* Thumbnail list */}
                    <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                        {FEATURED_SERVICES.map((s, i) => (
                            <button
                                key={s.name}
                                onClick={() => setActive(i)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left shrink-0 lg:shrink transition-all ${
                                    active === i
                                        ? "border-primary bg-primary/10"
                                        : "border-white/10 hover:border-white/25"
                                }`}
                            >
                                <s.Icon
                                    className="w-6 h-6 shrink-0"
                                    style={{ color: s.iconColor }}
                                    stroke={1.5}
                                />
                                <div className="min-w-0">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                                        {s.network}
                                    </p>
                                    <p
                                        className={`text-sm font-semibold truncate ${active === i ? "text-primary" : ""}`}
                                    >
                                        {s.name}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Stage */}
                    <div
                        ref={stageRef}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-card p-8 sm:p-12"
                    >
                        <span className="absolute top-6 right-6 sm:top-8 sm:right-8 text-xs bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                            {current.badge}
                        </span>

                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                            {current.network}
                        </p>
                        <h3 className="font-display text-3xl sm:text-4xl font-black mb-4">
                            {current.name}
                        </h3>
                        <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
                            {current.desc}
                        </p>

                        <div className="flex flex-wrap items-end justify-between gap-6">
                            <div>
                                <p className="font-display text-5xl sm:text-6xl font-black text-primary tabular-nums leading-none">
                                    <span ref={priceRef}>
                                        {current.price.toLocaleString("fr-FR")}
                                    </span>
                                    <span className="text-lg font-semibold ml-2 text-foreground">
                                        FCFA
                                    </span>
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    pour {current.unit}
                                </p>
                            </div>
                            <Link
                                href="/dashboard/new-order"
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
                            >
                                Commander
                                <IconArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div data-svc-entrance className="text-center mt-12">
                    <Link
                        href="/dashboard/new-order"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
                    >
                        Voir tous les services
                        <IconArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
