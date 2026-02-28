import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "./prisma";

/**
 * Renvoie l'utilisateur DB correspondant au user Clerk connecté.
 * Crée le user en DB s'il n'existe pas encore (lazy init).
 */
export async function getCurrentUser() {
    const { userId } = await auth();
    if (!userId) return null;

    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    // Upsert : crée le user s'il n'existe pas
    const user = await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
            name:
                `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
                undefined,
            image: clerkUser.imageUrl,
        },
        create: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            name:
                `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() ||
                null,
            image: clerkUser.imageUrl,
        },
    });

    return user;
}

/**
 * Comme getCurrentUser() mais throw si non authentifié.
 */
export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) throw new Error("UNAUTHENTICATED");
    return user;
}

/**
 * Comme requireUser() mais vérifie aussi que le rôle est ADMIN.
 */
export async function requireAdmin() {
    const user = await requireUser();
    if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
    return user;
}
