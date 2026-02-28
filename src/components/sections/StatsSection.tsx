"use client";

import { useEffect, useRef, useState } from "react";
import { STATS } from "@/data/landing";
import {
    CLIP_DUAL_SM,
    CornerBracket,
    SectionBorder,
} from "@/components/ui/futuristic";

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
    index,
}: {
    count: number;
    suffix: string;
    label: string;
    index: number;
}) {
    const { ref, current } = useCountUp(count, 1600 + index * 200);

    return (
        <div ref={ref} className="relative group">
            {/* Border layer */}
            <div
                className="absolute inset-0 bg-border/40 group-hover:bg-primary/20 transition-colors duration-300"
                style={{ clipPath: CLIP_DUAL_SM }}
            />
            {/* Content layer */}
            <div
                className="relative bg-card group-hover:bg-accent/50 transition-colors duration-300 m-[1px] py-6 text-center"
                style={{ clipPath: CLIP_DUAL_SM }}
            >
                <p className="font-display text-4xl sm:text-5xl font-black text-primary tabular-nums">
                    {current}
                    <span>{suffix}</span>
                </p>
                <p className="text-muted-foreground text-sm mt-1">{label}</p>
            </div>

            {/* Corner brackets — alternate corners by index */}
            <CornerBracket
                size={8}
                className="absolute top-1 left-1 text-primary/30 group-hover:text-primary/60 transition-colors"
                rotate={index % 2 === 0 ? 0 : 90}
            />
            <CornerBracket
                size={8}
                className="absolute bottom-1 right-1 text-primary/30 group-hover:text-primary/60 transition-colors"
                rotate={index % 2 === 0 ? 180 : 270}
            />
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Section
───────────────────────────────────────────────────────────────── */
export default function StatsSection() {
    return (
        <section className="py-16">
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
