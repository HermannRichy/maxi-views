import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactMessage } from "@/lib/emails";

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as {
            name?: string;
            email?: string;
            subject?: string;
            message?: string;
        };
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Champs manquants" },
                { status: 400 },
            );
        }

        await prisma.contactMessage.create({
            data: { name, email, subject, message },
        });
        await sendContactMessage({ name, email, subject, message });

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Contact form error:", err);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
