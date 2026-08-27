import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   GET /api/admin/services — tous les services (actifs + désactivés)
   POST /api/admin/services — créer un nouveau service
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        await requireAdmin();

        const services = await prisma.service.findMany({
            orderBy: [{ network: "asc" }, { position: "asc" }],
        });

        return NextResponse.json({ services });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 },
            );
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await requireAdmin();

        const body = (await req.json()) as {
            network?: string;
            name?: string;
            unitPrice?: number;
            minQty?: number;
            step?: number;
            note?: string;
        };
        const { network, name, unitPrice, minQty, step, note } = body;

        if (!network || !name || !unitPrice || !minQty || !step) {
            return NextResponse.json(
                { error: "Champs manquants (réseau, nom, prix, quantité min, pas)" },
                { status: 400 },
            );
        }

        const maxPosition = await prisma.service.aggregate({
            where: { network },
            _max: { position: true },
        });

        const service = await prisma.service.create({
            data: {
                network,
                name,
                unitPrice,
                minQty,
                step,
                note: note || null,
                position: (maxPosition._max.position ?? -1) + 1,
            },
        });

        return NextResponse.json({ service });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json(
                { error: "Accès refusé" },
                { status: 403 },
            );
        if (
            err &&
            typeof err === "object" &&
            "code" in err &&
            err.code === "P2002"
        ) {
            return NextResponse.json(
                { error: "Ce service existe déjà pour ce réseau" },
                { status: 409 },
            );
        }
        console.error("Create service error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
