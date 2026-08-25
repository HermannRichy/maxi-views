"use client";

import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GeoCircle, GeoRing } from "@/components/ui/futuristic";
import {
    IconLock,
    IconLoader2,
    IconAlertCircle,
    IconEyeShare,
    IconCircleCheck,
    IconEye,
    IconEyeOff,
} from "@tabler/icons-react";
import { toast } from "sonner";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") ?? "";
    const wrapRef = useRef<HTMLDivElement>(null);

    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        { scope: wrapRef, dependencies: [success] },
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            return;
        }

        setIsLoading(true);

        const { error } = await authClient.emailOtp.resetPassword({
            email,
            otp,
            password,
        });

        setIsLoading(false);

        if (error) {
            const message = error.message ?? "Code invalide ou expiré";
            setError(message);
            toast.error(message);
            return;
        }

        setSuccess(true);
        toast.success("Mot de passe réinitialisé !");
        setTimeout(() => window.location.assign("/sign-in"), 2000);
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
                        Presque terminé. Choisissez un nouveau mot de passe.
                    </h2>
                </div>

                <p data-auth-field className="relative z-10 text-xs text-muted-foreground">
                    © {new Date().getFullYear()} Maxi Views. Tous droits réservés.
                </p>
            </div>

            {/* ── Right: form ── */}
            <div className="relative flex items-center justify-center overflow-hidden bg-background py-12 px-4">
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/15 rounded-full blur-3xl -z-10" />

                <div className="w-full max-w-md mx-auto">
                    <div data-auth-field className="bg-white/5 backdrop-blur-xl backdrop-saturate-150 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
                        {success ? (
                            <div className="text-center py-6">
                                <div className="w-16 h-16 bg-success/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <IconCircleCheck className="w-8 h-8 text-success" />
                                </div>
                                <h2 className="text-2xl font-bold mb-2">
                                    Mot de passe réinitialisé !
                                </h2>
                                <p className="text-muted-foreground text-sm">
                                    Redirection vers la connexion...
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-8">
                                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                        Réinitialiser
                                    </h1>
                                    <p className="text-muted-foreground text-sm">
                                        Code envoyé à{" "}
                                        <span className="text-primary font-medium">
                                            {email}
                                        </span>
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
                                    <div className="space-y-2 text-center">
                                        <Label
                                            htmlFor="otp"
                                            className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                                        >
                                            Code à 6 chiffres
                                        </Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="000000"
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="h-14 bg-white/5 border-white/10 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:ring-primary/50 transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1"
                                        >
                                            <IconLock className="w-3.5 h-3.5" />{" "}
                                            Nouveau mot de passe
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all pr-11"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                tabIndex={-1}
                                                aria-label={
                                                    showPassword
                                                        ? "Masquer le mot de passe"
                                                        : "Afficher le mot de passe"
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? (
                                                    <IconEyeOff className="w-4.5 h-4.5" />
                                                ) : (
                                                    <IconEye className="w-4.5 h-4.5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="confirmPassword"
                                            className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1"
                                        >
                                            <IconLock className="w-3.5 h-3.5" />{" "}
                                            Confirmer le mot de passe
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={
                                                    showConfirmPassword ? "text" : "password"
                                                }
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(e.target.value)
                                                }
                                                className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all pr-11"
                                                required
                                                minLength={8}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowConfirmPassword((v) => !v)
                                                }
                                                tabIndex={-1}
                                                aria-label={
                                                    showConfirmPassword
                                                        ? "Masquer le mot de passe"
                                                        : "Afficher le mot de passe"
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <IconEyeOff className="w-4.5 h-4.5" />
                                                ) : (
                                                    <IconEye className="w-4.5 h-4.5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-transform"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <IconLoader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            "Réinitialiser le mot de passe"
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                    <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}
