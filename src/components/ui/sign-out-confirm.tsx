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
import { useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

interface SignOutConfirmProps {
    className?: string;
    children?: React.ReactNode;
}

export function SignOutConfirm({ className, children }: SignOutConfirmProps) {
    const { signOut } = useClerk();

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children ?? (
                    <button className={className}>
                        <LogOut className="w-4 h-4" />
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
                        onClick={() => signOut({ redirectUrl: "/sign-in" })}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Se déconnecter
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
