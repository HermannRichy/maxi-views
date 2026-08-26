"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NETWORKS } from "@/data/landing";
import { toast } from "sonner";
import { IconArrowLeft, IconLoader2, IconWallet } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/* Services par réseau (MVP simplifié) */
const SERVICES_CATALOG: Record<
    string,
    { name: string; unitPrice: number; minQty: number; step: number }[]
> = {
    TikTok: [
        { name: "Vues", unitPrice: 300, minQty: 10000, step: 10000 },
        { name: "Followers", unitPrice: 7500, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 500, minQty: 1000, step: 1000 },
    ],
    Instagram: [
        { name: "Followers", unitPrice: 7500, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 4000, minQty: 1000, step: 1000 },
        { name: "Vues", unitPrice: 500, minQty: 10000, step: 10000 },
    ],
    YouTube: [
        { name: "Vues", unitPrice: 500, minQty: 10000, step: 10000 },
        { name: "Abonnés", unitPrice: 9000, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 5000, minQty: 1000, step: 1000 },
    ],
    Facebook: [
        { name: "Likes page", unitPrice: 4000, minQty: 1000, step: 1000 },
        { name: "Followers", unitPrice: 6000, minQty: 1000, step: 1000 },
    ],
    Telegram: [
        { name: "Membres", unitPrice: 12500, minQty: 1000, step: 1000 },
        { name: "Vues", unitPrice: 500, minQty: 10000, step: 10000 },
    ],
    "X (Twitter)": [
        { name: "Followers", unitPrice: 9500, minQty: 1000, step: 1000 },
        { name: "Likes", unitPrice: 5000, minQty: 1000, step: 1000 },
    ],
    WhatsApp: [
        { name: "Membres canal", unitPrice: 10000, minQty: 1000, step: 1000 },
    ],
};

const STEPS = ["Réseau", "Service", "Détails"] as const;

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
    return (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                    <span
                        className={cn(
                            "flex items-center gap-1.5",
                            step > i + 1
                                ? "text-primary"
                                : step === i + 1
                                  ? "text-foreground font-semibold"
                                  : "",
                        )}
                    >
                        <span
                            className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                                step > i + 1
                                    ? "bg-primary text-primary-foreground"
                                    : step === i + 1
                                      ? "bg-foreground text-background"
                                      : "bg-muted text-muted-foreground",
                            )}
                        >
                            {i + 1}
                        </span>
                        {s}
                    </span>
                    {i < STEPS.length - 1 && (
                        <div className="w-6 h-px bg-border" />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function NewOrderPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<{
        name: string;
        unitPrice: number;
        minQty: number;
        step: number;
    } | null>(null);
    const [link, setLink] = useState("");
    const [quantity, setQuantity] = useState(0);
    const [loading, setLoading] = useState(false);

    const amount = selectedService
        ? Math.ceil(selectedService.unitPrice * (quantity / 1000))
        : 0;

    const handleSubmit = async () => {
        if (
            !selectedNetwork ||
            !selectedService ||
            !link ||
            quantity < selectedService.minQty
        ) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    network: selectedNetwork,
                    serviceName: selectedService.name,
                    link,
                    quantity,
                    amount,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                if (res.status === 402) {
                    setTimeout(() => router.push("/dashboard/wallet"), 1500);
                }
                return;
            }
            toast.success("Commande passée avec succès !");
            router.push("/dashboard/orders");
        } catch {
            toast.error("Erreur lors de la commande");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h1 className="text-2xl font-bold">Nouvelle commande</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Sélectionnez un réseau, un service et configurez votre
                    commande
                </p>
            </div>

            <StepIndicator step={step} />

            {/* Step 1: Network */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Choisissez un réseau</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {NETWORKS.map((n) => (
                                <button
                                    key={n.name}
                                    type="button"
                                    onClick={() => {
                                        setSelectedNetwork(n.name);
                                        setSelectedService(null);
                                        setStep(2);
                                    }}
                                    className="flex items-center gap-3 p-3 rounded-xl border border-white/10 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-colors text-left"
                                >
                                    <n.Icon
                                        className="w-6 h-6 shrink-0"
                                        style={{ color: n.iconColor }}
                                        stroke={1.5}
                                    />
                                    <span className="text-sm font-medium">
                                        {n.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Service */}
            {step === 2 && selectedNetwork && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStep(1)}
                                className="h-7 px-2 -ml-2"
                            >
                                <IconArrowLeft data-icon="inline-start" />
                                Retour
                            </Button>
                        </div>
                        <CardTitle>Service pour {selectedNetwork}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {(SERVICES_CATALOG[selectedNetwork] ?? []).map((s) => (
                            <button
                                key={s.name}
                                type="button"
                                onClick={() => {
                                    setSelectedService(s);
                                    setQuantity(s.minQty);
                                    setStep(3);
                                }}
                                className="w-full flex items-center justify-between p-3 rounded-xl border border-white/10 hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-colors text-left"
                            >
                                <span className="text-sm font-medium">
                                    {s.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    ≈{" "}
                                    {Math.ceil(
                                        s.unitPrice * (s.minQty / 1000),
                                    ).toLocaleString("fr-FR")}{" "}
                                    FCFA / {s.minQty.toLocaleString("fr-FR")}
                                </span>
                            </button>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Order details */}
            {step === 3 && selectedService && selectedNetwork && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setStep(2)}
                                className="h-7 px-2 -ml-2"
                            >
                                <IconArrowLeft data-icon="inline-start" />
                                Retour
                            </Button>
                        </div>
                        <CardTitle>
                            {selectedNetwork} — {selectedService.name}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Link */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="link"
                                className="text-xs text-muted-foreground uppercase tracking-widest"
                            >
                                URL / Lien du compte ou du post
                            </Label>
                            <Input
                                id="link"
                                type="url"
                                placeholder="https://tiktok.com/@moncompte"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                required
                            />
                        </div>

                        {/* Quantity */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="quantity"
                                className="text-xs text-muted-foreground uppercase tracking-widest"
                            >
                                Quantité (min.{" "}
                                {selectedService.minQty.toLocaleString("fr-FR")}
                                )
                            </Label>
                            <Input
                                id="quantity"
                                type="number"
                                min={selectedService.minQty}
                                step={selectedService.step}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                            />
                        </div>

                        {/* Price summary */}
                        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Coût total
                                </span>
                                <span className="font-black text-primary tabular-nums text-lg">
                                    {amount.toLocaleString("fr-FR")} FCFA
                                </span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                <span>
                                    pour {quantity.toLocaleString("fr-FR")}{" "}
                                    {selectedService.name.toLowerCase()}
                                </span>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                loading ||
                                !link ||
                                quantity < selectedService.minQty
                            }
                            className="w-full"
                        >
                            {loading ? (
                                <IconLoader2
                                    data-icon="inline-start"
                                    className="animate-spin"
                                />
                            ) : (
                                <IconWallet data-icon="inline-start" />
                            )}
                            {loading
                                ? "Traitement..."
                                : `Commander — ${amount.toLocaleString("fr-FR")} FCFA`}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
