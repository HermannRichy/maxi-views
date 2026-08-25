import { FuturisticCard, SectionTitle, SectionBorder } from "@/components/ui/futuristic";
import { IconStarFilled } from "@tabler/icons-react";
import { TESTIMONIALS } from "@/data/landing";

export default function TestimonialsSection() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle>
                    Ce que disent{" "}
                    <span className="text-primary">nos clients</span>
                </SectionTitle>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <FuturisticCard key={t.name} className="p-6 relative">
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-primary" />

                            <div className="flex mb-4">
                                {Array.from({ length: t.stars }).map((_, i) => (
                                    <IconStarFilled
                                        key={i}
                                        className="w-4 h-4 text-amber-400"
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-muted-foreground mb-6 italic leading-relaxed">
                                &ldquo;{t.text}&rdquo;
                            </p>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
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
                        </FuturisticCard>
                    ))}
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
