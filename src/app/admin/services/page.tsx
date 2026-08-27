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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
    IconPencil,
    IconPlus,
    IconPower,
    IconSearch,
    IconTrash,
    IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { NETWORKS } from "@/data/landing";

type Service = {
    id: string;
    network: string;
    name: string;
    unitPrice: number;
    minQty: number;
    step: number;
    note: string | null;
    enabled: boolean;
};

function ServiceFormDialog({
    service,
    onSaved,
    open,
    onOpenChange,
}: {
    service?: Service;
    onSaved: (s: Service) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const isEdit = !!service;
    const [network, setNetwork] = useState(service?.network ?? "");
    const [name, setName] = useState(service?.name ?? "");
    const [unitPrice, setUnitPrice] = useState(
        service ? String(service.unitPrice) : "",
    );
    const [minQty, setMinQty] = useState(service ? String(service.minQty) : "");
    const [step, setStep] = useState(service ? String(service.step) : "");
    const [note, setNote] = useState(service?.note ?? "");
    const [saving, setSaving] = useState(false);

    const submit = async () => {
        if (!isEdit && (!network || !name)) {
            toast.error("Réseau et nom obligatoires");
            return;
        }
        if (!unitPrice || !minQty || !step) {
            toast.error("Prix, quantité min. et pas obligatoires");
            return;
        }
        setSaving(true);
        try {
            const url = isEdit
                ? `/api/admin/services/${service.id}`
                : "/api/admin/services";
            const res = await fetch(url, {
                method: isEdit ? "PATCH" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...(isEdit ? {} : { network, name }),
                    unitPrice: parseInt(unitPrice, 10),
                    minQty: parseInt(minQty, 10),
                    step: parseInt(step, 10),
                    note: note || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success(isEdit ? "Service mis à jour" : "Service créé");
            onSaved(data.service);
            onOpenChange(false);
            if (!isEdit) {
                setNetwork("");
                setName("");
                setUnitPrice("");
                setMinQty("");
                setStep("");
                setNote("");
            }
        } catch {
            toast.error("Erreur lors de l'enregistrement");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? `Modifier ${service.name}` : "Nouveau service"}
                    </DialogTitle>
                    <DialogDescription>
                        Le prix est exprimé en FCFA pour 1000 unités.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    {!isEdit && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label>Réseau</Label>
                                <Select value={network} onValueChange={setNetwork}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NETWORKS.map((n) => (
                                            <SelectItem key={n.name} value={n.name}>
                                                {n.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Nom du service</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="ex: Vues"
                                />
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                            <Label htmlFor="unitPrice">Prix /1000 (FCFA)</Label>
                            <Input
                                id="unitPrice"
                                type="number"
                                min={1}
                                value={unitPrice}
                                onChange={(e) => setUnitPrice(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="minQty">Quantité min.</Label>
                            <Input
                                id="minQty"
                                type="number"
                                min={1}
                                value={minQty}
                                onChange={(e) => setMinQty(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="step">Pas</Label>
                            <Input
                                id="step"
                                type="number"
                                min={1}
                                value={step}
                                onChange={(e) => setStep(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="note">
                            Note d&apos;information (affichée au client avant
                            commande)
                        </Label>
                        <Textarea
                            id="note"
                            rows={3}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="ex: Délai de livraison 24-48h, compte doit être public..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={submit} disabled={saving}>
                        {saving && <IconLoader2 className="animate-spin" />}
                        Enregistrer
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function DeleteServiceDialog({
    service,
    open,
    onOpenChange,
    onDeleted,
}: {
    service: Service;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onDeleted: (id: string) => void;
}) {
    const [deleting, setDeleting] = useState(false);

    const submit = async () => {
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/services/${service.id}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success("Service supprimé");
            onDeleted(service.id);
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
                        Supprimer {service.network} — {service.name} ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible. Les commandes déjà passées
                        pour ce service ne sont pas affectées (elles gardent leur
                        propre historique).
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={submit}
                        disabled={deleting}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {deleting ? "Suppression..." : "Supprimer"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

type StatusFilter = "ALL" | "ENABLED" | "DISABLED";

function ServiceRow({
    service,
    updating,
    onToggle,
    onUpdated,
    onDeleted,
}: {
    service: Service;
    updating: boolean;
    onToggle: (service: Service) => void;
    onUpdated: (s: Service) => void;
    onDeleted: (id: string) => void;
}) {
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    return (
        <TableRow>
            <TableCell className="text-muted-foreground">
                {service.network}
            </TableCell>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell className="text-right tabular-nums">
                {service.unitPrice.toLocaleString("fr-FR")} FCFA
            </TableCell>
            <TableCell className="text-right text-muted-foreground tabular-nums">
                {service.minQty.toLocaleString("fr-FR")}
            </TableCell>
            <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                {service.note ?? "—"}
            </TableCell>
            <TableCell>
                <Badge variant={service.enabled ? "success" : "secondary"}>
                    {service.enabled ? "Actif" : "Désactivé"}
                </Badge>
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
                                onToggle(service);
                            }}
                        >
                            <IconPower data-icon="inline-start" />
                            {service.enabled ? "Désactiver" : "Activer"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onSelect={(e) => {
                                e.preventDefault();
                                setEditOpen(true);
                            }}
                        >
                            <IconPencil data-icon="inline-start" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
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

                <ServiceFormDialog
                    service={service}
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    onSaved={onUpdated}
                />
                <DeleteServiceDialog
                    service={service}
                    open={deleteOpen}
                    onOpenChange={setDeleteOpen}
                    onDeleted={onDeleted}
                />
            </TableCell>
        </TableRow>
    );
}

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [createOpen, setCreateOpen] = useState(false);

    const [search, setSearch] = useState("");
    const [networkFilter, setNetworkFilter] = useState<string>("ALL");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

    useEffect(() => {
        fetch("/api/admin/services")
            .then((r) => r.json())
            .then((d) => setServices(d.services ?? []))
            .finally(() => setLoading(false));
    }, []);

    const handleUpdated = (updated: Service) => {
        setServices((prev) =>
            prev.map((s) => (s.id === updated.id ? updated : s)),
        );
    };

    const handleCreated = (created: Service) => {
        setServices((prev) => [...prev, created]);
    };

    const handleDeleted = (id: string) => {
        setServices((prev) => prev.filter((s) => s.id !== id));
    };

    const toggleEnabled = async (service: Service) => {
        setUpdatingId(service.id);
        try {
            const res = await fetch(`/api/admin/services/${service.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ enabled: !service.enabled }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success(
                data.service.enabled ? "Service activé" : "Service désactivé",
            );
            handleUpdated(data.service);
        } catch {
            toast.error("Erreur lors de la mise à jour");
        } finally {
            setUpdatingId(null);
        }
    };

    const networks = Array.from(
        new Set(services.map((s) => s.network)),
    ).sort();

    const filtered = services.filter((s) => {
        if (networkFilter !== "ALL" && s.network !== networkFilter)
            return false;
        if (statusFilter === "ENABLED" && !s.enabled) return false;
        if (statusFilter === "DISABLED" && s.enabled) return false;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            const haystack = `${s.network} ${s.name} ${s.note ?? ""}`.toLowerCase();
            if (!haystack.includes(q)) return false;
        }
        return true;
    });

    const hasActiveFilters =
        search.trim() !== "" || networkFilter !== "ALL" || statusFilter !== "ALL";

    const resetFilters = () => {
        setSearch("");
        setNetworkFilter("ALL");
        setStatusFilter("ALL");
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
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Services</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {hasActiveFilters
                            ? `${filtered.length} / ${services.length} services`
                            : `${services.length} service${services.length !== 1 ? "s" : ""} au catalogue`}
                    </p>
                </div>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                    <IconPlus data-icon="inline-start" />
                    Nouveau service
                </Button>
                <ServiceFormDialog
                    open={createOpen}
                    onOpenChange={setCreateOpen}
                    onSaved={handleCreated}
                />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Rechercher par nom, réseau ou note..."
                        className="pl-9"
                    />
                </div>
                <Select value={networkFilter} onValueChange={setNetworkFilter}>
                    <SelectTrigger className="sm:w-[180px]">
                        <SelectValue placeholder="Réseau" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les réseaux</SelectItem>
                        {networks.map((n) => (
                            <SelectItem key={n} value={n}>
                                {n}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as StatusFilter)}
                >
                    <SelectTrigger className="sm:w-[160px]">
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous les statuts</SelectItem>
                        <SelectItem value="ENABLED">Actifs</SelectItem>
                        <SelectItem value="DISABLED">Désactivés</SelectItem>
                    </SelectContent>
                </Select>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                        <IconX data-icon="inline-start" />
                        Réinitialiser
                    </Button>
                )}
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Réseau</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead className="text-right">
                                Prix /1000
                            </TableHead>
                            <TableHead className="text-right">
                                Qté min.
                            </TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center text-sm text-muted-foreground py-8"
                                >
                                    Aucun service ne correspond à ces filtres.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filtered.map((service) => (
                                <ServiceRow
                                    key={service.id}
                                    service={service}
                                    updating={updatingId === service.id}
                                    onToggle={toggleEnabled}
                                    onUpdated={handleUpdated}
                                    onDeleted={handleDeleted}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
