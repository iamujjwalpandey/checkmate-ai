import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "brand" | "accent" | "violet" | "success" | "warning" | "danger" | "outline";

const variants: Record<BadgeVariant, string> = {
  default: "bg-white/8 text-slate-300 border-white/10",
  brand: "bg-brand-500/15 text-brand-300 border-brand-400/25",
  accent: "bg-accent-500/15 text-accent-300 border-accent-400/25",
  violet: "bg-violet-500/15 text-violet-300 border-violet-400/25",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
  warning: "bg-amber-500/15 text-amber-300 border-amber-400/25",
  danger: "bg-red-500/15 text-red-300 border-red-400/25",
  outline: "bg-transparent text-slate-300 border-white/15",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-tight",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export function Separator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-px w-full bg-white/8", className)} {...props} />;
}
