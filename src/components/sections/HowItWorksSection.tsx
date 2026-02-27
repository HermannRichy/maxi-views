import { HOW_IT_WORKS } from "@/data/landing";

export default function HowItWorksSection() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Comment ça{" "}
                        <span className="text-primary">fonctionne ?</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        En 4 étapes simples, votre présence en ligne décolle.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {HOW_IT_WORKS.map((step, i) => (
                        <div
                            key={step.title}
                            className="relative flex flex-col items-center text-center"
                        >
                            {i < HOW_IT_WORKS.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-px bg-gradient-to-r from-border to-transparent" />
                            )}
                            <div className="relative w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-2xl mb-4 z-10">
                                {step.icon}
                                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                                    {i + 1}
                                </span>
                            </div>
                            <h3 className="font-bold mb-2">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
