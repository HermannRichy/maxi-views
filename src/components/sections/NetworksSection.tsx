import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { NETWORKS } from "@/data/landing";

export default function NetworksSection() {
    return (
        <section id="reseaux" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        7 réseaux,{" "}
                        <span className="text-primary">1 seule plateforme</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Gérez la croissance de tous vos profils depuis un seul
                        tableau de bord.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {NETWORKS.map((n) => (
                        <Card
                            key={n.name}
                            className="group relative overflow-hidden border-border hover:border-primary/40 bg-card hover:bg-accent transition-all duration-300 hover:scale-105 cursor-pointer p-6"
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${n.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                            />
                            <n.Icon
                                className="w-9 h-9 mb-3"
                                style={{ color: n.iconColor }}
                                stroke={1.5}
                            />
                            <h3 className="font-bold text-sm mb-2">{n.name}</h3>
                            <ul className="space-y-1">
                                {n.services.map((svc) => (
                                    <li
                                        key={svc}
                                        className="text-xs text-muted-foreground flex items-center gap-1"
                                    >
                                        <div className="w-1 h-1 rounded-full bg-primary" />
                                        {svc}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    ))}

                    {/* Carte "Et bien plus" */}
                    <Card className="border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 hover:scale-105 cursor-pointer p-6 flex flex-col items-center justify-center text-center">
                        <Zap className="w-9 h-9 mb-3 text-primary" />
                        <h3 className="font-bold text-sm mb-1">Et bien plus</h3>
                        <p className="text-xs text-muted-foreground">
                            Nouveaux réseaux à venir
                        </p>
                    </Card>
                </div>
            </div>
        </section>
    );
}
