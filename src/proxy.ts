import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes publiques (accessibles sans session) — exhaustif.
const PUBLIC_ROUTES: RegExp[] = [
    /^\/$/,
    /^\/sign-in(?:\/.*)?$/,
    /^\/sign-up(?:\/.*)?$/,
    /^\/forgot-password(?:\/.*)?$/,
    /^\/reset-password(?:\/.*)?$/,
    /^\/contact$/,
    /^\/cgu$/,
    /^\/privacy$/,
    /^\/api\/auth(?:\/.*)?$/,
    /^\/api\/contact$/,
];

function isPublicRoute(pathname: string) {
    return PUBLIC_ROUTES.some((re) => re.test(pathname));
}

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Webhook FedaPay : doit rester public, sans aucune vérification, sans exception.
    if (pathname.startsWith("/api/wallet/callback")) {
        return NextResponse.next();
    }

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    // Vérification légère (cookie only, pas d'appel DB — safe en Edge runtime).
    // Le contrôle réel se fait côté layouts/routes via getCurrentUser()/
    // requireUser()/requireAdmin() (runtime Node, peut utiliser Prisma).
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Exclure les fichiers statiques et internes
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Forcer l'exécution sur les routes API
        "/(api|trpc)(.*)",
    ],
};
