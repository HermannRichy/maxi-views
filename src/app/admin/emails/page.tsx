"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IconLoader2, IconMail, IconSend } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type AdminUser = {
    id: string;
    name: string | null;
    email: string;
};

export default function AdminEmailsPage() {
    const [mode, setMode] = useState<"user" | "custom">("user");
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [customEmail, setCustomEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetch("/api/admin/users")
            .then((r) => r.json())
            .then((d) => setUsers(d.users ?? []))
            .finally(() => setLoadingUsers(false));
    }, []);

    const recipient =
        mode === "user"
            ? (users.find((u) => u.id === selectedUserId)?.email ?? "")
            : customEmail;

    const handleSend = async () => {
        if (!recipient) {
            toast.error("Choisissez un destinataire");
            return;
        }
        if (!subject || !message) {
            toast.error("Objet et message obligatoires");
            return;
        }
        setSending(true);
        try {
            const res = await fetch("/api/admin/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: recipient, subject, message }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
                return;
            }
            toast.success(`Email envoyé à ${recipient}`);
            setSubject("");
            setMessage("");
        } catch {
            toast.error("Erreur lors de l'envoi");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl">
            <div>
                <h1 className="text-2xl font-bold">Envoyer un email</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Le message est inséré dans le template email Maxi Views.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <IconMail className="w-5 h-5 text-primary" /> Destinataire
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => setMode("user")}
                            className={cn(
                                "flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors",
                                mode === "user"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-white/10 bg-muted/30 hover:border-primary/50",
                            )}
                        >
                            Utilisateur existant
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("custom")}
                            className={cn(
                                "flex-1 py-2 rounded-xl text-sm font-semibold border transition-colors",
                                mode === "custom"
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-white/10 bg-muted/30 hover:border-primary/50",
                            )}
                        >
                            Adresse email libre
                        </button>
                    </div>

                    {mode === "user" ? (
                        <div className="space-y-1.5">
                            <Label>Utilisateur</Label>
                            {loadingUsers ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <IconLoader2 className="w-4 h-4 animate-spin" />
                                    Chargement...
                                </div>
                            ) : (
                                <Select
                                    value={selectedUserId}
                                    onValueChange={setSelectedUserId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choisir un utilisateur..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((u) => (
                                            <SelectItem key={u.id} value={u.id}>
                                                {u.name ?? u.email} ({u.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <Label htmlFor="customEmail">Adresse email</Label>
                            <Input
                                id="customEmail"
                                type="email"
                                placeholder="exemple@domaine.com"
                                value={customEmail}
                                onChange={(e) => setCustomEmail(e.target.value)}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="subject">Objet</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="ex: Information importante sur votre compte"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                            id="message"
                            rows={8}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Votre message..."
                        />
                    </div>

                    <Button
                        onClick={handleSend}
                        disabled={sending || !recipient}
                        className="w-full"
                    >
                        {sending ? (
                            <IconLoader2 data-icon="inline-start" className="animate-spin" />
                        ) : (
                            <IconSend data-icon="inline-start" />
                        )}
                        {sending
                            ? "Envoi..."
                            : recipient
                              ? `Envoyer à ${recipient}`
                              : "Envoyer"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
