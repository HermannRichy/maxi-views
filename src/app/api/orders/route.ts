import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireUser } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendOrderCreatedUser, sendOrderCreatedAdmin } from "@/lib/emails";
import { checkAndNotifyRevenueMilestone } from "@/lib/revenue";

/* ─────────────────────────────────────────────────────────────────
   POST /api/orders — Créer une commande
───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
    try {
        const user = await requireUser();

        const body = (await req.json()) as {
            network: string;
            serviceName: string;
            serviceId?: string;
            link: string;
            quantity: number;
            amount: number;
        };

        const { network, serviceName, serviceId, link, quantity, amount } =
            body;

        // Validation basique
        if (!network || !serviceName || !link || !quantity || !amount) {
            return NextResponse.json(
                { error: "Champs manquants" },
                { status: 400 },
            );
        }

        if (amount < 1) {
            return NextResponse.json(
                { error: "Montant invalide" },
                { status: 400 },
            );
        }

        // Vérifier le solde
        if (user.balance < amount) {
            return NextResponse.json(
                {
                    error: "Solde insuffisant — veuillez recharger votre compte",
                },
                { status: 402 },
            );
        }

        const orderId = crypto.randomUUID();
        const reference = `ORD_${user.id}_${Date.now()}`;

        // Créer la commande + débit dans une transaction atomique
        const [order] = await prisma.$transaction([
            prisma.order.create({
                data: {
                    id: orderId,
                    userId: user.id,
                    network,
                    serviceName,
                    serviceId: serviceId ?? null,
                    link,
                    quantity,
                    amount,
                    status: "PENDING",
                },
            }),
            prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount,
                    type: "DEBIT",
                    status: "COMPLETED",
                    reference,
                    orderId,
                },
            }),
            prisma.user.update({
                where: { id: user.id },
                data: { balance: { decrement: amount } },
            }),
        ]);

        // Emails de notification (non bloquants)
        Promise.all([
            sendOrderCreatedUser({
                to: user.email,
                name: user.name ?? "Utilisateur",
                orderId: order.id,
                serviceName,
                network,
                quantity,
                amount,
            }),
            sendOrderCreatedAdmin({
                orderId: order.id,
                userName: user.name ?? "Utilisateur",
                userEmail: user.email,
                serviceName,
                network,
                quantity,
                amount,
                link,
            }),
        ]).catch(console.error);

        checkAndNotifyRevenueMilestone().catch(console.error);

        return NextResponse.json({ order }, { status: 201 });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        console.error("Create order error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

/* ─────────────────────────────────────────────────────────────────
   GET /api/orders — Commandes du user connecté
───────────────────────────────────────────────────────────────── */
export async function GET() {
    try {
        const user = await requireUser();

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ orders });
    } catch (err) {
        if (err instanceof Error && err.message === "UNAUTHENTICATED") {
            return NextResponse.json(
                { error: "Non authentifié" },
                { status: 401 },
            );
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
