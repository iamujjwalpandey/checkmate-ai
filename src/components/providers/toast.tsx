"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { ToastMessage } from "@/types";
import { uid, cn } from "@/lib/utils";

interface ToastCtx {
  toast: (t: Omit<ToastMessage, "id">) => void;
}
const Ctx = React.createContext<ToastCtx | null>(null);

export function useToast() {
  const c = React.useContext(Ctx);
  if (!c) return { toast: () => {} };
  return c;
}

const icons = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  default: Info,
};
const accent = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  default: "text-brand-300",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const toast = React.useCallback((t: Omit<ToastMessage, "id">) => {
    const id = uid("toast");
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 4600);
  }, []);

  const remove = React.useCallback(
    (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id)),
    [],
  );

  return (
    <Ctx.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex w-[min(92vw,360px)] flex-col gap-2">
            <AnimatePresence>
              {toasts.map((t) => {
                const variant = t.variant ?? "default";
                const Icon = icons[variant];
                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, x: 40, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="glass-strong pointer-events-auto flex items-start gap-3 rounded-xl p-3.5 shadow-2xl"
                  >
                    <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", accent[variant])} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{t.title}</p>
                      {t.description && (
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                          {t.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => remove(t.id)}
                      className="rounded p-0.5 text-slate-500 transition-colors hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}
