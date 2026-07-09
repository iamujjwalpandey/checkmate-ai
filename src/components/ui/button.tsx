"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "accent";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-brand-600 to-violet-500 text-white shadow-[0_8px_30px_-8px_rgba(99,102,241,0.6)] hover:from-brand-500 hover:to-violet-400 border border-white/10",
  secondary:
    "glass text-slate-100 hover:bg-white/10 border border-white/10",
  outline:
    "border border-white/15 bg-transparent text-slate-200 hover:bg-white/5 hover:border-white/25",
  ghost: "bg-transparent text-slate-300 hover:bg-white/5 hover:text-white",
  danger:
    "bg-red-500/90 text-white hover:bg-red-500 border border-red-400/30",
  accent:
    "bg-gradient-to-r from-accent-500 to-brand-500 text-white shadow-[0_8px_30px_-8px_rgba(34,211,238,0.5)] hover:from-accent-400 hover:to-brand-400 border border-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-xl",
  lg: "h-12 px-6 text-[15px] gap-2 rounded-xl",
  icon: "h-10 w-10 rounded-xl",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "relative inline-flex select-none items-center justify-center whitespace-nowrap font-medium tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
