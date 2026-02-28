import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    CLIP_TR_SM,
    CornerBracket,
    SectionBorder,
} from "@/components/ui/futuristic";
import { Zap, CheckCircle2, ArrowRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background glows */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />
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
                <div className="inline-flex items-center gap-2 mb-8 relative">
                    {/* Chamfered badge */}
                    <div
                        className="px-4 py-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2"
                        style={{ clipPath: CLIP_TR_SM }}
                    >
                        <Zap className="w-4 h-4" />
                        Plateforme SMM N°1 en Afrique
                    </div>
                    <CornerBracket
                        size={7}
                        className="absolute -bottom-1 -left-1 text-primary/40"
                        rotate={270}
                    />
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
                    {/* Primary CTA — chamfered */}
                    <Link href="/sign-up" className="group relative">
                        <div
                            className="absolute inset-0 bg-primary/20 translate-x-[3px] translate-y-[3px]"
                            style={{ clipPath: CLIP_TR_SM }}
                        />
                        <div
                            className="relative px-8 h-14 bg-primary text-primary-foreground text-base font-semibold flex items-center gap-2 shadow-lg shadow-primary/25 group-hover:bg-primary/90 transition-colors"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            Commencer maintenant
                            <ArrowRight className="w-5 h-5" />
                        </div>
                        {/* Corner accent */}
                        <svg
                            className="absolute top-0 right-0 text-primary-foreground/40"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                        >
                            <path
                                d="M 10 0 L 0 10 L 10 10 Z"
                                fill="currentColor"
                            />
                        </svg>
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
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
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
