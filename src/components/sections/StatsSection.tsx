"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/data/landing";
import { FuturisticCard, SectionBorder, GeoSquare } from "@/components/ui/futuristic";

/* ─────────────────────────────────────────────────────────────────
   Hook: animates a number from 0 → target when element is visible
───────────────────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1800) {
    const [current, setCurrent] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = performance.now();

                    const tick = (now: number) => {
                        const elapsed = now - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // ease-out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCurrent(Math.round(eased * target));
                        if (progress < 1) requestAnimationFrame(tick);
                    };

                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.4 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target, duration]);

    return { ref, current };
}

/* ─────────────────────────────────────────────────────────────────
   Single stat card
───────────────────────────────────────────────────────────────── */
function StatCard({
    count,
    suffix,
    label,
}: {
    count: number;
    suffix: string;
    label: string;
    index: number;
}) {
    const { ref, current } = useCountUp(count, 1600);

    return (
        <FuturisticCard ref={ref} className="py-6 text-center">
            <p className="font-display text-4xl sm:text-5xl font-black text-primary tabular-nums">
                {current}
                <span>{suffix}</span>
            </p>
            <p className="text-muted-foreground text-sm mt-1">{label}</p>
        </FuturisticCard>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────────── */
export default function StatsSection() {
    return (
        <section className="relative overflow-hidden py-16">
            <GeoSquare className="top-4 left-[8%] rotate-45 opacity-30 rounded-md hidden md:block" size={40} />
            <GeoSquare className="bottom-2 right-[10%] rotate-12 opacity-20 rounded-lg hidden md:block" size={28} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map((s, i) => (
                        <StatCard
                            key={s.label}
                            count={s.count}
                            suffix={s.suffix}
                            label={s.label}
                            index={i}
                        />
                    ))}
                </div>
            </div>
            <SectionBorder className="mt-16" />
        </section>
    );
}
