"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IconCookie } from "@tabler/icons-react";

const STORAGE_KEY = "mv_cookie_notice_dismissed";

export function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        try {
            if (!localStorage.getItem(STORAGE_KEY)) {
                setVisible(true);
            }
        } catch {
            setVisible(true);
        }
    }, []);

    const dismiss = () => {
        setVisible(false);
        try {
            localStorage.setItem(STORAGE_KEY, "1");
        } catch {
            // stockage indisponible (mode privé) — le bandeau réapparaîtra, sans gravité
        }
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6">
            <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-card shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                    <IconCookie className="w-4.5 h-4.5 text-primary" />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    Nous utilisons uniquement un cookie strictement nécessaire à
                    votre connexion (session). Aucun cookie publicitaire ou de
                    traçage tiers n&apos;est utilisé.{" "}
                    <Link
                        href="/privacy"
                        className="text-primary font-medium hover:underline"
                    >
                        En savoir plus
                    </Link>
                </p>

                <button
                    type="button"
                    onClick={dismiss}
                    className="w-full sm:w-auto shrink-0 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98]"
                >
                    J&apos;ai compris
                </button>
            </div>
        </div>
    );
}
