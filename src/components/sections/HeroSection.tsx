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
    { src: "/hero1.jpg", x: -130, y: 40, rotate: -14 },
    { src: "/hero2.jpg", x: 0, y: -50, rotate: 0 },
    { src: "/hero3.jpg", x: 130, y: 40, rotate: 14 },
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

            // ── Realistic card deck: unfolds as you scroll ──
            if (window.innerWidth >= 1024) {
                const cards = gsap.utils.toArray<HTMLElement>(
                    "[data-hero-card]",
                    cardsWrapRef.current,
                );
                if (cards.length) {
                    gsap.set(cards, {
                        x: 0,
                        y: 0,
                        rotation: (i) => (i - 1) * 5,
                    });

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            end: "+=700",
                            scrub: 0.6,
                            pin: true,
                        },
                    });

                    cards.forEach((card, i) => {
                        const { x, y, rotate } = CARDS[i];
                        tl.to(
                            card,
                            { x, y, rotation: rotate, ease: "power2.out" },
                            0,
                        );
                    });
                }
            }
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* ── Left: content ── */}
                <div className="text-left">
                    <div
                        data-hero-fade
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium"
                    >
                        <IconBolt className="w-4 h-4" />
                        Plateforme SMM N°1 en Afrique
                    </div>

                    <h1
                        ref={titleRef}
                        className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6"
                        style={{ visibility: "hidden" }}
                    >
                        Boostez votre <span className="text-primary">présence</span>{" "}
                        sur les réseaux
                    </h1>

                    <p
                        data-hero-fade
                        className="text-muted-foreground text-lg sm:text-xl max-w-lg mb-10 leading-relaxed"
                    >
                        Achetez des vues, likes, followers et plus — pour
                        TikTok, Instagram, YouTube, Facebook et bien
                        d&apos;autres.
                    </p>

                    <div
                        data-hero-fade
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12"
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
                <div className="relative hidden lg:flex items-center justify-center h-[520px]">
                    <GeoCircle className="top-0 right-0 opacity-20" size={340} />
                    <GeoRing className="bottom-6 left-2 opacity-40" size={200} />

                    <div
                        ref={cardsWrapRef}
                        className="relative w-56 h-72"
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
                                    sizes="224px"
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Floating stat chips */}
                    <div className="absolute top-6 left-0 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl px-5 py-4 flex items-center gap-3 z-10">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                            <IconTrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-lg font-black tabular-nums leading-none">
                                50K+
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Commandes livrées
                            </p>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-0 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl px-5 py-4 flex items-center gap-3 z-10">
                        <div className="flex text-lime">
                            <IconStarFilled className="w-4 h-4" />
                            <IconStarFilled className="w-4 h-4" />
                            <IconStarFilled className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-lg font-black leading-none">
                                4.9/5
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
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
