import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FEATURED_SERVICES } from "@/data/landing";

export default function FeaturedServicesSection() {
    return (
        <section id="services" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Services{" "}
                        <span className="text-primary">populaires</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Les services les plus commandés par nos clients, à des
                        prix imbattables.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURED_SERVICES.map((s) => (
                        <Card
                            key={s.name}
                            className="group relative overflow-hidden border-border hover:border-primary/40 bg-card hover:bg-accent transition-all duration-300 p-6 flex flex-col"
                        >
                            <span className="absolute top-4 right-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                                {s.badge}
                            </span>

                            <div className="flex items-start gap-4 mb-4">
                                <s.Icon
                                    className="w-8 h-8 shrink-0"
                                    style={{ color: s.iconColor }}
                                    stroke={1.5}
                                />
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                                        {s.network}
                                    </p>
                                    <h3 className="font-bold">{s.name}</h3>
                                </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 flex-1">
                                {s.desc}
                            </p>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-black text-primary">
                                        ${s.price}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        par {s.unit}
                                    </p>
                                </div>
                                <Button size="sm" asChild>
                                    <Link href="/dashboard/new-order">
                                        Commander
                                        <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </Card>
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
        </section>
    );
}
