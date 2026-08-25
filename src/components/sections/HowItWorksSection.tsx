"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle, SectionBorder, GeoRing } from "@/components/ui/futuristic";
import { HOW_IT_WORKS } from "@/data/landing";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const steps = gsap.utils.toArray<HTMLElement>(
                "[data-step]",
                sectionRef.current,
            );
            if (!steps.length) return;

            gsap.set(steps, { autoAlpha: 0, y: 40, scale: 0.85 });

            ScrollTrigger.batch(steps, {
                start: "top 85%",
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: "back.out(1.6)",
                        overwrite: true,
                    }),
            });

            // Progress line draws in as the section scrolls into view
            if (lineRef.current) {
                gsap.fromTo(
                    lineRef.current,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: "none",
                        transformOrigin: "left center",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 70%",
                            end: "bottom 60%",
                            scrub: 0.5,
                        },
                    },
                );
            }
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-24">
            <GeoRing className="-top-16 right-[15%] opacity-40 -z-10" size={200} />
            <GeoRing className="-bottom-16 left-[10%] opacity-30 -z-10" size={160} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="En 4 étapes simples, votre présence en ligne décolle.">
                    Comment ça{" "}
                    <span className="text-primary">fonctionne ?</span>
                </SectionTitle>

                <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Full-width progress line (desktop) */}
                    <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-white/10">
                        <div
                            ref={lineRef}
                            className="h-full bg-primary"
                            style={{ transform: "scaleX(0)" }}
                        />
                    </div>

                    {HOW_IT_WORKS.map((step, i) => (
                        <div
                            key={step.title}
                            data-step
                            className="relative flex flex-col items-center text-center"
                        >
                            {/* Step icon */}
                            <div className="relative z-10 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <step.Icon className="w-7 h-7" />
                                </div>
                                {/* Step number */}
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                            </div>

                            <h3 className="font-bold mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
