import Link from "next/link";
import { GeoCircle, GeoRing } from "@/components/ui/futuristic";
import { IconArrowLeft, IconGhost3 } from "@tabler/icons-react";

export default function NotFound() {
    return (
        <main className="relative min-h-screen flex items-center justify-center bg-background text-foreground overflow-hidden px-4">
            <GeoCircle className="top-1/4 -right-32 opacity-10 -z-10" size={420} />
            <GeoRing className="bottom-10 -left-24 opacity-20 -z-10" size={280} />
            <div
                className="fixed inset-0 -z-10 opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />

            <div className="text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconGhost3 className="w-8 h-8 text-primary" />
                </div>

                <p className="font-display text-7xl sm:text-8xl font-black leading-none bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                    404
                </p>
                <h1 className="text-xl font-bold mb-2">Page introuvable</h1>
                <p className="text-muted-foreground text-sm mb-8">
                    La page que vous cherchez n&apos;existe pas ou a été déplacée.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                    <IconArrowLeft className="w-4 h-4" />
                    Retour à l&apos;accueil
                </Link>
            </div>
        </main>
    );
}
