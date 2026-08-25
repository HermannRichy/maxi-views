import { SectionTitle, SectionBorder, GlowOrb } from "@/components/ui/futuristic";
import { HOW_IT_WORKS } from "@/data/landing";

export default function HowItWorksSection() {
    return (
        <section className="relative overflow-hidden py-24">
            <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" size={500} blur={100} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="En 4 étapes simples, votre présence en ligne décolle.">
                    Comment ça{" "}
                    <span className="text-primary">fonctionne ?</span>
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div
                            key={step.title}
                            className="relative flex flex-col items-center text-center"
                        >
                            {/* Connector line */}
                            {i < HOW_IT_WORKS.length - 1 && (
                                <div className="hidden lg:flex absolute top-8 left-1/2 w-full items-center gap-1 z-0">
                                    <div className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                                </div>
                            )}

                            {/* Step icon */}
                            <div className="relative z-10 mb-4">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                                    <step.Icon className="w-7 h-7" />
                                </div>
                                {/* Step number */}
                                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                            </div>

                            <h3 className="font-bold mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
