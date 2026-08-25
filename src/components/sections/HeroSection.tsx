import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    SectionBorder,
    GeoCircle,
    GeoRing,
    GeoSquare,
} from "@/components/ui/futuristic";
import { IconBolt, IconCircleCheck, IconArrowRight, IconTrendingUp, IconStarFilled } from "@tabler/icons-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                {/* ── Left: content ── */}
                <div className="text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                        <IconBolt className="w-4 h-4" />
                        Plateforme SMM N°1 en Afrique
                    </div>

                    <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[0.95] mb-6">
                        Boostez votre{" "}
                        <span className="text-primary">présence</span> sur les
                        réseaux
                    </h1>

                    <p className="text-muted-foreground text-lg sm:text-xl max-w-lg mb-10 leading-relaxed">
                        Achetez des vues, likes, followers et plus — pour
                        TikTok, Instagram, YouTube, Facebook et bien
                        d&apos;autres.
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-12">
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

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
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

                {/* ── Right: bold geometric composition ── */}
                <div className="relative hidden lg:flex items-center justify-center h-[520px]">
                    <GeoCircle className="top-0 right-0 opacity-90" size={380} />
                    <GeoRing className="bottom-6 left-2 opacity-70" size={220} />
                    <GeoSquare className="top-[38%] left-0 rotate-12 opacity-80 rounded-lg" size={56} />
                    <GeoSquare className="bottom-16 right-10 rotate-45 opacity-60 rounded-md" size={32} />

                    {/* Floating stat chip 1 */}
                    <div className="absolute top-10 left-2 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl px-5 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                            <IconTrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-lg font-black tabular-nums leading-none">
                                50K+
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Commandes livrées
                            </p>
                        </div>
                    </div>

                    {/* Floating stat chip 2 */}
                    <div className="absolute bottom-10 right-4 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl px-5 py-4 flex items-center gap-3">
                        <div className="flex text-amber-400">
                            <IconStarFilled className="w-4 h-4" />
                            <IconStarFilled className="w-4 h-4" />
                            <IconStarFilled className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-lg font-black leading-none">
                                4.9/5
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Satisfaction client
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom section border */}
            <div className="absolute bottom-0 left-0 right-0">
                <SectionBorder />
            </div>
        </section>
    );
}
