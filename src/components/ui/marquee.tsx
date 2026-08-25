import React from "react";

interface MarqueeProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    reverse?: boolean;
}

/** Infinite horizontal scroll ticker — pure CSS animation, no JS cost. */
export function Marquee({
    children,
    className = "",
    duration = 26,
    reverse = false,
}: MarqueeProps) {
    return (
        <div className={`overflow-hidden ${className}`}>
            <div
                className="flex w-max"
                style={{
                    animation: `marquee ${duration}s linear infinite`,
                    animationDirection: reverse ? "reverse" : "normal",
                }}
            >
                <div className="flex shrink-0">{children}</div>
                <div className="flex shrink-0" aria-hidden="true">
                    {children}
                </div>
            </div>
        </div>
    );
}
