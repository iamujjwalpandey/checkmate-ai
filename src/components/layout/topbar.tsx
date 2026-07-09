"use client";

import Link from "next/link";
import { Menu, Settings as SettingsIcon, Search, Sparkles, Zap } from "lucide-react";
import { useSettings } from "@/components/providers/settings";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const { activeProviderLabel, activeModel, hasAnyKey, settings } = useSettings();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-white/8 bg-navy-950/70 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-slate-300 hover:bg-white/5 lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <Link
        href="/generate"
        className="group hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-400 transition-colors hover:border-white/20 hover:text-slate-200 md:flex md:w-72"
      >
        <Search className="h-4 w-4 text-slate-500 group-hover:text-brand-300" />
        <span className="flex-1 truncate text-left">Generate or explore projects…</span>
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-slate-500">
          ⌘K
        </kbd>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {settings.freeTierOnly && (
          <Badge variant="success" className="hidden sm:inline-flex">
            <Sparkles className="h-3 w-3" /> Free Tier Only
          </Badge>
        )}

        <div
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
            hasAnyKey
              ? "border-brand-400/25 bg-brand-500/10 text-brand-200"
              : "border-amber-400/25 bg-amber-500/10 text-amber-200",
          )}
          title={hasAnyKey ? `Active model: ${activeModel}` : "No API key set"}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              hasAnyKey ? "bg-emerald-400 animate-pulse-glow" : "bg-amber-400",
            )}
          />
          <span className="hidden font-medium sm:inline">{activeProviderLabel}</span>
          {hasAnyKey && (
            <span className="hidden items-center gap-1 text-slate-400 lg:inline-flex">
              <Zap className="h-3 w-3" />
              {activeModel}
            </span>
          )}
        </div>

        <Link
          href="/settings"
          className="rounded-lg border border-white/10 bg-white/[0.03] p-2 text-slate-300 transition-colors hover:border-white/20 hover:text-white"
          aria-label="Settings"
        >
          <SettingsIcon className="h-[18px] w-[18px]" />
        </Link>
      </div>
    </header>
  );
}
