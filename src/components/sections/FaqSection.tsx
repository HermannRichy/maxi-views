"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionTitle, SectionBorder, GeoRing } from "@/components/ui/futuristic";
import { FAQ } from "@/data/landing";

export default function FaqSection() {
    return (
        <section id="faq" className="relative overflow-hidden py-24 bg-muted/20">
            <GeoRing className="-top-10 right-[8%] opacity-40 -z-10" size={180} />
            <GeoRing className="-bottom-10 left-[8%] opacity-30 -z-10" size={140} />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <SectionTitle subtitle="Vous avez une question ? La réponse est peut-être ici.">
                    Questions <span className="text-primary">fréquentes</span>
                </SectionTitle>

                <Accordion type="single" collapsible className="space-y-3">
                    {FAQ.map((item, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/10 bg-card hover:border-primary/30 transition-colors duration-200"
                        >
                            <AccordionItem
                                value={`faq-${i}`}
                                className="border-0 px-6"
                            >
                                <AccordionTrigger className="text-left font-semibold hover:no-underline text-sm sm:text-base py-4">
                                    {item.q}
                                </AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                                    {item.a}
                                </AccordionContent>
                            </AccordionItem>
                        </div>
                    ))}
                </Accordion>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
