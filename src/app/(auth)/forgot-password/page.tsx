"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GeoCircle, GeoRing } from "@/components/ui/futuristic";
import {
    IconMail,
    IconLoader2,
    IconAlertCircle,
    IconEyeShare,
    IconKey,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const wrapRef = useRef<HTMLDivElement>(null);

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useGSAP(
        () => {
            gsap.set("[data-auth-field]", { autoAlpha: 0, y: 20 });
            gsap.to("[data-auth-field]", {
                autoAlpha: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.07,
                ease: "power3.out",
                delay: 0.1,
            });
        },
        { scope: wrapRef },
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await authClient.emailOtp.sendVerificationOtp({
            email,
            type: "forget-password",
        });

        setIsLoading(false);

        if (error) {
            const message = error.message ?? "Erreur lors de l'envoi du code";
            setError(message);
            toast.error(message);
            return;
        }

        toast.success("Un code de réinitialisation a été envoyé !");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    };

    return (
        <div ref={wrapRef} className="min-h-screen grid lg:grid-cols-2">
            {/* ── Left: brand panel ── */}
            <div className="hidden lg:flex relative flex-col justify-between p-12 overflow-hidden bg-card border-r border-white/10">
                <GeoCircle className="-top-32 -right-32 opacity-25" size={380} />
                <GeoRing className="-bottom-20 -left-20 opacity-40" size={260} />

                <Link href="/" data-auth-field className="relative z-10 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                        <IconEyeShare className="w-4.5 h-4.5 text-primary-foreground" />
                    </div>
                    <span className="font-display text-xl font-bold tracking-tight">
                        Maxi<span className="text-primary"> Views</span>
                    </span>
                </Link>

                <div data-auth-field className="relative z-10">
                    <h2 className="font-display text-4xl xl:text-5xl font-black leading-[1.05] mb-6 max-w-md">
                        Pas de panique, ça arrive à tout le monde.
                    </h2>
                </div>

                <p data-auth-field className="relative z-10 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Maxi Views. Tous droits réservés.
                </p>
            </div>

            {/* ── Right: form ── */}
            <div className="relative flex items-center justify-center overflow-hidden bg-background py-12 px-4">
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10" />

                <div className="w-full max-w-md mx-auto">
                    <div data-auth-field className="bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <IconKey className="w-7 h-7 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Mot de passe oublié
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Entrez votre email pour recevoir un code de
                                réinitialisation
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-start gap-3">
                                <IconAlertCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                                <p className="text-sm text-destructive font-medium">
                                    {error}
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1"
                                >
                                    <IconMail className="w-3.5 h-3.5" /> Adresse
                                    email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-transform"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <IconLoader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Envoyer le code"
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-6 border-t border-white/10 text-center">
                            <p className="text-sm text-muted-foreground">
                                <Link
                                    href="/sign-in"
                                    className="text-primary font-bold hover:underline"
                                >
                                    ← Retour à la connexion
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
