"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  Wand2,
  Bookmark,
  Settings as SettingsIcon,
  GraduationCap,
  X,
  type LucideIcon,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Sparkles,
  Compass,
  Wand2,
  Bookmark,
  Settings: SettingsIcon,
  GraduationCap,
};

export function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const content = (
    <div className="flex h-full flex-col gap-2 p-4">
      <div className="flex items-center justify-between px-1.5 pb-2">
        <Link href="/" onClick={() => onOpenChange(false)}>
          <Logo />
        </Link>
        <button
          onClick={() => onOpenChange(false)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Workspace
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.icon] ?? Sparkles;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onOpenChange(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-gradient-to-r from-brand-500/15 to-transparent text-white"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100",
              )}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-400 to-violet-400"
                />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] transition-colors",
                  active ? "text-brand-300" : "text-slate-500 group-hover:text-slate-300",
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-2 rounded-xl border border-white/8 bg-gradient-to-br from-brand-500/10 to-violet-500/5 p-4">
        <p className="text-sm font-semibold text-white">Ship faster</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          Turn ideas into build-ready prompts for Lovable, Bolt, Cursor & more.
        </p>
        <Link
          href="/generate"
          onClick={() => onOpenChange(false)}
          className="mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-violet-500 text-xs font-semibold text-white transition-colors hover:from-brand-400 hover:to-violet-400"
        >
          Generate Ideas
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[264px] border-r border-white/8 bg-navy-900/60 backdrop-blur-xl lg:block">
        {content}
      </aside>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-navy-900 lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
            >
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
