"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FuturisticCard, CLIP_TR_SM } from "@/components/ui/futuristic";
import { NETWORKS } from "@/data/landing";
import { toast } from "sonner";
import { ArrowRight, RefreshCw, Wallet } from "lucide-react";

/* Services par réseau (MVP simplifié) */
const SERVICES_CATALOG: Record<
    string,
    { name: string; unitPrice: number; minQty: number; step: number }[]
> = {
    TikTok: [
        { name: "Vues", unitPrice: 0.3, minQty: 10000, step: 10000 },
        { name: "Followers", unitPrice: 7.5, minQty: 1000, step: 500 },
        { name: "Likes", unitPrice: 0.5, minQty: 1000, step: 500 },
    ],
    Instagram: [
        { name: "Followers", unitPrice: 7.5, minQty: 1000, step: 500 },
        { name: "Likes", unitPrice: 4, minQty: 1000, step: 500 },
        { name: "Vues", unitPrice: 0.5, minQty: 10000, step: 10000 },
    ],
    YouTube: [
        { name: "Vues", unitPrice: 0.5, minQty: 10000, step: 10000 },
        { name: "Abonnés", unitPrice: 9, minQty: 500, step: 500 },
        { name: "Likes", unitPrice: 5, minQty: 500, step: 500 },
    ],
    Facebook: [
        { name: "Likes page", unitPrice: 4, minQty: 1000, step: 500 },
        { name: "Followers", unitPrice: 6, minQty: 1000, step: 500 },
    ],
    Telegram: [
        { name: "Membres", unitPrice: 12.5, minQty: 1000, step: 500 },
        { name: "Vues", unitPrice: 0.5, minQty: 10000, step: 10000 },
    ],
    "X (Twitter)": [
        { name: "Followers", unitPrice: 9.5, minQty: 1000, step: 500 },
        { name: "Likes", unitPrice: 5, minQty: 1000, step: 500 },
    ],
    WhatsApp: [
        { name: "Membres canal", unitPrice: 10, minQty: 500, step: 500 },
    ],
};

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

            {/* Step indicator */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                {(["Réseau", "Service", "Détails"] as const).map((s, i) => (
                    <span
                        key={s}
                        className={`flex items-center gap-1 ${step > i + 1 ? "text-primary" : step === i + 1 ? "text-foreground font-semibold" : ""}`}
                    >
                        <span
                            className={`w-5 h-5 flex items-center justify-center text-[10px] font-bold ${step > i + 1 ? "bg-primary text-primary-foreground" : step === i + 1 ? "bg-foreground text-background" : "bg-muted text-muted-foreground"}`}
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            {i + 1}
                        </span>
                        {s}
                        {i < 2 && <ArrowRight className="w-3 h-3 ml-1" />}
                    </span>
                ))}
            </div>

            {/* Step 1: Network */}
            {step === 1 && (
                <FuturisticCard className="p-5">
                    <h2 className="font-bold mb-4">Choisissez un réseau</h2>
                    <div className="grid grid-cols-2 gap-3">
                        {NETWORKS.map((n) => (
                            <button
                                key={n.name}
                                onClick={() => {
                                    setSelectedNetwork(n.name);
                                    setSelectedService(null);
                                    setStep(2);
                                }}
                                className="flex items-center gap-3 p-3 border border-border hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-colors text-left"
                                style={{ clipPath: CLIP_TR_SM }}
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
                </FuturisticCard>
            )}

            {/* Step 2: Service */}
            {step === 2 && selectedNetwork && (
                <FuturisticCard className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => setStep(1)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Retour
                        </button>
                        <h2 className="font-bold">
                            Service pour {selectedNetwork}
                        </h2>
                    </div>
                    <div className="space-y-2">
                        {(SERVICES_CATALOG[selectedNetwork] ?? []).map((s) => (
                            <button
                                key={s.name}
                                onClick={() => {
                                    setSelectedService(s);
                                    setQuantity(s.minQty);
                                    setStep(3);
                                }}
                                className="w-full flex items-center justify-between p-3 border border-border hover:border-primary/50 bg-muted/20 hover:bg-primary/5 transition-colors text-left"
                                style={{ clipPath: CLIP_TR_SM }}
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
                    </div>
                </FuturisticCard>
            )}

            {/* Step 3: Order details */}
            {step === 3 && selectedService && selectedNetwork && (
                <FuturisticCard className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <button
                            onClick={() => setStep(2)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Retour
                        </button>
                        <h2 className="font-bold">
                            {selectedNetwork} — {selectedService.name}
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {/* Link */}
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                                URL / Lien du compte ou du post
                            </label>
                            <input
                                type="url"
                                placeholder="https://tiktok.com/@moncompte"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="w-full bg-muted/30 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                style={{ clipPath: CLIP_TR_SM }}
                                required
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">
                                Quantité (min.{" "}
                                {selectedService.minQty.toLocaleString("fr-FR")}
                                )
                            </label>
                            <input
                                type="number"
                                min={selectedService.minQty}
                                step={selectedService.step}
                                value={quantity}
                                onChange={(e) =>
                                    setQuantity(Number(e.target.value))
                                }
                                className="w-full bg-muted/30 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                style={{ clipPath: CLIP_TR_SM }}
                            />
                        </div>

                        {/* Price summary */}
                        <div
                            className="bg-primary/5 border border-primary/20 p-4"
                            style={{ clipPath: CLIP_TR_SM }}
                        >
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
                        <button
                            onClick={handleSubmit}
                            disabled={
                                loading ||
                                !link ||
                                quantity < selectedService.minQty
                            }
                            className="group relative inline-block w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div
                                className="absolute inset-0 bg-primary/30 translate-x-[3px] translate-y-[3px]"
                                style={{ clipPath: CLIP_TR_SM }}
                            />
                            <div
                                className="relative py-3 bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-primary/90 transition-colors"
                                style={{ clipPath: CLIP_TR_SM }}
                            >
                                {loading ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wallet className="w-4 h-4" />
                                )}
                                {loading
                                    ? "Traitement..."
                                    : `Commander — ${amount.toLocaleString("fr-FR")} FCFA`}
                            </div>
                        </button>
                    </div>
                </FuturisticCard>
            )}
        </div>
    );
}
