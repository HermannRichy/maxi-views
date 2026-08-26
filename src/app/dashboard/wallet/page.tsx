"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    IconWallet,
    IconArrowUpRight,
    IconArrowDownLeft,
    IconLoader2,
    IconPlus,
    IconHistory,
    IconDeviceMobile,
    IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FEEXPAY_COUNTRIES, FEEXPAY_NETWORKS } from "@/lib/feexpay-networks";

type Transaction = {
    id: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    status: "PENDING" | "COMPLETED" | "FAILED";
    reference: string;
    createdAt: string;
};

const TX_STATUS_CONFIG: Record<
    Transaction["status"],
    { label: string; variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]> }
> = {
    PENDING: { label: "En attente", variant: "warning" },
    COMPLETED: { label: "Confirmé", variant: "success" },
    FAILED: { label: "Échoué", variant: "destructive" },
};

const AMOUNTS = [1000, 2000, 5000, 10000, 25000, 50000];

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 40; // ~2 minutes

export default function WalletPage() {
    const [balance, setBalance] = useState<number | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [depositing, setDepositing] = useState(false);
    const [customAmount, setCustomAmount] = useState("");
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);

    const [country, setCountry] = useState<string | null>(null);
    const [networkSlug, setNetworkSlug] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");

    const [pendingReference, setPendingReference] = useState<string | null>(
        null,
    );
    const [cancelling, setCancelling] = useState(false);
    const pollAttempts = useRef(0);

    const router = useRouter();

    const refreshWallet = () =>
        fetch("/api/wallet/balance")
            .then((r) => r.json())
            .then((d) => {
                setBalance(d.balance);
                setTransactions(d.transactions ?? []);
            });

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const paymentStatus = params.get("paymentStatus");
            if (paymentStatus === "success") {
                toast.success("Paiement validé avec succès !");
                router.replace("/dashboard/wallet");
            } else if (paymentStatus === "failed") {
                toast.error("Le paiement a échoué ou a été annulé.");
                router.replace("/dashboard/wallet");
            }
        }

        refreshWallet().finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    // Polling du statut pendant qu'un dépôt est en attente de confirmation
    useEffect(() => {
        if (!pendingReference) return;

        pollAttempts.current = 0;
        const interval = setInterval(async () => {
            pollAttempts.current += 1;

            try {
                const res = await fetch(
                    `/api/wallet/deposit/status?reference=${encodeURIComponent(pendingReference)}`,
                );
                const data = await res.json();

                if (data.status === "COMPLETED") {
                    clearInterval(interval);
                    setPendingReference(null);
                    toast.success("Paiement confirmé ! Solde mis à jour.");
                    refreshWallet();
                    return;
                }

                if (data.status === "FAILED") {
                    clearInterval(interval);
                    setPendingReference(null);
                    toast.error("Le paiement a échoué ou a été refusé.");
                    return;
                }
            } catch {
                // on retente au prochain intervalle
            }

            if (pollAttempts.current >= POLL_MAX_ATTEMPTS) {
                clearInterval(interval);
                toast.info(
                    "Toujours en attente. Vérifiez votre historique dans quelques instants.",
                );
                setPendingReference(null);
            }
        }, POLL_INTERVAL_MS);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pendingReference]);

    const networksForCountry = FEEXPAY_NETWORKS.filter(
        (n) => n.country === country,
    );

    const handleDeposit = async () => {
        const amount = customAmount ? parseInt(customAmount) : selectedAmount;
        if (!amount || amount < 500) {
            toast.error("Montant minimum : 500 FCFA");
            return;
        }
        if (!networkSlug) {
            toast.error("Choisissez un pays et un réseau Mobile Money");
            return;
        }
        if (!phoneNumber || phoneNumber.replace(/\D/g, "").length < 8) {
            toast.error("Numéro de téléphone invalide");
            return;
        }

        setDepositing(true);
        try {
            const res = await fetch("/api/wallet/deposit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    phoneNumber,
                    network: networkSlug,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Erreur de paiement");
                return;
            }

            toast.info(
                data.message ??
                    "Vérifiez votre téléphone pour confirmer le paiement.",
            );
            setPendingReference(data.reference);
        } catch {
            toast.error("Erreur lors de l'initialisation du paiement");
        } finally {
            setDepositing(false);
        }
    };

    const handleCancelPending = async () => {
        if (!pendingReference) return;
        setCancelling(true);
        try {
            await fetch("/api/wallet/cancel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reference: pendingReference }),
            });
            setPendingReference(null);
            toast.info("Dépôt annulé.");
        } finally {
            setCancelling(false);
        }
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold">Portefeuille</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Gérez votre solde et rechargez votre compte
                </p>
            </div>

            {/* Balance card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                                Solde disponible
                            </p>
                            {loading ? (
                                <Skeleton className="h-10 w-40" />
                            ) : (
                                <p className="text-4xl font-black text-primary tabular-nums">
                                    {(balance ?? 0).toLocaleString("fr-FR")}
                                    <span className="text-lg font-semibold ml-2">
                                        FCFA
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <IconWallet className="w-6 h-6" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pending deposit */}
            {pendingReference && (
                <Card className="border-warning/30">
                    <CardContent className="p-5 flex items-center gap-4">
                        <IconLoader2 className="w-6 h-6 text-warning animate-spin shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold">
                                Confirmation en attente
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Validez la demande de paiement reçue sur votre
                                téléphone.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelPending}
                            disabled={cancelling}
                        >
                            <IconX data-icon="inline-start" />
                            Annuler
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Deposit form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <IconPlus className="w-5 h-5 text-primary" /> Recharger
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Country + network */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                                Pays
                            </Label>
                            <Select
                                value={country ?? undefined}
                                onValueChange={(value) => {
                                    setCountry(value);
                                    setNetworkSlug(null);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {FEEXPAY_COUNTRIES.map((c) => (
                                        <SelectItem key={c.code} value={c.code}>
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground uppercase tracking-widest">
                                Réseau
                            </Label>
                            <Select
                                value={networkSlug ?? undefined}
                                onValueChange={setNetworkSlug}
                                disabled={!country}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {networksForCountry.map((n) => (
                                        <SelectItem key={n.slug} value={n.slug}>
                                            {n.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Phone number */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="phoneNumber"
                            className="text-xs text-muted-foreground uppercase tracking-widest"
                        >
                            Numéro Mobile Money
                        </Label>
                        <div className="relative">
                            <IconDeviceMobile className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="phoneNumber"
                                type="tel"
                                placeholder="ex: 0166000000"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>

                    {/* Preset amounts */}
                    <div className="grid grid-cols-3 gap-2">
                        {AMOUNTS.map((a) => (
                            <button
                                key={a}
                                type="button"
                                onClick={() => {
                                    setSelectedAmount(a);
                                    setCustomAmount("");
                                }}
                                className={cn(
                                    "py-2 rounded-xl text-sm font-semibold border transition-colors",
                                    selectedAmount === a && !customAmount
                                        ? "border-primary bg-primary/10 text-primary"
                                        : "border-white/10 bg-muted/30 hover:border-primary/50",
                                )}
                            >
                                {a.toLocaleString("fr-FR")} FCFA
                            </button>
                        ))}
                    </div>

                    {/* Custom amount */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="customAmount"
                            className="text-xs text-muted-foreground uppercase tracking-widest"
                        >
                            Montant personnalisé (FCFA)
                        </Label>
                        <Input
                            id="customAmount"
                            type="number"
                            min={500}
                            placeholder="ex: 15000"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                            }}
                        />
                    </div>

                    <Button
                        onClick={handleDeposit}
                        disabled={
                            depositing ||
                            !!pendingReference ||
                            (!selectedAmount && !customAmount)
                        }
                        className="w-full"
                    >
                        {depositing ? (
                            <IconLoader2 data-icon="inline-start" className="animate-spin" />
                        ) : (
                            <IconWallet data-icon="inline-start" />
                        )}
                        {depositing ? "Envoi de la demande..." : "Recharger"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                        Vous recevrez une demande de confirmation directement sur
                        votre téléphone
                    </p>
                </CardContent>
            </Card>

            {/* Transactions */}
            <div>
                <h2 className="font-bold text-lg mb-4">Historique</h2>
                {loading ? (
                    <Card>
                        <div className="p-5 space-y-3">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-12 w-full rounded-xl" />
                            ))}
                        </div>
                    </Card>
                ) : transactions.length === 0 ? (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <IconHistory />
                            </EmptyMedia>
                            <EmptyTitle>Aucune transaction</EmptyTitle>
                            <EmptyDescription>
                                Votre historique de rechargements et commandes
                                apparaîtra ici.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                ) : (
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">
                                        Montant
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.map((tx) => {
                                    const st = TX_STATUS_CONFIG[tx.status];
                                    return (
                                        <TableRow key={tx.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={cn(
                                                            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                                                            tx.type === "CREDIT"
                                                                ? "bg-success/10 text-success"
                                                                : "bg-destructive/10 text-destructive",
                                                        )}
                                                    >
                                                        {tx.type === "CREDIT" ? (
                                                            <IconArrowDownLeft className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <IconArrowUpRight className="w-3.5 h-3.5" />
                                                        )}
                                                    </div>
                                                    <span className="font-medium">
                                                        {tx.type === "CREDIT"
                                                            ? "Rechargement"
                                                            : "Commande"}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(
                                                    tx.createdAt,
                                                ).toLocaleDateString("fr-FR", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={st.variant}>
                                                    {st.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    "text-right font-bold tabular-nums",
                                                    tx.type === "CREDIT"
                                                        ? "text-success"
                                                        : "text-destructive",
                                                )}
                                            >
                                                {tx.type === "CREDIT" ? "+" : "-"}
                                                {tx.amount.toLocaleString(
                                                    "fr-FR",
                                                )}{" "}
                                                FCFA
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Card>
                )}
            </div>
        </div>
    );
}
