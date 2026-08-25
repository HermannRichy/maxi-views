import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { IconMail, IconCalendar, IconSettings } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { ProfileSignOutButton } from "./sign-out-button";

export default async function ProfilePage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");

    return (
        <div className="min-h-screen bg-background py-12 px-4 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -z-10" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 -z-10" />

            <div className="container max-w-3xl mx-auto py-12">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                            Dashboard
                        </h1>
                        <p className="text-muted-foreground mt-1 text-lg">
                            Gérez votre expérience et vos paramètres
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-12 w-12 rounded-xl border-white/10 bg-white/5 backdrop-blur-md"
                    >
                        <IconSettings className="w-6 h-6" />
                    </Button>
                </div>

                <Card className="border-white/10 overflow-hidden bg-white/5 backdrop-blur-xl shadow-2xl rounded-3xl">
                    <div className="h-32 bg-gradient-to-r from-primary/40 to-primary/10 relative">
                        <div className="absolute -bottom-12 left-10">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-2xl ring-4 ring-white/5">
                                <AvatarImage src={user.image ?? undefined} />
                                <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                                    {(user.name ?? user.email).charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </div>

                    <CardHeader className="pt-16 pb-6 px-10">
                        <div>
                            <CardTitle className="text-3xl font-bold text-foreground">
                                {user.name || "Utilisateur"}
                            </CardTitle>
                            <CardDescription className="text-base text-primary font-medium">
                                {user.email}
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="px-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-muted-foreground text-sm font-semibold flex items-center gap-2">
                                    <IconMail className="w-4 h-4 opacity-70" />{" "}
                                    Adresse Email
                                </Label>
                                <div className="px-5 py-4 bg-white/5 rounded-2xl border border-white/10 font-medium text-foreground">
                                    {user.email}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-muted-foreground text-sm font-semibold flex items-center gap-2">
                                    <IconCalendar className="w-4 h-4 opacity-70" />{" "}
                                    Date d&apos;inscription
                                </Label>
                                <div className="px-5 py-4 bg-white/5 rounded-2xl border border-white/10 font-medium text-foreground">
                                    {user.createdAt.toLocaleDateString("fr-FR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            </div>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="space-y-4">
                            <h3 className="font-bold text-xl text-foreground">
                                Sécurité & Accès
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button
                                    variant="secondary"
                                    className="h-14 rounded-2xl bg-white/10 hover:bg-white/15 border-white/10 text-base"
                                >
                                    Changer le mot de passe
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="h-14 rounded-2xl bg-white/10 hover:bg-white/15 border-white/10 text-base"
                                >
                                    Méthodes de connexion
                                </Button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-black/20 px-10 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                User Identifier
                            </span>
                            <code className="text-[10px] text-primary/70">
                                {user.id}
                            </code>
                        </div>
                        <ProfileSignOutButton />
                    </CardFooter>
                </Card>

                <div className="mt-8 text-center">
                    <Link
                        href="/"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                        ← Retour au site principal
                    </Link>
                </div>
            </div>
        </div>
    );
}
