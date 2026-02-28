import Link from "next/link";
import {
    CornerBracket,
    CLIP_TR_LG,
    CLIP_TR_SM,
} from "@/components/ui/futuristic";
import { Lock, ArrowRight } from "lucide-react";

export default function CtaBanner() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Outer border layer */}
                <div className="relative group">
                    <div
                        className="absolute inset-0 bg-primary/20"
                        style={{ clipPath: CLIP_TR_LG }}
                    />
                    {/* Glow */}
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px]" />
                    </div>

                    {/* Content */}
                    <div
                        className="relative bg-primary/5 m-[1px] p-12 text-center"
                        style={{ clipPath: CLIP_TR_LG }}
                    >
                        {/* Corner decorations inside the card */}
                        <CornerBracket
                            size={16}
                            thickness={1.5}
                            className="absolute top-3 left-3 text-primary/30"
                            rotate={0}
                        />
                        <CornerBracket
                            size={16}
                            thickness={1.5}
                            className="absolute top-3 right-3 text-primary/30"
                            rotate={90}
                        />
                        <CornerBracket
                            size={16}
                            thickness={1.5}
                            className="absolute bottom-3 left-3 text-primary/30"
                            rotate={270}
                        />
                        <CornerBracket
                            size={16}
                            thickness={1.5}
                            className="absolute bottom-3 right-3 text-primary/30"
                            rotate={180}
                        />

                        <div
                            className="w-14 h-14 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            <Lock className="w-6 h-6" />
                        </div>

                        <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                            Prêt à booster votre visibilité ?
                        </h2>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                            Rejoignez des milliers de créateurs et entrepreneurs
                            qui font confiance à Maxi Views.
                        </p>

                        {/* Chamfered CTA */}
                        <div className="flex justify-center">
                            <Link
                                href="/sign-up"
                                className="group/btn relative inline-block"
                            >
                                <div
                                    className="absolute inset-0 bg-primary/30 translate-x-[4px] translate-y-[4px]"
                                    style={{ clipPath: CLIP_TR_SM }}
                                />
                                <div
                                    className="relative px-10 py-4 bg-primary text-primary-foreground text-base font-semibold flex items-center gap-2 shadow-lg shadow-primary/30 group-hover/btn:bg-primary/90 transition-colors"
                                    style={{ clipPath: CLIP_TR_SM }}
                                >
                                    Créer un compte gratuit
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                                <svg
                                    className="absolute top-0 right-0 text-primary-foreground/40"
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
                            </Link>
                        </div>

                        <p className="text-xs text-muted-foreground mt-5">
                            Inscription gratuite · Aucune carte requise · Mobile
                            Money accepté
                        </p>
                    </div>

                    {/* Chamfer accent triangle (top-right of outer container) */}
                    <svg
                        className="absolute top-0 right-0 text-primary/50"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                    >
                        <path d="M 20 0 L 0 20 L 20 20 Z" fill="currentColor" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
