"use client";

import Image from "next/image";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function AttractSection() {
    const sectionRef = useScrollReveal<HTMLElement>();

    return (
        <section ref={sectionRef} className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div
                    data-reveal
                    className="relative rounded-3xl overflow-hidden border border-white/10 min-h-[420px] sm:min-h-[480px]"
                >
                    <Image
                        src="/attract-views.jpg"
                        alt="Aimant attirant likes et vues"
                        fill
                        sizes="100vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

                    <div className="relative z-10 h-full min-h-[420px] sm:min-h-[480px] flex flex-col justify-end p-8 sm:p-14">
                        <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
                            Effet magnétique
                        </p>
                        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black max-w-2xl leading-[0.95] mb-4">
                            Attirez likes, vues et abonnés{" "}
                            <span className="text-primary">comme un aimant</span>
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Chaque commande est pensée pour maximiser votre
                            visibilité et transformer votre audience en
                            communauté engagée.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
