import Link from "next/link";
import { GlowOrb } from "@/components/ui/futuristic";
import { IconLock, IconArrowRight } from "@tabler/icons-react";

export default function CtaBanner() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl border border-white/10 bg-primary/5 p-12 text-center overflow-hidden">
                    {/* Glow */}
                    <div className="absolute inset-0 -z-10">
                        <GlowOrb
                            className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            size={600}
                            blur={80}
                        />
                    </div>

                    <div className="w-14 h-14 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6">
                        <IconLock className="w-6 h-6" />
                    </div>

                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Prêt à booster votre visibilité ?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                        Rejoignez des milliers de créateurs et entrepreneurs
                        qui font confiance à Maxi Views.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground text-base font-semibold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:shadow-xl transition-all"
                        >
                            Créer un compte gratuit
                            <IconArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    <p className="text-xs text-muted-foreground mt-5">
                        Inscription gratuite · Aucune carte requise · Mobile
                        Money accepté
                    </p>
                </div>
            </div>
        </section>
    );
}
