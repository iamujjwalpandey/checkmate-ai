"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  note?: string;
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  className,
  disabled,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-10 w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 text-left text-sm text-slate-100 transition-colors hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-400/30 disabled:opacity-50",
        )}
      >
        <span className={cn("truncate", !selected && "text-slate-500")}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-white/10 bg-navy-850/95 p-1 shadow-2xl backdrop-blur-xl no-scrollbar">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onValueChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  active ? "bg-brand-500/15 text-white" : "text-slate-300 hover:bg-white/5",
                )}
              >
                <span className="min-w-0">
                  <span className="block truncate">{opt.label}</span>
                  {opt.note && (
                    <span className="block truncate text-[11px] text-slate-500">{opt.note}</span>
                  )}
                </span>
                {active && <Check className="h-4 w-4 shrink-0 text-brand-300" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
