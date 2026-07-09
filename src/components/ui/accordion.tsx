"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className={cn(
              "overflow-hidden rounded-xl border transition-colors",
              isOpen ? "border-brand-400/30 bg-white/[0.04]" : "border-white/8 bg-white/[0.02]",
            )}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
            >
              <span className="text-sm font-medium text-slate-100">{item.title}</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                  isOpen && "rotate-180 text-brand-300",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm leading-relaxed text-slate-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
