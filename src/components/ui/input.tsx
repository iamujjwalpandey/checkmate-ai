import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus:border-brand-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-brand-400/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[90px] w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 transition-colors focus:border-brand-400/60 focus:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-brand-400/20 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-slate-400",
        className,
      )}
      {...props}
    />
  );
}
