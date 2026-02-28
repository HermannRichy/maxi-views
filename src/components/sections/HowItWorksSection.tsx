import {
    SectionTitle,
    SectionBorder,
    CLIP_DUAL_SM,
} from "@/components/ui/futuristic";
import { HOW_IT_WORKS } from "@/data/landing";

export default function HowItWorksSection() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                    <div className="flex-1 h-px bg-border/60" />
                                    <div className="w-1 h-1 bg-primary/40 rotate-45" />
                                </div>
                            )}

                            {/* Step icon — chamfered box */}
                            <div className="relative z-10 mb-4">
                                <div
                                    className="w-16 h-16 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
                                    style={{ clipPath: CLIP_DUAL_SM }}
                                >
                                    <step.Icon className="w-7 h-7" />
                                </div>
                                {/* Step number — chamfered dot */}
                                <div
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold"
                                    style={{ clipPath: CLIP_DUAL_SM }}
                                >
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
