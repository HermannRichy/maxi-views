import React from "react";

/* ────────────────────────────────────────────────────────────────────
   CLIP-PATH CONSTANTS
   ──────────────────────────────────────────────────────────────────── */
/** Chamfer size in px */
const C = {
    sm: 8,
    md: 12,
    lg: 18,
};

const poly = (tl: number, tr: number, br: number, bl: number) =>
    `polygon(
    ${tl}px 0,
    calc(100% - ${tr}px) 0,
    100% ${tr}px,
    100% calc(100% - ${br}px),
    calc(100% - ${br}px) 100%,
    ${bl}px 100%,
    0 calc(100% - ${bl}px),
    0 ${tl}px
  )`;

/** Top-right chamfer only */
export const CLIP_TR_SM = poly(0, C.sm, 0, 0);
export const CLIP_TR_MD = poly(0, C.md, 0, 0);
export const CLIP_TR_LG = poly(0, C.lg, 0, 0);

/** Top-right + bottom-left double chamfer */
export const CLIP_DUAL_SM = poly(0, C.sm, 0, C.sm);
export const CLIP_DUAL_MD = poly(0, C.md, 0, C.md);
export const CLIP_DUAL_LG = poly(0, C.lg, 0, C.lg);

/** All four corners chamfered */
export const CLIP_ALL_SM = poly(C.sm, C.sm, C.sm, C.sm);
export const CLIP_ALL_MD = poly(C.md, C.md, C.md, C.md);

/* ────────────────────────────────────────────────────────────────────
   CORNER BRACKET SVG
   ──────────────────────────────────────────────────────────────────── */
interface CornerBracketProps {
    size?: number;
    thickness?: number;
    className?: string;
    /** rotate: tl=0, tr=90, br=180, bl=270 */
    rotate?: 0 | 90 | 180 | 270;
}

export function CornerBracket({
    size = 8,
    thickness = 1.5,
    className = "",
    rotate = 0,
}: CornerBracketProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            fill="none"
            className={className}
            style={{ transform: `rotate(${rotate}deg)` }}
        >
            <path
                d={`M ${size} ${thickness / 2} H ${thickness / 2} V ${size}`}
                stroke="currentColor"
                strokeWidth={thickness}
            />
        </svg>
    );
}

/* ────────────────────────────────────────────────────────────────────
   FUTURISTIC CARD
   ──────────────────────────────────────────────────────────────────── */
interface FuturisticCardProps {
    children: React.ReactNode;
    className?: string;
    clip?: string;
    /** Show corner brackets */
    brackets?: boolean;
    bracketSize?: number;
}

export function FuturisticCard({
    children,
    className = "",
    clip = CLIP_TR_MD,
    brackets = true,
    bracketSize = 9,
}: FuturisticCardProps) {
    return (
        <div className="relative group">
            {/* 1-px border layer */}
            <div
                className="absolute inset-0 bg-border/40 group-hover:bg-primary/20 transition-colors duration-300"
                style={{ clipPath: clip }}
            />
            {/* Content layer */}
            <div
                className={`relative bg-card group-hover:bg-accent/50 transition-colors duration-300 m-[1px] ${className}`}
                style={{ clipPath: clip }}
            >
                {children}
            </div>

            {/* Corner brackets */}
            {brackets && (
                <>
                    <CornerBracket
                        size={bracketSize}
                        className="absolute top-1 left-1 text-primary/30 group-hover:text-primary/60 transition-colors"
                        rotate={0}
                    />
                    <CornerBracket
                        size={bracketSize}
                        className="absolute bottom-1 right-1 text-primary/30 group-hover:text-primary/60 transition-colors"
                        rotate={180}
                    />
                </>
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────
   SECTION TITLE
   ──────────────────────────────────────────────────────────────────── */
interface SectionTitleProps {
    children: React.ReactNode;
    subtitle?: React.ReactNode;
    className?: string;
}

export function SectionTitle({
    children,
    subtitle,
    className = "",
}: SectionTitleProps) {
    return (
        <div className={`text-center mb-16 ${className}`}>
            {/* Top decorator */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
                <div className="w-1.5 h-1.5 bg-primary rotate-45" />
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black mb-4">
                {children}
            </h2>
            {subtitle && (
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    {subtitle}
                </p>
            )}
        </div>
    );
}

/* ────────────────────────────────────────────────────────────────────
   SECTION BORDER (top/bottom decorative line with notch)
   ──────────────────────────────────────────────────────────────────── */
export function SectionBorder({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center h-px ${className}`}>
            <div className="flex-1 bg-border/40" />
            <div className="flex items-center gap-1 px-3">
                <div className="w-1 h-1 bg-primary/30 rotate-45" />
                <div className="w-3 h-px bg-primary/20" />
                <div className="w-1 h-1 bg-primary/60 rotate-45" />
                <div className="w-3 h-px bg-primary/20" />
                <div className="w-1 h-1 bg-primary/30 rotate-45" />
            </div>
            <div className="flex-1 bg-border/40" />
        </div>
    );
}
