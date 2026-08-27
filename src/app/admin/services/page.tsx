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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    IconLoader2,
    IconPencil,
    IconPlus,
    IconTrash,
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
    trigger,
}: {
    service?: Service;
    onSaved: (s: Service) => void;
    trigger: React.ReactNode;
}) {
    const isEdit = !!service;
    const [open, setOpen] = useState(false);
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
            setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
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

function DeleteServiceButton({
    service,
    onDeleted,
}: {
    service: Service;
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
        } catch {
            toast.error("Erreur lors de la suppression");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <IconTrash data-icon="inline-start" />
                </Button>
            </AlertDialogTrigger>
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

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

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
                        {services.length} service{services.length !== 1 ? "s" : ""}{" "}
                        au catalogue
                    </p>
                </div>
                <ServiceFormDialog
                    onSaved={handleCreated}
                    trigger={
                        <Button size="sm">
                            <IconPlus data-icon="inline-start" />
                            Nouveau service
                        </Button>
                    }
                />
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
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="text-muted-foreground">
                                    {service.network}
                                </TableCell>
                                <TableCell className="font-medium">
                                    {service.name}
                                </TableCell>
                                <TableCell className="text-right tabular-nums">
                                    {service.unitPrice.toLocaleString("fr-FR")}{" "}
                                    FCFA
                                </TableCell>
                                <TableCell className="text-right text-muted-foreground tabular-nums">
                                    {service.minQty.toLocaleString("fr-FR")}
                                </TableCell>
                                <TableCell className="max-w-[220px] truncate text-xs text-muted-foreground">
                                    {service.note ?? "—"}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={
                                            service.enabled
                                                ? "success"
                                                : "secondary"
                                        }
                                    >
                                        {service.enabled ? "Actif" : "Désactivé"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleEnabled(service)}
                                            disabled={updatingId === service.id}
                                        >
                                            {updatingId === service.id ? (
                                                <IconLoader2 className="animate-spin" />
                                            ) : service.enabled ? (
                                                "Désactiver"
                                            ) : (
                                                "Activer"
                                            )}
                                        </Button>
                                        <ServiceFormDialog
                                            service={service}
                                            onSaved={handleUpdated}
                                            trigger={
                                                <Button variant="outline" size="sm">
                                                    <IconPencil data-icon="inline-start" />
                                                </Button>
                                            }
                                        />
                                        <DeleteServiceButton
                                            service={service}
                                            onDeleted={handleDeleted}
                                        />
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
