"use client";

import { motion } from "framer-motion";
import type { Scores } from "@/types";
import { cn, scoreColor, avg } from "@/lib/utils";

const LABELS: Record<keyof Scores, string> = {
  resumeImpact: "Resume Impact",
  githubValue: "GitHub Value",
  recruiterImpression: "Recruiter Impression",
  marketRelevance: "Market Relevance",
  startupPotential: "Startup Potential",
};

export function ScoreGrid({ scores, className }: { scores: Scores; className?: string }) {
  const entries = Object.entries(scores) as [keyof Scores, number][];
  return (
    <div className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2", className)}>
      {entries.map(([k, v]) => {
        const color = scoreColor(v);
        const pct = Math.max(4, Math.round(v * 10));
        return (
          <div key={k}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">{LABELS[k]}</span>
              <span className="font-semibold" style={{ color }}>
                {Number(v).toFixed(1)}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ScoreBadges({ scores }: { scores: Scores }) {
  const overall = avg(Object.values(scores));
  const color = scoreColor(overall);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
        style={{ color, borderColor: `${color}40`, backgroundColor: `${color}1a` }}
      >
        ★ {overall.toFixed(1)}
      </span>
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
        Resume {Number(scores.resumeImpact).toFixed(1)}
      </span>
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
        GitHub {Number(scores.githubValue).toFixed(1)}
      </span>
      <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-slate-400">
        Recruiter {Number(scores.recruiterImpression).toFixed(1)}
      </span>
    </div>
  );
}

export function OverallScore({ scores, size = "md" }: { scores: Scores; size?: "md" | "lg" }) {
  const overall = avg(Object.values(scores));
  const color = scoreColor(overall);
  return (
    <div className="flex flex-col items-center">
      <span
        className={cn(
          "font-bold tabular-nums leading-none",
          size === "lg" ? "text-4xl" : "text-2xl",
        )}
        style={{ color }}
      >
        {overall.toFixed(1)}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
        / 10 overall
      </span>
    </div>
  );
}
