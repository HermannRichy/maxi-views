import React from "react";

/* ────────────────────────────────────────────────────────────────────
   LEGACY CLIP-PATH CONSTANTS (deprecated)
   Kept as no-op empty strings so any remaining `style={{ clipPath: ... }}`
   call site silently renders without a clip instead of breaking. Clean
   these call sites up opportunistically as each file is revisited.
   ──────────────────────────────────────────────────────────────────── */
export const CLIP_TR_SM = "";
export const CLIP_TR_MD = "";
export const CLIP_TR_LG = "";
export const CLIP_DUAL_SM = "";
export const CLIP_DUAL_MD = "";
export const CLIP_DUAL_LG = "";
export const CLIP_ALL_SM = "";
export const CLIP_ALL_MD = "";

/* ────────────────────────────────────────────────────────────────────
   CORNER BRACKET (deprecated — renders nothing)
   ──────────────────────────────────────────────────────────────────── */
interface CornerBracketProps {
    size?: number;
    thickness?: number;
    className?: string;
    rotate?: 0 | 90 | 180 | 270;
}

export const CornerBracket: React.FC<CornerBracketProps> = () => null;

/* ────────────────────────────────────────────────────────────────────
   FUTURISTIC CARD → now a soft rounded glass/glow card
   ──────────────────────────────────────────────────────────────────── */
interface FuturisticCardProps {
    children: React.ReactNode;
    className?: string;
    /** @deprecated no longer used — kept for call-site compatibility */
    clip?: string;
    /** @deprecated no longer used — kept for call-site compatibility */
    brackets?: boolean;
    /** @deprecated no longer used — kept for call-site compatibility */
    bracketSize?: number;
}

export function FuturisticCard({
    children,
    className = "",
}: FuturisticCardProps) {
    return (
        <div
            className={`rounded-2xl border border-white/10 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_-12px_var(--primary)] ${className}`}
        >
            {children}
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
                <div className="w-2 h-2 rounded-full bg-primary blur-[1px]" />
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
   SECTION BORDER (soft gradient divider)
   ──────────────────────────────────────────────────────────────────── */
export function SectionBorder({ className = "" }: { className?: string }) {
    return (
        <div
            className={`h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent ${className}`}
        />
    );
}

/* ────────────────────────────────────────────────────────────────────
   DECORATIVE PRIMITIVES — soft violet glow blobs, dot-grid backdrop
   and doodle accents used across sections/pages.
   ──────────────────────────────────────────────────────────────────── */
interface GlowOrbProps {
    className?: string;
    size?: number;
    blur?: number;
}

/** Soft blurred violet glow orb, absolutely positioned by the caller via className. */
export function GlowOrb({ className = "", size = 500, blur = 120 }: GlowOrbProps) {
    return (
        <div
            className={`absolute rounded-full bg-primary/10 pointer-events-none ${className}`}
            style={{ width: size, height: size, filter: `blur(${blur}px)` }}
        />
    );
}

/** Subtle grid-line backdrop, absolutely positioned by the caller via className. */
export function GridBackdrop({ className = "" }: { className?: string }) {
    return (
        <div
            className={`absolute inset-0 opacity-[0.03] pointer-events-none ${className}`}
            style={{
                backgroundImage:
                    "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                backgroundSize: "60px 60px",
            }}
        />
    );
}

/** Faint hand-drawn-style wavy line accent, in soft violet. */
export function Doodle({ className = "" }: { className?: string }) {
    return (
        <svg
            className={`pointer-events-none ${className}`}
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
        >
            <path
                d="M0,40 Q20,10 40,40 T80,40 T120,40"
                stroke="var(--primary)"
                strokeOpacity="0.18"
                strokeWidth="2"
                fill="none"
            />
        </svg>
    );
}

/** Soft outlined ring, a subtle nod to geometric cut-out shapes. */
export function RingOutline({ className = "", size = 200 }: { className?: string; size?: number }) {
    return (
        <div
            className={`absolute rounded-full border border-primary/10 pointer-events-none ${className}`}
            style={{ width: size, height: size }}
        />
    );
}
