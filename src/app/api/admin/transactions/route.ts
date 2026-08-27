import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma, TransactionStatus, TransactionType } from "@prisma/client";

/* ─────────────────────────────────────────────────────────────────
   GET /api/admin/transactions
   Liste des transactions (rechargements, commandes, ajustements)
   avec filtres optionnels : type, status, kind (ORD_/DEP_/ADJ_),
   recherche (email, nom, référence).
───────────────────────────────────────────────────────────────── */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin();

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type"); // CREDIT | DEBIT
        const status = searchParams.get("status"); // PENDING | COMPLETED | FAILED
        const kind = searchParams.get("kind"); // ORD | DEP | ADJ
        const search = searchParams.get("search")?.trim();

        const where: Prisma.TransactionWhereInput = {};

        if (type === "CREDIT" || type === "DEBIT") {
            where.type = type as TransactionType;
        }
        if (status === "PENDING" || status === "COMPLETED" || status === "FAILED") {
            where.status = status as TransactionStatus;
        }
        if (kind === "ORD" || kind === "DEP" || kind === "ADJ") {
            where.reference = { startsWith: `${kind}_` };
        }
        if (search) {
            where.OR = [
                { reference: { contains: search, mode: "insensitive" } },
                { user: { email: { contains: search, mode: "insensitive" } } },
                { user: { name: { contains: search, mode: "insensitive" } } },
            ];
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: 300,
            include: { user: { select: { name: true, email: true } } },
        });

        return NextResponse.json({ transactions });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED")
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        if (err instanceof Error && err.message === "FORBIDDEN")
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        console.error("Admin transactions error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
