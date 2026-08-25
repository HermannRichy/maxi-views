"use client";

import { SectionTitle, SectionBorder, GeoRing } from "@/components/ui/futuristic";
import { HOW_IT_WORKS } from "@/data/landing";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function HowItWorksSection() {
    const sectionRef = useScrollReveal<HTMLElement>();

    return (
        <section ref={sectionRef} className="relative overflow-hidden py-24">
            <GeoRing className="-top-16 right-[15%] opacity-40 -z-10" size={200} />
            <GeoRing className="-bottom-16 left-[10%] opacity-30 -z-10" size={160} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="En 4 étapes simples, votre présence en ligne décolle.">
                    Comment ça{" "}
                    <span className="text-primary">fonctionne ?</span>
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div
                            key={step.title}
                            data-reveal
                            className="relative flex flex-col items-center text-center"
                        >
                            {/* Connector line */}
                            {i < HOW_IT_WORKS.length - 1 && (
                                <div className="hidden lg:flex absolute top-8 left-1/2 w-full items-center gap-1 z-0">
                                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                </div>
                            )}

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
