"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
        className,
      )}
    >
      <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-violet-500/10 text-brand-300">
        <Icon className="h-8 w-8" />
        <div className="absolute inset-0 rounded-2xl bg-brand-500/10 blur-xl" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
