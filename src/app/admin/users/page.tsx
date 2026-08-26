"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    IconLoader2,
    IconShieldCheck,
    IconShieldOff,
    IconWalletOff,
    IconCircleCheck,
    IconCircleX,
} from "@tabler/icons-react";
import { toast } from "sonner";

type AdminUser = {
    id: string;
    name: string | null;
    email: string;
    role: "USER" | "ADMIN";
    balance: number;
    emailVerified: boolean;
    createdAt: string;
    _count: { orders: number; transactions: number };
};

function AdjustBalanceDialog({
    user,
    onUpdated,
}: {
    user: AdminUser;
    onUpdated: (u: AdminUser) => void;
}) {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async (sign: 1 | -1) => {
        const value = parseInt(amount, 10);
        if (!value || value <= 0) {
            toast.error("Montant invalide");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ balanceAdjustment: value * sign }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success("Solde mis à jour");
            onUpdated(data.user);
            setOpen(false);
            setAmount("");
        } catch {
            toast.error("Erreur lors de l'ajustement");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconWalletOff data-icon="inline-start" />
                    Ajuster solde
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ajuster le solde</DialogTitle>
                    <DialogDescription>
                        {user.name ?? user.email} — solde actuel :{" "}
                        <strong>{user.balance.toLocaleString("fr-FR")} FCFA</strong>
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-1.5">
                    <Label htmlFor="amount">Montant (FCFA)</Label>
                    <Input
                        id="amount"
                        type="number"
                        min={1}
                        placeholder="ex: 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>
                <DialogFooter className="gap-2 sm:gap-2">
                    <Button
                        variant="destructive"
                        onClick={() => submit(-1)}
                        disabled={saving}
                    >
                        {saving && <IconLoader2 className="animate-spin" />}
                        Débiter
                    </Button>
                    <Button onClick={() => submit(1)} disabled={saving}>
                        {saving && <IconLoader2 className="animate-spin" />}
                        Créditer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/admin/users")
            .then((r) => r.json())
            .then((d) => setUsers(d.users ?? []))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdated = (updated: AdminUser) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === updated.id ? { ...u, ...updated } : u)),
        );
    };

    const toggleRole = async (user: AdminUser) => {
        const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
        setUpdatingId(user.id);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: nextRole }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success(
                nextRole === "ADMIN"
                    ? "Promu administrateur"
                    : "Rôle admin retiré",
            );
            handleUpdated(data.user);
        } catch {
            toast.error("Erreur lors de la mise à jour du rôle");
        } finally {
            setUpdatingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-40">
                <IconLoader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Utilisateurs</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {users.length} utilisateur{users.length !== 1 ? "s" : ""} au
                    total
                </p>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Utilisateur</TableHead>
                            <TableHead>Rôle</TableHead>
                            <TableHead>Email vérifié</TableHead>
                            <TableHead className="text-right">Solde</TableHead>
                            <TableHead className="text-right">Commandes</TableHead>
                            <TableHead>Inscrit le</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <p className="font-medium">
                                        {user.name ?? "—"}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {user.email}
                                    </p>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            user.role === "ADMIN"
                                                ? "default"
                                                : "secondary"
                                        }
                                    >
                                        {user.role === "ADMIN"
                                            ? "Admin"
                                            : "Utilisateur"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {user.emailVerified ? (
                                        <IconCircleCheck className="w-4 h-4 text-success" />
                                    ) : (
                                        <IconCircleX className="w-4 h-4 text-muted-foreground" />
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-bold text-primary tabular-nums">
                                    {user.balance.toLocaleString("fr-FR")} FCFA
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground">
                                    {user._count.orders}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {new Date(user.createdAt).toLocaleDateString(
                                        "fr-FR",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        },
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <AdjustBalanceDialog
                                            user={user}
                                            onUpdated={handleUpdated}
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleRole(user)}
                                            disabled={updatingId === user.id}
                                        >
                                            {updatingId === user.id ? (
                                                <IconLoader2 data-icon="inline-start" className="animate-spin" />
                                            ) : user.role === "ADMIN" ? (
                                                <IconShieldOff data-icon="inline-start" />
                                            ) : (
                                                <IconShieldCheck data-icon="inline-start" />
                                            )}
                                            {user.role === "ADMIN"
                                                ? "Retirer admin"
                                                : "Promouvoir"}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
