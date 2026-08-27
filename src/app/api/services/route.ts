import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/services
   Catalogue des services actifs, pour le formulaire de nouvelle
   commande. Réservé aux utilisateurs connectés (pas de données
   sensibles, mais évite l'exposition publique de la grille tarifaire
   brute).
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        await requireUser();

        const services = await prisma.service.findMany({
            where: { enabled: true },
            orderBy: [{ network: "asc" }, { position: "asc" }],
        });

        return NextResponse.json({ services });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
