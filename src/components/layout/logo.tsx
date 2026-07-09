import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-500 via-violet-500 to-accent-500 shadow-[0_8px_24px_-8px_rgba(99,102,241,0.7)]">
        <Crown className="h-[18px] w-[18px] text-white" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent-400 animate-pulse-glow" />
      </div>
      {!compact && (
        <div className="leading-none">
          <p className="font-display text-[15px] font-bold tracking-[-0.02em] text-white">
            CHECKMATE<span className="text-gradient-accent"> AI</span>
          </p>
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Project Architect
          </p>
        </div>
      )}
    </div>
  );
}
