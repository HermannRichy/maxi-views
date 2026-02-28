import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    FuturisticCard,
    SectionTitle,
    SectionBorder,
    CLIP_TR_SM,
} from "@/components/ui/futuristic";
import { ArrowRight } from "lucide-react";
import { FEATURED_SERVICES } from "@/data/landing";

export default function FeaturedServicesSection() {
    return (
        <section id="services" className="py-24 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle subtitle="Les services les plus commandés par nos clients, à des prix imbattables.">
                    Services <span className="text-primary">populaires</span>
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_SERVICES.map((s) => (
                        <FuturisticCard
                            key={s.name}
                            className="p-6 flex flex-col min-h-48"
                        >
                            {/* Badge */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-3">
                                    <s.Icon
                                        className="w-8 h-8 shrink-0 mt-0.5"
                                        style={{ color: s.iconColor }}
                                        stroke={1.5}
                                    />
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {s.network}
                                        </p>
                                        <h3 className="font-bold">{s.name}</h3>
                                    </div>
                                </div>
                                <span
                                    className="text-xs bg-primary/10 text-primary px-2 py-0.5 font-medium shrink-0 ml-2"
                                    style={{ clipPath: CLIP_TR_SM }}
                                >
                                    {s.badge}
                                </span>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 flex-1 leading-relaxed">
                                {s.desc}
                            </p>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-black text-primary tabular-nums">
                                        {s.price.toLocaleString("fr-FR")}
                                        <span className="text-sm font-semibold ml-1">
                                            FCFA
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        pour {s.unit}
                                    </p>
                                </div>
                                {/* Chamfered CTA */}
                                <Link
                                    href="/dashboard/new-order"
                                    className="group/btn relative"
                                >
                                    <div
                                        className="absolute inset-0 bg-primary/20 translate-x-[2px] translate-y-[2px]"
                                        style={{ clipPath: CLIP_TR_SM }}
                                    />
                                    <div
                                        className="relative px-3 py-1.5 bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1 group-hover/btn:bg-primary/90 transition-colors"
                                        style={{ clipPath: CLIP_TR_SM }}
                                    >
                                        Commander
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            </div>
                        </FuturisticCard>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/dashboard/new-order">
                            Voir tous les services
                            <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
