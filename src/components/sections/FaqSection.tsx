"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ } from "@/data/landing";

export default function FaqSection() {
    return (
        <section id="faq" className="py-24 bg-muted/30">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                        Questions{" "}
                        <span className="text-primary">fréquentes</span>
                    </h2>
                    <p className="text-muted-foreground">
                        Vous avez une question ? La réponse est peut-être ici.
                    </p>
                </div>

                <Accordion type="single" collapsible className="space-y-3">
                    {FAQ.map((item, i) => (
                        <AccordionItem
                            key={i}
                            value={`faq-${i}`}
                            className="border border-border rounded-xl bg-card px-6 overflow-hidden"
                        >
                            <AccordionTrigger className="text-left font-semibold hover:no-underline text-sm sm:text-base">
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                                {item.a}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
