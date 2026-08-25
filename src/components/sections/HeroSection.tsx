import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionBorder, GlowOrb, RingOutline } from "@/components/ui/futuristic";
import { IconBolt, IconCircleCheck, IconArrowRight } from "@tabler/icons-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background glows */}
            <div className="absolute inset-0 -z-10">
                <GlowOrb
                    className="top-1/4 left-1/2 -translate-x-1/2"
                    size={800}
                    blur={120}
                />
                <GlowOrb className="top-1/3 left-1/4" size={400} blur={80} />
                <GlowOrb className="bottom-1/4 right-1/4" size={300} blur={80} />
                <RingOutline className="top-1/3 right-[15%]" size={220} />
                {/* Grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                    <IconBolt className="w-4 h-4" />
                    Plateforme SMM N°1 en Afrique
                </div>

                {/* Title */}
                <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
                    Boostez votre <span className="text-primary">présence</span>
                    <br />
                    sur les réseaux
                </h1>

                <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    Achetez des vues, likes, followers et plus — pour TikTok,
                    Instagram, YouTube, Facebook et bien d&apos;autres.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center gap-2 h-14 px-8 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 transition-all"
                    >
                        Commencer maintenant
                        <IconArrowRight className="w-5 h-5" />
                    </Link>

                    <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 text-base"
                        asChild
                    >
                        <a href="#services">Voir les services</a>
                    </Button>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    {[
                        "Sans mot de passe",
                        "Livraison instantanée",
                        "Paiement Mobile Money",
                        "Support 24/7",
                    ].map((label) => (
                        <span key={label} className="flex items-center gap-2">
                            <IconCircleCheck className="w-4 h-4 text-success" />
                            {label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Bottom section border */}
            <div className="absolute bottom-0 left-0 right-0">
                <SectionBorder />
            </div>
        </section>
    );
}
