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
    IconBrandGoogleFilled,
    IconMail,
    IconLock,
    IconFingerprint,
    IconLoader2,
    IconAlertCircle,
    IconEyeShare,
    IconRocket,
    IconEye,
    IconEyeOff,
    IconUser,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter();
    const wrapRef = useRef<HTMLDivElement>(null);
    const { data: session, isPending } = authClient.useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

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
        { scope: wrapRef, dependencies: [isPending, pendingVerification] },
    );

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await authClient.signUp.email({
            email,
            password,
            name: name.trim(),
        });

        if (error) {
            const message = error.message ?? "Erreur lors de l'inscription";
            setError(message);
            toast.error(message);
        } else {
            setPendingVerification(true);
            toast.info("Un code de vérification a été envoyé !");
        }
        setIsLoading(false);
    };

    const handleVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await authClient.emailOtp.verifyEmail({
            email,
            otp: code,
        });

        if (error) {
            const message = error.message ?? "Code invalide";
            setError(message);
            toast.error(message);
            setIsLoading(false);
            return;
        }

        // S'assure qu'une session est bien établie après vérification.
        const { error: signInError } = await authClient.signIn.email({
            email,
            password,
        });

        if (signInError) {
            toast.success("Compte créé ! Connectez-vous pour continuer.");
            window.location.assign("/sign-in");
            return;
        }

        toast.success("Compte créé avec succès !");
        window.location.assign("/dashboard/profile");
    };

    const handleGoogleSignUp = async () => {
        setIsSocialLoading(true);
        setError(null);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard/profile",
            });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erreur lors de l'inscription";
            setError(message);
            toast.error(message);
            setIsSocialLoading(false);
        }
    };

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (session && !pendingVerification) {
        router.push("/dashboard/profile");
        return null;
    }

    if (pendingVerification) {
        return (
            <div ref={wrapRef} className="min-h-screen relative flex items-center justify-center bg-background px-4 overflow-hidden">
                <GeoCircle className="-top-20 -right-20 opacity-20 -z-10" size={320} />
                <GeoRing className="-bottom-20 -left-20 opacity-30 -z-10" size={220} />
                <div data-auth-field className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 max-w-md w-full shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <IconFingerprint className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">
                            Vérifiez votre email
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Nous avons envoyé un code à{" "}
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

                    <form onSubmit={handleVerification} className="space-y-6">
                        <div className="space-y-2 text-center">
                            <Label
                                htmlFor="code"
                                className="text-xs font-bold uppercase tracking-widest text-muted-foreground"
                            >
                                Code à 6 chiffres
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="h-14 bg-white/5 border-white/10 rounded-xl text-center text-2xl font-bold tracking-[0.5em] focus:ring-primary/50 transition-all"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <IconLoader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Vérifier le compte"
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

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
                        Créez votre compte et boostez votre visibilité dès
                        aujourd&apos;hui.
                    </h2>
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10 px-5 py-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0">
                            <IconRocket className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-semibold">
                            Livraison instantanée après paiement
                        </span>
                    </div>
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
                        <div className="text-center mb-8 lg:hidden">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                                <IconEyeShare className="w-5 h-5 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Créer un compte
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Rejoignez l&apos;aventure en quelques secondes
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

                        <div className="mb-8">
                            <Button
                                onClick={handleGoogleSignUp}
                                disabled={isSocialLoading || isLoading}
                                variant="outline"
                                className="w-full border-white/10 hover:bg-white/5 h-12 rounded-xl text-base font-medium transition-all"
                            >
                                {isSocialLoading ? (
                                    <IconLoader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        <IconBrandGoogleFilled className="mr-2 h-5 w-5" />{" "}
                                        Continuer avec Google
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="relative mb-8 text-center">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10" />
                            </div>
                            <span className="relative bg-background px-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                                Ou par email
                            </span>
                        </div>

                        <form onSubmit={handleEmailSignUp} className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1"
                                >
                                    <IconUser className="w-3.5 h-3.5" /> Nom complet
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Jean Dupont"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all"
                                    required
                                    disabled={isLoading || isSocialLoading}
                                />
                            </div>
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
                                    disabled={isLoading || isSocialLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 px-1"
                                >
                                    <IconLock className="w-3.5 h-3.5" /> Mot de
                                    passe
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
                                        disabled={isLoading || isSocialLoading}
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
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-transform"
                                disabled={isLoading || isSocialLoading}
                            >
                                {isLoading ? (
                                    <IconLoader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "S'inscrire"
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-6 border-t border-white/10 text-center">
                            <p className="text-sm text-muted-foreground">
                                Déjà un compte ?{" "}
                                <Link
                                    href="/sign-in"
                                    className="text-primary font-bold hover:underline"
                                >
                                    Se connecter
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
