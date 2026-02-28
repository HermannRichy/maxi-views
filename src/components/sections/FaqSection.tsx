"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    SectionTitle,
    SectionBorder,
    CornerBracket,
    CLIP_TR_SM,
} from "@/components/ui/futuristic";
import { FAQ } from "@/data/landing";

export default function FaqSection() {
    return (
        <section id="faq" className="py-24 bg-muted/20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionTitle subtitle="Vous avez une question ? La réponse est peut-être ici.">
                    Questions <span className="text-primary">fréquentes</span>
                </SectionTitle>

                <Accordion type="single" collapsible className="space-y-3">
                    {FAQ.map((item, i) => (
                        <div key={i} className="relative group">
                            {/* Border layer */}
                            <div
                                className="absolute inset-0 bg-border/40 group-hover:bg-primary/20 transition-colors duration-200"
                                style={{ clipPath: CLIP_TR_SM }}
                            />
                            {/* Content */}
                            <div
                                className="relative bg-card m-[1px]"
                                style={{ clipPath: CLIP_TR_SM }}
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
                            {/* Chamfer accent triangle */}
                            <svg
                                className="absolute top-0 right-0 text-primary/30 group-hover:text-primary/50 transition-colors"
                                width="10"
                                height="10"
                                viewBox="0 0 10 10"
                                fill="none"
                            >
                                <path
                                    d="M 10 0 L 0 10 L 10 10 Z"
                                    fill="currentColor"
                                />
                            </svg>
                            <CornerBracket
                                size={7}
                                className="absolute bottom-1 left-1 text-primary/20 group-hover:text-primary/40 transition-colors"
                                rotate={270}
                            />
                        </div>
                    ))}
                </Accordion>
            </div>
            <SectionBorder className="mt-24" />
        </section>
    );
}
