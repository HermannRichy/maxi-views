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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    IconDotsVertical,
    IconLoader2,
    IconShieldCheck,
    IconShieldOff,
    IconWalletOff,
    IconCircleCheck,
    IconCircleX,
    IconBan,
    IconTrash,
} from "@tabler/icons-react";
import { toast } from "sonner";

type AdminUser = {
    id: string;
    name: string | null;
    email: string;
    role: "USER" | "ADMIN";
    balance: number;
    emailVerified: boolean;
    banned: boolean;
    banReason: string | null;
    createdAt: string;
    _count: { orders: number; transactions: number };
};

function AdjustBalanceDialog({
    user,
    open,
    onOpenChange,
    onUpdated,
}: {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (u: AdminUser) => void;
}) {
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
            onOpenChange(false);
            setAmount("");
        } catch {
            toast.error("Erreur lors de l'ajustement");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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

function BanUserDialog({
    user,
    open,
    onOpenChange,
    onUpdated,
}: {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdated: (u: AdminUser) => void;
}) {
    const [reason, setReason] = useState("");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ banned: true, banReason: reason || undefined }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success("Utilisateur banni");
            onUpdated(data.user);
            onOpenChange(false);
            setReason("");
        } catch {
            toast.error("Erreur lors du bannissement");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bannir {user.name ?? user.email}</DialogTitle>
                    <DialogDescription>
                        Toutes ses sessions actives seront immédiatement révoquées et
                        il ne pourra plus se reconnecter.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-1.5">
                    <Label htmlFor="banReason">Motif (optionnel)</Label>
                    <Input
                        id="banReason"
                        placeholder="ex: violation des CGU"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="destructive" onClick={submit} disabled={saving}>
                        {saving && <IconLoader2 className="animate-spin" />}
                        Confirmer le bannissement
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteUserDialog({
    user,
    open,
    onOpenChange,
    onDeleted,
}: {
    user: AdminUser;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (id: string) => void;
}) {
    const [deleting, setDeleting] = useState(false);

    const submit = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success("Utilisateur supprimé");
            onDeleted(user.id);
            onOpenChange(false);
        } catch {
            toast.error("Erreur lors de la suppression");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Supprimer {user.name ?? user.email} ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Le compte, sa session et ses
                        identifiants de connexion seront définitivement supprimés.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={submit}
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleting ? "Suppression..." : "Supprimer définitivement"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function UserRow({
    user,
    updating,
    onToggleRole,
    onUnban,
    onUpdated,
    onDeleted,
}: {
    user: AdminUser;
    updating: boolean;
    onToggleRole: (user: AdminUser) => void;
    onUnban: (user: AdminUser) => void;
    onUpdated: (u: AdminUser) => void;
    onDeleted: (id: string) => void;
}) {
    const [balanceOpen, setBalanceOpen] = useState(false);
    const [banOpen, setBanOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const hasHistory = user._count.orders > 0 || user._count.transactions > 0;

    return (
        <TableRow>
            <TableCell>
                <p className="font-medium">{user.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-1.5">
                    <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                        {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                    </Badge>
                    {user.banned && (
                        <Badge
                            variant="destructive"
                            title={user.banReason ?? undefined}
                        >
                            Banni
                        </Badge>
                    )}
                </div>
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
                {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
            </TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" disabled={updating}>
                            {updating ? (
                                <IconLoader2 className="animate-spin" />
                            ) : (
                                <IconDotsVertical />
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setBalanceOpen(true);
                            }}
                        >
                            <IconWalletOff data-icon="inline-start" />
                            Ajuster solde
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                onToggleRole(user);
                            }}
                        >
                            {user.role === "ADMIN" ? (
                                <IconShieldOff data-icon="inline-start" />
                            ) : (
                                <IconShieldCheck data-icon="inline-start" />
                            )}
                            {user.role === "ADMIN" ? "Retirer admin" : "Promouvoir"}
                        </DropdownMenuItem>
                        {user.banned ? (
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    onUnban(user);
                                }}
                            >
                                <IconShieldCheck data-icon="inline-start" />
                                Débannir
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    setBanOpen(true);
                                }}
                            >
                                <IconBan data-icon="inline-start" />
                                Bannir
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            disabled={hasHistory}
                            title={
                                hasHistory
                                    ? "Impossible de supprimer un compte avec des commandes ou transactions — bannissez-le à la place"
                                    : undefined
                            }
                            onSelect={(e) => {
                                e.preventDefault();
                                setDeleteOpen(true);
                            }}
                        >
                            <IconTrash data-icon="inline-start" />
                            Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <AdjustBalanceDialog
                    user={user}
                    open={balanceOpen}
                    onOpenChange={setBalanceOpen}
                    onUpdated={onUpdated}
                />
                <BanUserDialog
                    user={user}
                    open={banOpen}
                    onOpenChange={setBanOpen}
                    onUpdated={onUpdated}
                />
                <DeleteUserDialog
                    user={user}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    onDeleted={onDeleted}
                />
            </TableCell>
        </TableRow>
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

    const handleDeleted = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
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

    const unban = async (user: AdminUser) => {
        setUpdatingId(user.id);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ banned: false }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success("Utilisateur débanni");
            handleUpdated(data.user);
        } catch {
            toast.error("Erreur lors du débannissement");
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
                            <UserRow
                                key={user.id}
                                user={user}
                                updating={updatingId === user.id}
                                onToggleRole={toggleRole}
                                onUnban={unban}
                                onUpdated={handleUpdated}
                                onDeleted={handleDeleted}
                            />
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
