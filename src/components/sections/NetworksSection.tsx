"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FuturisticCard, SectionTitle, SectionBorder, GeoCircle, GeoRing } from "@/components/ui/futuristic";
import { IconSparkles } from "@tabler/icons-react";
import { NETWORKS } from "@/data/landing";
import { useTiltCards } from "@/hooks/useTiltCards";

gsap.registerPlugin(ScrollTrigger);

export default function NetworksSection() {
    const sectionRef = useRef<HTMLElement>(null);
    useTiltCards(sectionRef);

    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(
                "[data-reveal]",
                sectionRef.current,
            );
            if (!cards.length) return;

            gsap.set(cards, { autoAlpha: 0, y: 50, scale: 0.88 });

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

    return (
        <section id="reseaux" ref={sectionRef} className="relative overflow-hidden py-24">
            <GeoCircle className="-top-20 -right-20 opacity-25" size={280} />
            <GeoRing className="-bottom-24 -left-24 opacity-40" size={260} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle subtitle="Gérez la croissance de tous vos profils depuis un seul tableau de bord.">
                    7 réseaux,{" "}
                    <span className="text-primary">1 seule plateforme</span>
                </SectionTitle>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 auto-rows-[180px]">
                    {NETWORKS.map((n, i) => (
                        <div
                            key={n.name}
                            data-reveal
                            data-tilt
                            style={{ transformStyle: "preserve-3d" }}
                            className={i === 0 ? "col-span-2 row-span-2" : ""}
                        >
                            <FuturisticCard className="relative p-6 overflow-hidden group h-full flex flex-col">
                                {/* Network gradient overlay on hover */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                                />
                                <n.Icon
                                    className={`mb-3 relative z-10 ${i === 0 ? "w-14 h-14" : "w-9 h-9"}`}
                                    style={{ color: n.iconColor }}
                                    stroke={1.5}
                                />
                                <h3 className={`font-bold mb-2 relative z-10 ${i === 0 ? "text-2xl" : "text-sm"}`}>
                                    {n.name}
                                </h3>
                                <ul className="space-y-1 relative z-10">
                                    {n.services.map((svc) => (
                                        <li
                                            key={svc}
                                            className={`text-muted-foreground flex items-center gap-1.5 ${i === 0 ? "text-sm" : "text-xs"}`}
                                        >
                                            <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                                            {svc}
                                        </li>
                                    ))}
                                </ul>
                                {i === 0 && (
                                    <span className="mt-auto pt-4 relative z-10 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold px-3 py-1">
                                        Le plus commandé
                                    </span>
                                )}
                            </FuturisticCard>
                        </div>
                    ))}

                    {/* "Et bien plus" card */}
                    <div data-reveal data-tilt style={{ transformStyle: "preserve-3d" }}>
                        <FuturisticCard className="p-6 flex flex-col items-center justify-center text-center bg-primary/5 h-full">
                            <IconSparkles className="w-9 h-9 mb-3 text-primary" />
                            <h3 className="font-bold text-sm mb-1">Et bien plus</h3>
                            <p className="text-xs text-muted-foreground">
                                Nouveaux réseaux à venir
                            </p>
                        </FuturisticCard>
                    </div>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
