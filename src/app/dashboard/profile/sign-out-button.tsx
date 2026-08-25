"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { IconLogout } from "@tabler/icons-react";

export function ProfileSignOutButton() {
    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.assign("/");
    };

    return (
        <Button
            variant="destructive"
            onClick={handleSignOut}
            className="h-12 px-8 rounded-xl font-bold text-base shadow-lg shadow-destructive/20"
        >
            <IconLogout className="w-5 h-5 mr-2" />
            Déconnexion
        </Button>
    );
}
