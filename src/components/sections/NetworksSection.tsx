"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionTitle, SectionBorder } from "@/components/ui/futuristic";
import { IconArrowRight, IconCircleCheck } from "@tabler/icons-react";
import { NETWORKS } from "@/data/landing";

gsap.registerPlugin(ScrollTrigger);

export default function NetworksSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const current = NETWORKS[active];

    useGSAP(
        () => {
            gsap.set(sectionRef.current, {});
            gsap.from("[data-net-entrance]", {
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
                { autoAlpha: 0, y: 16, scale: 0.98 },
                { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out" },
            );
            gsap.fromTo(
                "[data-net-icon]",
                { scale: 0.4, rotate: -20, autoAlpha: 0 },
                { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.55, ease: "back.out(2.2)" },
            );
        },
        { scope: sectionRef, dependencies: [active] },
    );

    return (
        <section
            id="reseaux"
            ref={sectionRef}
            className="relative overflow-hidden py-24"
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div data-net-entrance>
                    <SectionTitle subtitle="Gérez la croissance de tous vos profils depuis un seul tableau de bord.">
                        7 réseaux,{" "}
                        <span className="text-primary">1 seule plateforme</span>
                    </SectionTitle>
                </div>

                {/* Tab selector */}
                <div
                    data-net-entrance
                    className="flex flex-wrap justify-center gap-2 mb-10"
                >
                    {NETWORKS.map((n, i) => (
                        <button
                            key={n.name}
                            onClick={() => setActive(i)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold transition-all ${
                                active === i
                                    ? "border-primary bg-primary/10 text-primary scale-105"
                                    : "border-white/10 text-muted-foreground hover:border-white/25 hover:text-foreground"
                            }`}
                        >
                            <n.Icon
                                className="w-4 h-4"
                                style={{ color: active === i ? n.iconColor : undefined }}
                                stroke={1.5}
                            />
                            {n.name}
                        </button>
                    ))}
                </div>

                {/* Stage */}
                <div data-net-entrance className="relative">
                    <div
                        ref={stageRef}
                        className="relative overflow-hidden rounded-3xl border border-white/10 p-8 sm:p-12"
                    >
                        <div
                            className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-[0.08]`}
                        />
                        <div
                            className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-20 blur-3xl"
                            style={{ backgroundColor: current.iconColor }}
                        />

                        <div className="relative grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
                            <div
                                data-net-icon
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center shrink-0 mx-auto md:mx-0"
                                style={{
                                    backgroundColor: `${current.iconColor}1A`,
                                    border: `1px solid ${current.iconColor}33`,
                                }}
                            >
                                <current.Icon
                                    className="w-12 h-12 sm:w-14 sm:h-14"
                                    style={{ color: current.iconColor }}
                                    stroke={1.4}
                                />
                            </div>

                            <div className="text-center md:text-left">
                                <h3 className="font-display text-3xl sm:text-4xl font-black mb-4">
                                    {current.name}
                                </h3>
                                <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-6">
                                    {current.services.map((svc) => (
                                        <li
                                            key={svc}
                                            className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground"
                                        >
                                            <IconCircleCheck
                                                className="w-4 h-4 shrink-0"
                                                style={{ color: current.iconColor }}
                                            />
                                            {svc}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    href="/dashboard/new-order"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    Commander sur {current.name}
                                    <IconArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Progress dots */}
                    <div className="flex justify-center gap-1.5 mt-6">
                        {NETWORKS.map((n, i) => (
                            <button
                                key={n.name}
                                aria-label={`Voir ${n.name}`}
                                onClick={() => setActive(i)}
                                className={`h-1.5 rounded-full transition-all ${
                                    active === i
                                        ? "w-6 bg-primary"
                                        : "w-1.5 bg-white/15 hover:bg-white/30"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
