"use client";

import { motion } from "framer-motion";
import {
  Sparkles,
  Wand2,
  Briefcase,
  BookMarked,
  Mic2,
  Gift,
  Palette,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FEATURES: { icon: LucideIcon; title: string; desc: string; accent: string }[] = [
  {
    icon: Sparkles,
    title: "AI Project Idea Generator",
    desc: "Discover resume-worthy, real-world ideas scored by recruiter impact.",
    accent: "from-brand-500/25 to-brand-500/5 text-brand-300",
  },
  {
    icon: Wand2,
    title: "Vibe Coding Prompt Builder",
    desc: "Convert any idea into a complete, build-ready master prompt.",
    accent: "from-violet-500/25 to-violet-500/5 text-violet-300",
  },
  {
    icon: Briefcase,
    title: "Resume Bullet Generator",
    desc: "Metric-driven bullets that pass recruiter and ATS filters.",
    accent: "from-accent-500/25 to-accent-500/5 text-accent-300",
  },
  {
    icon: BookMarked,
    title: "GitHub README Generator",
    desc: "Polished README outlines that make your repo stand out.",
    accent: "from-emerald-500/25 to-emerald-500/5 text-emerald-300",
  },
  {
    icon: Mic2,
    title: "Interview Prep Generator",
    desc: "Explain your architecture like a senior engineer in interviews.",
    accent: "from-amber-500/25 to-amber-500/5 text-amber-300",
  },
  {
    icon: Gift,
    title: "Free Stack Recommender",
    desc: "Only suggests tools with a real free tier. Zero-cost builds.",
    accent: "from-pink-500/25 to-pink-500/5 text-pink-300",
  },
  {
    icon: Palette,
    title: "UI Inspiration Finder",
    desc: "Curated real products to match your target company aesthetic.",
    accent: "from-sky-500/25 to-sky-500/5 text-sky-300",
  },
  {
    icon: Boxes,
    title: "Architecture Planner",
    desc: "Frontend, backend, schema, API routes & deployment mapped out.",
    accent: "from-indigo-500/25 to-indigo-500/5 text-indigo-300",
  },
];

export function FeatureGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {FEATURES.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55, delay: (i % 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -6 }}
          className="card-hover glass group relative flex flex-col gap-3 overflow-hidden rounded-2xl p-5"
        >
          <div
            className={cn(
              "grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br transition-transform duration-300 group-hover:scale-110",
              f.accent,
            )}
          >
            <f.icon className="h-5 w-5" />
          </div>
          <h3 className="font-display text-sm font-semibold tracking-tight text-white">
            {f.title}
          </h3>
          <p className="text-[13px] leading-relaxed text-slate-400">{f.desc}</p>
        </motion.div>
      ))}
    </div>
  );
}
