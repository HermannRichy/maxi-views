"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FuturisticCard, CLIP_TR_SM } from "@/components/ui/futuristic";
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    RefreshCw,
    Plus,
} from "lucide-react";
import { toast } from "sonner";

type Transaction = {
    id: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    status: "PENDING" | "COMPLETED" | "FAILED";
    reference: string;
    createdAt: string;
};

const AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];

export default function WalletPage() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [depositing, setDepositing] = useState(false);
    const [customAmount, setCustomAmount] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("/api/wallet/balance")
            .then((r) => r.json())
            .then((d) => {
                setBalance(d.balance);
                setTransactions(d.transactions ?? []);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDeposit = async () => {
        const amount = customAmount ? parseInt(customAmount) : selectedAmount;
        if (!amount || amount < 500) {
            toast.error("Montant minimum : 500 FCFA");
            return;
        }
        setDepositing(true);
        try {
            const res = await fetch("/api/wallet/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            if (data.paymentUrl) {
                router.push(data.paymentUrl);
            }
        } catch {
            toast.error("Erreur lors de l'initialisation du paiement");
        } finally {
            setDepositing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Portefeuille</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Gérez votre solde et rechargez votre compte
                </p>
            </div>

            {/* Balance card */}
            <FuturisticCard className="p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                            Solde disponible
                        </p>
                        <p className="text-4xl font-black text-primary tabular-nums">
                            {(balance ?? 0).toLocaleString("fr-FR")}
                            <span className="text-lg font-semibold ml-2">
                                FCFA
                            </span>
                        </p>
                    </div>
                    <div
                        className="w-12 h-12 bg-primary/10 flex items-center justify-center text-primary"
                        style={{ clipPath: CLIP_TR_SM }}
                    >
                        <Wallet className="w-6 h-6" />
                    </div>
                </div>
            </FuturisticCard>

            {/* Deposit form */}
            <FuturisticCard className="p-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" /> Recharger
                </h2>

                {/* Preset amounts */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {AMOUNTS.map((a) => (
                        <button
                            key={a}
                            onClick={() => {
                                setSelectedAmount(a);
                                setCustomAmount("");
                            }}
                            className={`py-2 text-sm font-semibold border transition-colors ${selectedAmount === a && !customAmount ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30 hover:border-primary/50"}`}
                            style={{ clipPath: CLIP_TR_SM }}
                        >
                            {a.toLocaleString("fr-FR")} FCFA
                        </button>
                    ))}
                </div>

                {/* Custom amount */}
                <div className="mb-4">
                    <label className="text-xs text-muted-foreground uppercase tracking-widest mb-1 block">
                        Montant personnalisé (FCFA)
                    </label>
                    <input
                        type="number"
                        min={500}
                        placeholder="ex: 15000"
                        value={customAmount}
                        onChange={(e) => {
                            setCustomAmount(e.target.value);
                            setSelectedAmount(null);
                        }}
                        className="w-full bg-muted/30 border border-border px-3 py-2 text-sm focus:outline-none focus:border-primary rounded-none"
                        style={{ clipPath: CLIP_TR_SM }}
                    />
                </div>

                <button
                    onClick={handleDeposit}
                    disabled={depositing || (!selectedAmount && !customAmount)}
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
                        {depositing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wallet className="w-4 h-4" />
                        )}
                        {depositing ? "Redirection..." : "Payer avec FeexPay"}
                    </div>
                </button>

                <p className="text-xs text-muted-foreground mt-3 text-center">
                    Paiement sécurisé via Mobile Money ou carte bancaire
                </p>
            </FuturisticCard>

            {/* Transactions */}
            <div>
                <h2 className="font-bold text-lg mb-4">Historique</h2>
                {transactions.length === 0 ? (
                    <FuturisticCard className="p-6 text-center text-sm text-muted-foreground">
                        Aucune transaction pour l&apos;instant.
                    </FuturisticCard>
                ) : (
                    <div className="space-y-2">
                        {transactions.map((tx) => (
                            <FuturisticCard
                                key={tx.id}
                                className="p-4 flex items-center gap-4"
                            >
                                <div
                                    className={`w-8 h-8 flex items-center justify-center shrink-0 ${tx.type === "CREDIT" ? "bg-green-400/10 text-green-400" : "bg-red-400/10 text-red-400"}`}
                                    style={{ clipPath: CLIP_TR_SM }}
                                >
                                    {tx.type === "CREDIT" ? (
                                        <ArrowDownLeft className="w-4 h-4" />
                                    ) : (
                                        <ArrowUpRight className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium">
                                        {tx.type === "CREDIT"
                                            ? "Rechargement"
                                            : "Commande"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            tx.createdAt,
                                        ).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p
                                        className={`font-bold tabular-nums ${tx.type === "CREDIT" ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {tx.type === "CREDIT" ? "+" : "-"}
                                        {tx.amount.toLocaleString("fr-FR")} FCFA
                                    </p>
                                    <p
                                        className={`text-xs ${tx.status === "COMPLETED" ? "text-green-400" : tx.status === "FAILED" ? "text-red-400" : "text-yellow-400"}`}
                                    >
                                        {tx.status === "COMPLETED"
                                            ? "Confirmé"
                                            : tx.status === "FAILED"
                                              ? "Échoué"
                                              : "En attente"}
                                    </p>
                                </div>
                            </FuturisticCard>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
