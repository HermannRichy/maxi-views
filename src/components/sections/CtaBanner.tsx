import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

export default function CtaBanner() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-primary/10 border border-primary/20 p-12 text-center">
                    <div className="absolute inset-0 -z-10">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[80px]" />
                    </div>
                    <Lock className="w-10 h-10 text-primary mx-auto mb-4" />
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Prêt à booster votre visibilité ?
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
                        Rejoignez des milliers de créateurs et entrepreneurs qui
                        font confiance à Maxi Views.
                    </p>
                    <Button
                        size="lg"
                        className="h-14 px-10 text-base shadow-lg shadow-primary/25"
                        asChild
                    >
                        <Link href="/sign-up">
                            Créer un compte gratuit
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </Button>
                    <p className="text-xs text-muted-foreground mt-4">
                        Inscription gratuite · Aucune carte requise · Mobile
                        Money accepté
                    </p>
                </div>
            </div>
        </section>
    );
}
