import Link from "next/link";
import { Zap, CheckCircle2 } from "lucide-react";
import { FOOTER_SOCIAL_ICONS, FOOTER_LINKS } from "@/data/landing";

const FOOTER_SERVICES = [
    "TikTok",
    "Instagram",
    "YouTube",
    "Facebook",
    "Telegram",
];

export default function Footer() {
    return (
        <footer className="border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                                <Zap className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-display text-xl font-bold">
                                Maxi<span className="text-primary"> Views</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            La plateforme SMM de référence pour booster votre
                            présence sur les réseaux sociaux.
                        </p>
                        <div className="flex gap-3 mt-4">
                            {FOOTER_SOCIAL_ICONS.map(({ Icon, color }) => (
                                <div
                                    key={color}
                                    className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                                >
                                    <Icon
                                        className="w-4 h-4"
                                        style={{ color }}
                                        stroke={1.5}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">Services</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {FOOTER_SERVICES.map((n) => (
                                <li key={n}>
                                    <Link
                                        href="/dashboard/new-order"
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {n}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Liens utiles */}
                    <div>
                        <h4 className="font-semibold text-sm mb-4">
                            Liens utiles
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {FOOTER_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link
                                        href={l.href}
                                        className="hover:text-foreground transition-colors"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Maxi Views. Tous droits
                        réservés.
                    </p>
                    <div className="flex items-center gap-2">
                        <span>Paiement sécurisé par</span>
                        <span className="font-semibold text-foreground">
                            FeexPay
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
