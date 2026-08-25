"use client";

import { SectionTitle, SectionBorder, GeoRing, GeoCircle } from "@/components/ui/futuristic";
import { WHY_US } from "@/data/landing";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function WhyUsSection() {
    const sectionRef = useScrollReveal<HTMLElement>();

    return (
        <section
            ref={sectionRef}
            id="pourquoi"
            className="relative overflow-hidden py-24 bg-muted/20"
        >
            <GeoRing className="-top-16 -right-16 opacity-50" size={220} />
            <GeoCircle className="-bottom-20 -left-20 opacity-20" size={240} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="Fiabilité, vitesse et qualité — tout ce dont vous avez besoin pour grandir en ligne.">
                    Pourquoi choisir{" "}
                    <span className="text-primary">Maxi Views ?</span>
                </SectionTitle>

                <div className="border-y border-white/10 divide-y divide-white/10">
                    {WHY_US.map((item, i) => (
                        <div
                            key={item.title}
                            data-reveal
                            className="group flex items-center gap-5 sm:gap-10 py-8"
                        >
                            <span className="font-display text-5xl sm:text-6xl font-black text-white/10 group-hover:text-primary/30 transition-colors duration-300 shrink-0 w-14 sm:w-20 tabular-nums">
                                {String(i + 1).padStart(2, "0")}
                            </span>
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                <item.Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg sm:text-xl mb-1">
                                    {item.title}
                                </h3>
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {item.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
