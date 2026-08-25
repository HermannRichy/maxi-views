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
    IconLoader2,
    IconAlertCircle,
    IconEyeShare,
    IconStarFilled,
} from "@tabler/icons-react";
import { toast } from "sonner";

export default function LoginPage() {
    const router = useRouter();
    const wrapRef = useRef<HTMLDivElement>(null);
    const { data: session, isPending } = authClient.useSession();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSocialLoading, setIsSocialLoading] = useState(false);
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
        { scope: wrapRef, dependencies: [isPending] },
    );

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await authClient.signIn.email({ email, password });

        if (error) {
            const message = error.message ?? "Erreur lors de la connexion";
            setError(message);
            toast.error(message);
            setIsLoading(false);
        } else {
            toast.success("Bon retour !");
            window.location.assign("/dashboard");
        }
    };

    const handleGoogleSignIn = async () => {
        setIsSocialLoading(true);
        setError(null);

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/dashboard",
            });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Erreur lors de la connexion";
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

    if (session) {
        router.push("/dashboard");
        return null;
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
                        Rejoignez des milliers de créateurs qui font
                        confiance à Maxi Views.
                    </h2>
                    <div className="inline-flex items-center gap-3 rounded-2xl bg-background/60 backdrop-blur-xl border border-white/10 px-5 py-4">
                        <div className="flex text-lime">
                            <IconStarFilled className="w-4 h-4" />
                            <IconStarFilled className="w-4 h-4" />
                            <IconStarFilled className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold">
                            4.9/5 — Satisfaction client
                        </span>
                    </div>
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
                        <div className="text-center mb-8 lg:hidden">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
                                <IconEyeShare className="w-5 h-5 text-primary-foreground" />
                            </div>
                        </div>
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Connexion
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                Accédez à votre espace sécurisé
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
                                onClick={handleGoogleSignIn}
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

                        <form onSubmit={handleEmailSignIn} className="space-y-5">
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
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all placeholder:text-muted-foreground/30"
                                    required
                                    disabled={isLoading || isSocialLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between px-1">
                                    <Label
                                        htmlFor="password"
                                        className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2"
                                    >
                                        <IconLock className="w-3.5 h-3.5" /> Mot de
                                        passe
                                    </Label>
                                    <Link
                                        href="/forgot-password"
                                        title="Oublié ?"
                                        className="text-[10px] font-bold text-primary/70 hover:text-primary transition-colors uppercase tracking-widest"
                                    >
                                        Oublié ?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all"
                                    required
                                    disabled={isLoading || isSocialLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 mt-4 active:scale-[0.98] transition-transform"
                                disabled={isLoading || isSocialLoading}
                            >
                                {isLoading ? (
                                    <IconLoader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    "Se connecter"
                                )}
                            </Button>
                        </form>

                        <div className="mt-10 pt-6 border-t border-white/10 text-center">
                            <p className="text-sm text-muted-foreground">
                                Nouveau ici ?{" "}
                                <Link
                                    href="/sign-up"
                                    className="text-primary font-bold hover:underline"
                                >
                                    Créer un compte
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div data-auth-field className="mt-8 text-center">
                        <Link
                            href="/"
                            className="text-xs text-muted-foreground/50 hover:text-foreground transition-colors font-medium"
                        >
                            ← Retour à l&apos;accueil
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
