import { FuturisticCard, SectionTitle, SectionBorder, Doodle, RingOutline } from "@/components/ui/futuristic";
import { IconSparkles } from "@tabler/icons-react";
import { NETWORKS } from "@/data/landing";

export default function NetworksSection() {
    return (
        <section id="reseaux" className="relative overflow-hidden py-24">
            <Doodle className="absolute top-6 right-8 hidden md:block" />
            <RingOutline className="-bottom-24 -left-24" size={260} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle subtitle="Gérez la croissance de tous vos profils depuis un seul tableau de bord.">
                    7 réseaux,{" "}
                    <span className="text-primary">1 seule plateforme</span>
                </SectionTitle>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {NETWORKS.map((n) => (
                        <FuturisticCard key={n.name} className="relative p-6 overflow-hidden group">
                            {/* Network gradient overlay on hover */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                            />
                            <n.Icon
                                className="w-9 h-9 mb-3 relative z-10"
                                style={{ color: n.iconColor }}
                                stroke={1.5}
                            />
                            <h3 className="font-bold text-sm mb-2 relative z-10">
                                {n.name}
                            </h3>
                            <ul className="space-y-1 relative z-10">
                                {n.services.map((svc) => (
                                    <li
                                        key={svc}
                                        className="text-xs text-muted-foreground flex items-center gap-1.5"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-primary shrink-0" />
                                        {svc}
                                    </li>
                                ))}
                            </ul>
                        </FuturisticCard>
                    ))}

                    {/* "Et bien plus" card */}
                    <FuturisticCard className="p-6 flex flex-col items-center justify-center text-center bg-primary/5">
                        <IconSparkles className="w-9 h-9 mb-3 text-primary" />
                        <h3 className="font-bold text-sm mb-1">Et bien plus</h3>
                        <p className="text-xs text-muted-foreground">
                            Nouveaux réseaux à venir
                        </p>
                    </FuturisticCard>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
