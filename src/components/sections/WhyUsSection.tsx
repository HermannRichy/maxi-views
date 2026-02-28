import {
    FuturisticCard,
    SectionTitle,
    SectionBorder,
} from "@/components/ui/futuristic";
import { WHY_US } from "@/data/landing";

export default function WhyUsSection() {
    return (
        <section id="pourquoi" className="py-24 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle subtitle="Fiabilité, vitesse et qualité — tout ce dont vous avez besoin pour grandir en ligne.">
                    Pourquoi choisir{" "}
                    <span className="text-primary">Maxi Views ?</span>
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {WHY_US.map((item) => (
                        <FuturisticCard key={item.title} className="p-6">
                            {/* Icon box — chamfered */}
                            <div
                                className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors"
                                style={{
                                    clipPath:
                                        "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)",
                                }}
                            >
                                <item.Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            </div>
                            <h3 className="font-bold mb-2">{item.title}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {item.desc}
                            </p>
                        </FuturisticCard>
                    ))}
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
