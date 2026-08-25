"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { GeoCircle } from "@/components/ui/futuristic";
import { IconLock, IconArrowRight } from "@tabler/icons-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function CtaBanner() {
    const sectionRef = useScrollReveal<HTMLElement>();
    const ringRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!ringRef.current) return;
            gsap.to(ringRef.current, {
                rotation: 360,
                duration: 40,
                repeat: -1,
                ease: "none",
            });
        },
        { scope: sectionRef },
    );

    return (
        <section ref={sectionRef} className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    data-reveal
                    className="relative rounded-3xl border border-white/10 bg-card p-12 text-center overflow-hidden"
                >
                    {/* Bold geometric corner shapes */}
                    <GeoCircle className="-top-24 -right-24 opacity-90" size={320} />
                    <div
                        ref={ringRef}
                        className="absolute -bottom-16 -left-16 w-[220px] h-[220px] rounded-full border-[3px] border-primary opacity-60 pointer-events-none"
                    />

                    <div className="relative w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6">
                        <IconLock className="w-6 h-6" />
                    </div>

                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Prêt à booster votre visibilité ?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                        Rejoignez des milliers de créateurs et entrepreneurs
                        qui font confiance à Maxi Views.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl transition-all"
                        >
                            Créer un compte gratuit
                            <IconArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground mt-5">
                        Inscription gratuite · Aucune carte requise · Mobile
                        Money accepté
                    </p>
                </div>
            </div>
        </section>
    );
}
