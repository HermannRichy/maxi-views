import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

/* ─────────────────────────────────────────────────────────────────
   PATCH /api/admin/services/[id] — modifier un service
   DELETE /api/admin/services/[id] — supprimer un service
───────────────────────────────────────────────────────────────── */
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const body = (await req.json()) as {
            unitPrice?: number;
            minQty?: number;
            step?: number;
            note?: string | null;
            enabled?: boolean;
        };

        const service = await prisma.service.findUnique({ where: { id } });
        if (!service) {
            return NextResponse.json(
                { error: "Service introuvable" },
                { status: 404 },
            );
        }

        const updated = await prisma.service.update({
            where: { id },
            data: {
                ...(body.unitPrice !== undefined ? { unitPrice: body.unitPrice } : {}),
                ...(body.minQty !== undefined ? { minQty: body.minQty } : {}),
                ...(body.step !== undefined ? { step: body.step } : {}),
                ...(body.note !== undefined ? { note: body.note || null } : {}),
                ...(body.enabled !== undefined ? { enabled: body.enabled } : {}),
            },
        });

        return NextResponse.json({ service: updated });
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
        console.error("Patch service error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        await requireAdmin();
        const { id } = await params;

        const service = await prisma.service.findUnique({ where: { id } });
        if (!service) {
            return NextResponse.json(
                { error: "Service introuvable" },
                { status: 404 },
            );
        }

        await prisma.service.delete({ where: { id } });

        return NextResponse.json({ ok: true });
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
        console.error("Delete service error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
