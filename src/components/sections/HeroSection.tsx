"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Button } from "@/components/ui/button";
import {
    SectionBorder,
    GeoCircle,
    GeoRing,
} from "@/components/ui/futuristic";
import {
    IconBolt,
    IconCircleCheck,
    IconArrowRight,
    IconTrendingUp,
    IconStarFilled,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CARDS = [
    { src: "/hero1.jpg", x: -110, y: 30, rotate: -14 },
    { src: "/hero2.jpg", x: 0, y: -40, rotate: 0 },
    { src: "/hero3.jpg", x: 110, y: 30, rotate: 14 },
];

export default function HeroSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const cardsWrapRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!titleRef.current) return;

            gsap.set(titleRef.current, { autoAlpha: 1 });
            gsap.set("[data-hero-fade]", { autoAlpha: 0, y: 24 });

            const split = SplitText.create(titleRef.current, {
                type: "lines",
                mask: "lines",
            });

            gsap
                .timeline({ defaults: { ease: "power4.out" } })
                .from(split.lines, {
                    yPercent: 115,
                    duration: 1,
                    stagger: 0.12,
                })
                .to(
                    "[data-hero-fade]",
                    { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
                    "-=0.55",
                );

            // ── Realistic card deck: unfolds as you scroll (all breakpoints) ──
            const cards = gsap.utils.toArray<HTMLElement>(
                "[data-hero-card]",
                cardsWrapRef.current,
            );
            if (cards.length) {
                const w = window.innerWidth;
                const scale = w < 640 ? 0.5 : w < 1024 ? 0.75 : 1;
                const pinDistance = w < 1024 ? 450 : 700;

                gsap.set(cards, {
                    x: 0,
                    y: 0,
                    rotation: (i) => (i - 1) * 5,
                });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "+=" + pinDistance,
                        scrub: 0.6,
                        pin: true,
                    },
                });

                cards.forEach((card, i) => {
                    const { x, y, rotate } = CARDS[i];
                    tl.to(
                        card,
                        {
                            x: x * scale,
                            y: y * scale,
                            rotation: rotate,
                            ease: "power2.out",
                        },
                        0,
                    );
                });
            }
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                {/* ── Left: content ── */}
                <div className="text-left">
                    <div
                        data-hero-fade
                        className="inline-flex items-center gap-2 px-4 py-2 mb-6 sm:mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                    >
                        <IconBolt className="w-4 h-4" />
                        Plateforme SMM N°1 en Afrique
                    </div>

                    <h1
                        ref={titleRef}
                        className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] mb-6 pb-1"
                        style={{ visibility: "hidden" }}
                    >
                        Boostez votre <span className="text-primary">présence</span>{" "}
                        sur les réseaux
                    </h1>

                    <p
                        data-hero-fade
                        className="text-muted-foreground text-base sm:text-lg lg:text-xl max-w-lg mb-8 sm:mb-10 leading-relaxed"
                    >
                        Achetez des vues, likes, followers et plus — pour
                        TikTok, Instagram, YouTube, Facebook et bien
                        d&apos;autres.
                    </p>

                    <div
                        data-hero-fade
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-10 sm:mb-12"
                    >
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
                        >
                            Commencer maintenant
                            <IconArrowRight className="w-5 h-5" />
                        </Link>

                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-8 text-base"
                            asChild
                        >
                            <a href="#services">Voir les services</a>
                        </Button>
                    </div>

                    <div
                        data-hero-fade
                        className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground"
                    >
                        {[
                            "Sans mot de passe",
                            "Livraison instantanée",
                            "Paiement Mobile Money",
                            "Support 24/7",
                        ].map((label) => (
                            <span key={label} className="flex items-center gap-2">
                                <IconCircleCheck className="w-4 h-4 text-success" />
                                {label}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ── Right: bold geometric + realistic card deck ── */}
                <div className="relative flex items-center justify-center h-[300px] sm:h-[400px] lg:h-[520px]">
                    <GeoCircle className="top-0 right-0 opacity-20" size={220} />
                    <GeoRing className="bottom-2 left-0 opacity-40" size={140} />

                    <div
                        ref={cardsWrapRef}
                        className="relative w-32 h-44 sm:w-44 sm:h-60 lg:w-56 lg:h-72"
                        style={{ perspective: 1000 }}
                    >
                        {CARDS.map((c, i) => (
                            <div
                                key={c.src}
                                data-hero-card
                                className="absolute inset-0 rounded-2xl border border-white/10 bg-card shadow-2xl overflow-hidden"
                                style={{ zIndex: i === 1 ? 3 : i }}
                            >
                                <Image
                                    src={c.src}
                                    alt=""
                                    fill
                                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 176px, 224px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Floating stat chips */}
                    <div className="absolute top-2 left-0 sm:top-6 rounded-xl sm:rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl px-2.5 py-2 sm:px-5 sm:py-4 flex items-center gap-2 sm:gap-3 z-10">
                        <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                            <IconTrendingUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-lg font-black tabular-nums leading-none">
                                50K+
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                                Commandes livrées
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-1 right-0 sm:bottom-4 rounded-xl sm:rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl px-2.5 py-2 sm:px-5 sm:py-4 flex items-center gap-2 sm:gap-3 z-10">
                        <div className="flex text-lime">
                            <IconStarFilled className="w-3 h-3 sm:w-4 sm:h-4" />
                            <IconStarFilled className="w-3 h-3 sm:w-4 sm:h-4" />
                            <IconStarFilled className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div>
                            <p className="text-xs sm:text-lg font-black leading-none">
                                4.9/5
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                                Satisfaction client
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0">
                <SectionBorder />
            </div>
        </section>
    );
}
