"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fades + slides in every `[data-reveal]` descendant of the returned ref
 * as it scrolls into view, staggered. Attach the ref to the section root.
 */
export function useScrollReveal<T extends HTMLElement>() {
    const scopeRef = useRef<T>(null);

    useGSAP(
        () => {
            const targets = gsap.utils.toArray<HTMLElement>(
                "[data-reveal]",
                scopeRef.current,
            );
            if (!targets.length) return;

            gsap.set(targets, { autoAlpha: 0, y: 40 });

            ScrollTrigger.batch(targets, {
                start: "top 85%",
                once: true,
                onEnter: (batch) =>
                    gsap.to(batch, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.7,
                        ease: "power3.out",
                        stagger: 0.1,
                        overwrite: true,
                    }),
            });
        },
        { scope: scopeRef },
    );

    return scopeRef;
}
