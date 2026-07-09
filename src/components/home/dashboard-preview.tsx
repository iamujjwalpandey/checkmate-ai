"use client";

import { motion } from "framer-motion";
import { Sparkles, Star, Zap, Crown, Wand2 } from "lucide-react";

const BARS = [
  { label: "Resume Impact", value: 94, color: "#818cf8" },
  { label: "GitHub Value", value: 88, color: "#22d3ee" },
  { label: "Recruiter", value: 96, color: "#a855f7" },
  { label: "Startup", value: 91, color: "#34d399" },
];

const CARDS = [
  { name: "Realtime Voice SRE Copilot", score: 9.6, tag: "AI Agents" },
  { name: "AI Bookkeeping for Creators", score: 9.0, tag: "FinTech" },
  { name: "Threat Intel Dashboard", score: 9.3, tag: "Security" },
];

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-4xl"
    >
      <div className="glass-strong relative overflow-hidden rounded-[26px] p-1.5 shadow-[0_50px_140px_-45px_rgba(99,102,241,0.55)]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-accent-500/15 blur-3xl" />

        <div className="relative rounded-[20px] border border-white/8 bg-navy-900/80">
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            </div>
            <div className="ml-3 flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400">
              <Crown className="h-3 w-3 text-brand-300" /> checkmate.ai/generate
            </div>
            <div className="ml-auto flex items-center gap-1 rounded-full border border-brand-400/25 bg-brand-500/10 px-2 py-0.5 text-[10px] text-brand-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-glow" /> Gemini
              <Zap className="h-3 w-3" /> 2.5 Flash
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3">
            {/* scores panel */}
            <div className="glass rounded-2xl p-4 sm:col-span-1">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-300" />
                <span className="font-display text-xs font-semibold text-white">Impact Scores</span>
              </div>
              <div className="flex flex-col gap-3">
                {BARS.map((b, i) => (
                  <div key={b.label}>
                    <div className="mb-1 flex justify-between text-[11px] text-slate-400">
                      <span>{b.label}</span>
                      <span className="tabular" style={{ color: b.color }}>
                        {(b.value / 10).toFixed(1)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: b.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${b.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.1, delay: i * 0.12, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* idea cards */}
            <div className="flex flex-col gap-3 sm:col-span-2">
              {CARDS.map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.13, ease: [0.22, 1, 0.36, 1] }}
                  className="glass flex items-center justify-between gap-3 rounded-2xl p-4"
                >
                  <div className="min-w-0">
                    <div className="mb-1 inline-flex rounded-full border border-brand-400/25 bg-brand-500/10 px-2 py-0.5 text-[10px] text-brand-200">
                      {c.tag}
                    </div>
                    <p className="truncate font-display text-sm font-semibold text-white">
                      {c.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-lg border border-amber-400/25 bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-300">
                    <Star className="h-3 w-3 fill-amber-300" /> {c.score}
                  </div>
                </motion.div>
              ))}
              <div className="glass flex items-center justify-center gap-2 rounded-2xl border-dashed py-3 text-xs text-slate-500">
                <Wand2 className="h-3.5 w-3.5 text-violet-300" /> Master prompt ready to paste →
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
