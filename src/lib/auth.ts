import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { headers } from "next/headers";
import prisma from "./prisma";
import { sendVerificationOtpEmail } from "./emails";

export const auth = betterAuth({
    database: prismaAdapter(prisma, { provider: "postgresql" }),
    baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    secret: process.env.BETTER_AUTH_SECRET!,

    // Le domaine apex redirige vers www (ou inversement) au niveau de
    // l'hébergeur : ces deux variantes doivent donc rester acceptées ici,
    // même si NEXT_PUBLIC_APP_URL ne pointe que sur l'une des deux.
    trustedOrigins: ["https://maxiviews.me", "https://www.maxiviews.me"],

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },

    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },

    plugins: [
        emailOTP({
            otpLength: 6,
            expiresIn: 300,
            allowedAttempts: 3,
            sendVerificationOnSignUp: true,
            overrideDefaultEmailVerification: true,
            sendVerificationOTP: async ({ email, otp, type }) => {
                await sendVerificationOtpEmail({ email, otp, type });
            },
        }),
        nextCookies(), // doit rester le dernier plugin de la liste
    ],
});

export type Session = typeof auth.$Infer.Session;

/* ─────────────────────────────────────────────────────────────────
   Contrat préservé pour le reste de l'app — NE PAS changer ces
   signatures. 11 fichiers en aval dépendent de getCurrentUser()
   renvoyant la ligne Prisma User complète (ou null), et de
   requireUser()/requireAdmin() qui lancent exactement
   Error("UNAUTHENTICATED") / Error("FORBIDDEN").
───────────────────────────────────────────────────────────────── */

export async function getCurrentUser() {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    return user;
}

export async function requireUser() {
    const user = await getCurrentUser();
    if (!user) throw new Error("UNAUTHENTICATED");
    return user;
}

export async function requireAdmin() {
    const user = await requireUser();
    if (user.role !== "ADMIN") throw new Error("FORBIDDEN");
    return user;
}
