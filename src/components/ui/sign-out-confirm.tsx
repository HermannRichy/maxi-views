"use client";

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
import { authClient } from "@/lib/auth-client";
import { IconLogout } from "@tabler/icons-react";

interface SignOutConfirmProps {
    className?: string;
    children?: React.ReactNode;
}

export function SignOutConfirm({ className, children }: SignOutConfirmProps) {
    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.assign("/sign-in");
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children ?? (
                    <button className={className}>
                        <IconLogout className="w-4 h-4" />
                        Se déconnecter
                    </button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Se déconnecter ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Vous allez être déconnecté de votre session Maxi Views.
                        Vous pourrez vous reconnecter à tout moment.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleSignOut}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Se déconnecter
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
