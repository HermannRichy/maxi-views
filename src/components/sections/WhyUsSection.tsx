import { Card } from "@/components/ui/card";
import { WHY_US } from "@/data/landing";

export default function WhyUsSection() {
    return (
        <section id="pourquoi" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Pourquoi choisir{" "}
                        <span className="text-primary">Maxi Views ?</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Fiabilité, vitesse et qualité — tout ce dont vous avez
                        besoin pour grandir en ligne.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {WHY_US.map((item) => (
                        <Card
                            key={item.title}
                            className="border-border hover:border-primary/40 bg-card hover:bg-accent transition-all duration-300 p-6 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                <item.Icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
