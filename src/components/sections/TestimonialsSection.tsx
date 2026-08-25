"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FuturisticCard, SectionTitle, SectionBorder } from "@/components/ui/futuristic";
import { IconStarFilled } from "@tabler/icons-react";
import { TESTIMONIALS } from "@/data/landing";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackWrapRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            // Entrance reveal — runs on every breakpoint
            const cards = gsap.utils.toArray<HTMLElement>(
                "[data-testi-card]",
                trackRef.current,
            );
            if (cards.length) {
                gsap.set(cards, { autoAlpha: 0, y: 40 });
                ScrollTrigger.batch(cards, {
                    start: "top 90%",
                    once: true,
                    onEnter: (batch) =>
                        gsap.to(batch, {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.6,
                            stagger: 0.1,
                            ease: "power3.out",
                            overwrite: true,
                        }),
                });
            }

            // Pinned horizontal scroll — desktop only, mobile keeps native swipe
            if (window.innerWidth < 1024) return;
            const getDist = () =>
                trackRef.current!.scrollWidth -
                trackWrapRef.current!.clientWidth;

            const dist = getDist();
            if (dist <= 0) return;

            gsap.to(trackRef.current, {
                x: () => -getDist(),
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: () => "+=" + getDist(),
                    scrub: true,
                    pin: true,
                    invalidateOnRefresh: true,
                },
            });
        },
        { scope: sectionRef },
    );

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden py-24 min-h-screen flex flex-col justify-center"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <SectionTitle>
                    Ce que disent{" "}
                    <span className="text-primary">nos clients</span>
                </SectionTitle>
            </div>

            <div
                ref={trackWrapRef}
                className="overflow-x-auto lg:overflow-hidden snap-x snap-mandatory lg:snap-none no-scrollbar"
            >
                <div
                    ref={trackRef}
                    className="flex gap-6 px-4 sm:px-6 lg:px-8 w-max"
                >
                    {TESTIMONIALS.map((t) => (
                        <div
                            key={t.name}
                            data-testi-card
                            className="w-[85vw] sm:w-96 shrink-0 snap-center"
                        >
                        <FuturisticCard className="relative p-6 h-full overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />

                            <div className="flex mb-4">
                                {Array.from({ length: t.stars }).map((_, i) => (
                                    <IconStarFilled
                                        key={i}
                                        className="w-4 h-4 text-lime"
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 italic leading-relaxed">
                                &ldquo;{t.text}&rdquo;
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.role} · {t.network}
                                    </p>
                                </div>
                            </div>
                        </FuturisticCard>
                        </div>
                    ))}

                    <div data-testi-card className="flex flex-col items-center justify-center gap-3 w-[85vw] sm:w-72 shrink-0 rounded-2xl border-2 border-dashed border-white/15 text-center px-6 snap-center">
                        <p className="font-display text-2xl font-black">
                            Rejoignez-les
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Des milliers de créateurs nous font déjà confiance.
                        </p>
                    </div>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
