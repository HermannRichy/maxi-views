import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/data/landing";

export default function TestimonialsSection() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Ce que disent{" "}
                        <span className="text-primary">nos clients</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <Card
                            key={t.name}
                            className="border-border bg-card p-6 relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
                            <div className="flex mb-4">
                                {Array.from({ length: t.stars }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400 text-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mb-6 italic">
                                &ldquo;{t.text}&rdquo;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">
                                        {t.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t.role} · {t.network}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
