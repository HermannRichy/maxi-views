import {
    FuturisticCard,
    SectionTitle,
    SectionBorder,
    CLIP_TR_SM,
} from "@/components/ui/futuristic";
import { Zap } from "lucide-react";
import { NETWORKS } from "@/data/landing";

export default function NetworksSection() {
    return (
        <section id="reseaux" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle subtitle="Gérez la croissance de tous vos profils depuis un seul tableau de bord.">
                    7 réseaux,{" "}
                    <span className="text-primary">1 seule plateforme</span>
                </SectionTitle>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {NETWORKS.map((n) => (
                        <FuturisticCard key={n.name} className="p-6">
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
                                        <div className="w-1 h-1 bg-primary rotate-45 shrink-0" />
                                        {svc}
                                    </li>
                                ))}
                            </ul>
                        </FuturisticCard>
                    ))}

                    {/* "Et bien plus" card */}
                    <div className="relative group cursor-pointer">
                        <div
                            className="absolute inset-0 bg-primary/20 group-hover:bg-primary/30 transition-colors"
                            style={{ clipPath: CLIP_TR_SM }}
                        />
                        <div
                            className="relative bg-primary/5 group-hover:bg-primary/10 transition-colors m-[1px] p-6 flex flex-col items-center justify-center text-center"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <Zap className="w-9 h-9 mb-3 text-primary" />
                            <h3 className="font-bold text-sm mb-1">
                                Et bien plus
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Nouveaux réseaux à venir
                            </p>
                        </div>
                        <svg
                            className="absolute top-0 right-0 text-primary/40"
                            width="10"
                            height="10"
                            viewBox="0 0 10 10"
                            fill="none"
                        >
                            <path
                                d="M 10 0 L 0 10 L 10 10 Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
