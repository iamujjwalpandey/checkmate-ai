"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADING_MESSAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function LoadingState({
  messages = LOADING_MESSAGES,
  label,
  className,
}: {
  messages?: string[];
  label?: string;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % messages.length), 1900);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className={cn("flex flex-col items-center justify-center gap-5 px-6 py-16 text-center", className)}>
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand-500/20" />
        <div className="relative grid h-14 w-14 place-items-center rounded-full border border-brand-400/30 bg-brand-500/10">
          <Loader2 className="h-6 w-6 animate-spin text-brand-300" />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium text-slate-200"
        >
          {messages[i]}
        </motion.p>
      </AnimatePresence>
      {label && <p className="text-xs text-slate-500">{label}</p>}
    </div>
  );
}
