"use client";

import type { RefObject } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Adds a subtle 3D pointer-tilt to every `[data-tilt]` descendant of `scopeRef`.
 * Pass the same ref used by `useScrollReveal` to layer both behaviors.
 */
export function useTiltCards(
    scopeRef: RefObject<HTMLElement | null>,
    strength = 8,
) {
    useGSAP(
        () => {
            const cards = gsap.utils.toArray<HTMLElement>(
                "[data-tilt]",
                scopeRef.current,
            );
            const cleanups: (() => void)[] = [];

            cards.forEach((card) => {
                const rotateX = gsap.quickTo(card, "rotateX", {
                    duration: 0.4,
                    ease: "power3.out",
                });
                const rotateY = gsap.quickTo(card, "rotateY", {
                    duration: 0.4,
                    ease: "power3.out",
                });

                const onMove = (e: PointerEvent) => {
                    const rect = card.getBoundingClientRect();
                    const px = (e.clientX - rect.left) / rect.width - 0.5;
                    const py = (e.clientY - rect.top) / rect.height - 0.5;
                    rotateY(px * strength);
                    rotateX(-py * strength);
                };
                const onLeave = () => {
                    rotateX(0);
                    rotateY(0);
                };

                card.style.transformStyle = "preserve-3d";
                card.addEventListener("pointermove", onMove);
                card.addEventListener("pointerleave", onLeave);
                cleanups.push(() => {
                    card.removeEventListener("pointermove", onMove);
                    card.removeEventListener("pointerleave", onLeave);
                });
            });

            return () => cleanups.forEach((fn) => fn());
        },
        { scope: scopeRef },
    );
}
