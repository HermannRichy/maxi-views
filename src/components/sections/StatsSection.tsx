import { STATS } from "@/data/landing";

export default function StatsSection() {
    return (
        <section className="py-16 border-y border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {STATS.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="font-display text-4xl sm:text-5xl font-black text-primary">
                                {s.value}
                            </p>
                            <p className="text-muted-foreground text-sm mt-1">
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
