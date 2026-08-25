import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

const kingred = localFont({
    src: "./fonts/kingred.otf",
    variable: "--font-kingred",
    display: "swap",
});

const satoshi = localFont({
    src: "./fonts/satoshi.otf",
    variable: "--font-satoshi",
    display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://maxiviews.me";
const title = "Maxi Views — Boostez votre présence sur les réseaux sociaux";
const description =
    "Achetez des vues, likes, followers et abonnés pour TikTok, Instagram, YouTube, Facebook et bien d'autres. Livraison instantanée, paiement Mobile Money.";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: title,
        template: "%s | Maxi Views",
    },
    description,
    keywords: [
        "SMM panel",
        "vues TikTok",
        "followers Instagram",
        "likes réseaux sociaux",
        "booster réseaux sociaux Afrique",
        "abonnés YouTube",
        "Mobile Money",
    ],
    authors: [{ name: "Maxi Views" }],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title,
        description,
        url: siteUrl,
        siteName: "Maxi Views",
        images: [
            {
                url: "/og-img.jpg",
                width: 3000,
                height: 2000,
                alt: "Maxi Views — Plateforme SMM",
            },
        ],
        locale: "fr_FR",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["/og-img.jpg"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="fr" suppressHydrationWarning>
                <body
                    className={`${kingred.variable} ${satoshi.variable} antialiased font-sans`}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster position="top-center" />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
