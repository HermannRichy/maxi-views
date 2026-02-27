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

export const metadata: Metadata = {
    title: "Maxi Views",
    description:
        "Achetez des followers, likes et vues pour vos réseaux sociaux",
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
