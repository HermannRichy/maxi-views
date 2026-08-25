import { Marquee } from "@/components/ui/marquee";
import { NETWORKS } from "@/data/landing";

export default function MarqueeStrip() {
    return (
        <div className="border-y border-white/10 bg-card py-4">
            <Marquee duration={28}>
                {NETWORKS.map((n) => (
                    <span
                        key={n.name}
                        className="flex items-center gap-3 px-8 font-display text-2xl sm:text-3xl uppercase text-muted-foreground/40"
                    >
                        <n.Icon
                            className="w-6 h-6 shrink-0"
                            style={{ color: n.iconColor }}
                            stroke={1.5}
                        />
                        {n.name}
                        <span className="text-primary">✦</span>
                    </span>
                ))}
            </Marquee>
        </div>
    );
}
