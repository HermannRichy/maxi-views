import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
