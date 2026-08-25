import Link from "next/link";
import { IconEyeShare, IconCircleCheck } from "@tabler/icons-react";
import { SectionBorder } from "@/components/ui/futuristic";
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
        <footer className="pt-2">
            <SectionBorder />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                                <IconEyeShare className="w-4 h-4 text-primary-foreground" />
                            </div>
                            <span className="font-display text-xl font-bold">
                                Maxi<span className="text-primary"> Views</span>
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                            La plateforme SMM de référence pour booster votre
                            présence sur les réseaux sociaux.
                        </p>

                        {/* Social icons */}
                        <div className="flex gap-3 mt-4">
                            {FOOTER_SOCIAL_ICONS.map(({ Icon, color }) => (
                                <div
                                    key={color}
                                    className="w-8 h-8 rounded-lg bg-muted hover:bg-accent transition-colors flex items-center justify-center cursor-pointer"
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
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 rounded-full bg-primary" />
                            <h4 className="font-semibold text-sm">Services</h4>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {FOOTER_SERVICES.map((n) => (
                                <li
                                    key={n}
                                    className="flex items-center gap-2 group/link"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/link:bg-primary transition-colors" />
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
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-4 rounded-full bg-primary" />
                            <h4 className="font-semibold text-sm">
                                Liens utiles
                            </h4>
                        </div>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {FOOTER_LINKS.map((l) => (
                                <li
                                    key={l.label}
                                    className="flex items-center gap-2 group/link"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/link:bg-primary transition-colors" />
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

                {/* Bottom row */}
                <SectionBorder />
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Maxi Views. Tous droits
                        réservés.
                    </p>
                    <div className="flex items-center gap-2">
                        <span>Paiement sécurisé par</span>
                        <span className="font-semibold text-foreground">
                            FeexPay
                        </span>
                        <IconCircleCheck className="w-3.5 h-3.5 text-success" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
