import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. On définit les routes publiques de manière exhaustive
const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/sso-callback(.*)",
    "/contact",
    "/cgu",
    "/privacy",
    "/api/wallet/callback(.*)", // Utilisation de (.*) pour parer au trailing slash
]);

// 2. On utilise l'export par défaut pour plus de sécurité avec Next 16
export default clerkMiddleware(async (auth, request) => {
    // AJOUTEZ CECI POUR LE DEBUG :
    if (request.nextUrl.pathname.startsWith("/api/wallet/callback")) {
        return; // On force l'arrêt du middleware Clerk ici pour tester
    }
    // Si la route n'est pas publique, on protège
    if (!isPublicRoute(request)) {
        await auth.protect();
    }
});

// 3. Le matcher doit être une constante statique
export const config = {
    matcher: [
        // Exclure les fichiers statiques et internes
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Forcer l'exécution sur les routes API
        "/(api|trpc)(.*)",
    ],
};
