"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FuturisticCard, SectionTitle } from "@/components/ui/futuristic";
import {
    IconMail,
    IconMessageCircle,
    IconClock,
    IconArrowRight,
    IconSend,
    IconBolt,
} from "@tabler/icons-react";

/* ─────────────────────────────────────────────────────────────────
   Info cards
───────────────────────────────────────────────────────────────── */
const CONTACT_INFO = [
    {
        Icon: IconMail,
        title: "Email",
        value: "support@maxiviews.me",
        desc: "Réponse sous 24h",
    },
    {
        Icon: IconMessageCircle,
        title: "Chat en direct",
        value: "Via le dashboard",
        desc: "Disponible une fois connecté",
    },
    {
        Icon: IconClock,
        title: "Support",
        value: "24h / 7j",
        desc: "Toujours disponible",
    },
];

/* ─────────────────────────────────────────────────────────────────
   Contact Form
───────────────────────────────────────────────────────────────── */
function ContactForm() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;
        setLoading(true);

        try {
            await emailjs.sendForm(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                formRef.current,
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
            );
            toast.success("Message envoyé ! Nous vous répondons sous 24h.");
            formRef.current.reset();
        } catch (error) {
            console.error("EmailJS Error:", error);
            toast.error("Échec de l'envoi. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <FuturisticCard className="p-8">
            <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <IconSend className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg">
                    Envoyez-nous un message
                </h3>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="user_name" className="text-sm">
                            Nom complet
                        </Label>
                        <Input
                            id="user_name"
                            name="user_name"
                            placeholder="Jean Dupont"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="user_email" className="text-sm">
                            Email
                        </Label>
                        <Input
                            id="user_email"
                            name="user_email"
                            type="email"
                            placeholder="jean@exemple.com"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="user_subject" className="text-sm">
                        Sujet
                    </Label>
                    <Input
                        id="user_subject"
                        name="user_subject"
                        placeholder="En quoi peut-on vous aider ?"
                        required
                    />
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="message" className="text-sm">
                        Message
                    </Label>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Décrivez votre demande..."
                        rows={5}
                        required
                        className="resize-none"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Envoi en cours..." : "Envoyer le message"}
                        <IconArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </FuturisticCard>
    );
}

/* ─────────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────────── */
export default function ContactPage() {
    return (
        <main className="min-h-screen bg-background text-foreground pt-24 pb-16">
            {/* Background glow */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[100px]" />
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back link */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                    >
                        <IconArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        Retour à l&apos;accueil
                    </Link>
                </div>

                <SectionTitle subtitle="Notre équipe est disponible 24h/7j pour répondre à vos questions.">
                    Contactez-<span className="text-primary">nous</span>
                </SectionTitle>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── Left: info cards ── */}
                    <div className="space-y-4">
                        {CONTACT_INFO.map((info) => (
                            <FuturisticCard key={info.title} className="p-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <info.Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                                            {info.title}
                                        </p>
                                        <p className="font-bold text-sm">
                                            {info.value}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {info.desc}
                                        </p>
                                    </div>
                                </div>
                            </FuturisticCard>
                        ))}

                        {/* Quick tip */}
                        <FuturisticCard className="p-5 bg-primary/5">
                            <div className="flex items-start gap-3">
                                <IconBolt className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-semibold text-sm mb-1">
                                        Conseil rapide
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Pour les questions sur une commande,
                                        incluez son ID dans votre message pour
                                        une réponse plus rapide.
                                    </p>
                                </div>
                            </div>
                        </FuturisticCard>
                    </div>

                    {/* ── Right: form ── */}
                    <div className="lg:col-span-2">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </main>
    );
}
