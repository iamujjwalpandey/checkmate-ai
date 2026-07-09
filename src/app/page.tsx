"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Zap,
  ShieldCheck,
  Layers,
  Wand2,
  Rocket,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureGrid } from "@/components/home/feature-grid";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { CompanyMarquee } from "@/components/home/company-marquee";
import { StatBand } from "@/components/home/stat-band";
import { Reveal } from "@/components/shared/reveal";

const STEPS = [
  {
    icon: Sparkles,
    step: "01",
    title: "Describe your goal",
    desc: "Pick a domain, skill level, target company & complexity. No basic projects — only ambitious, real-world builds.",
  },
  {
    icon: Layers,
    step: "02",
    title: "Get a scored blueprint",
    desc: "Receive ideas with resume, GitHub, recruiter & startup scores plus full architecture, schema and deployment.",
  },
  {
    icon: Wand2,
    step: "03",
    title: "Ship with a master prompt",
    desc: "Paste the generated prompt into Lovable, Bolt, Cursor, v0 or Claude Code and build a complete production app.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ===================== HERO ===================== */}
      <section className="relative flex flex-col items-center overflow-hidden px-2 pt-10 text-center sm:pt-16">
        <div className="aurora" aria-hidden />
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
          <motion.div {...fadeUp} transition={{ duration: 0.6 }}>
            <Badge variant="brand" className="mb-7 px-3.5 py-1.5 text-xs backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" /> AI-Powered Project Architect
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-display max-w-4xl text-balance text-[2.6rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-6xl md:text-7xl"
          >
            Generate Industry-Level Projects That{" "}
            <span className="text-gradient">Recruiters Actually Notice.</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            CHECKMATE AI helps you discover resume-worthy project ideas, design complete
            architectures, and generate build-ready prompts for vibe coding platforms.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-10 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link href="/generate">
              <Button size="lg" className="group w-full sm:w-auto">
                <Sparkles className="h-4 w-4" /> Generate My Next Project
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/idea-explorer">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Compass className="h-4 w-4" /> Explore Project Ideas
              </Button>
            </Link>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500"
          >
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Keys stay local, never hardcoded
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent-400" /> Gemini + Groq with auto-fallback
            </span>
            <span className="flex items-center gap-1.5">
              <Rocket className="h-3.5 w-3.5 text-brand-400" /> Free-tier friendly
            </span>
          </motion.div>
        </div>
      </section>

      {/* ===================== DASHBOARD PREVIEW ===================== */}
      <section className="relative z-10 mt-16 w-full px-2 sm:mt-24">
        <DashboardPreview />
      </section>

      {/* ===================== STAT BAND ===================== */}
      <section className="mx-auto mt-16 w-full max-w-5xl px-2 sm:mt-24">
        <StatBand />
      </section>

      {/* ===================== COMPANY MARQUEE ===================== */}
      <section className="mt-20 w-full px-2 sm:mt-28">
        <Reveal className="mb-6 text-center">
          <p className="eyebrow text-slate-600">Built to the bar of</p>
        </Reveal>
        <CompanyMarquee />
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="mx-auto mt-24 w-full max-w-6xl px-2 sm:mt-32">
        <Reveal className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3 text-brand-300">Capabilities</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-5xl">
            Everything you need to build something{" "}
            <span className="text-gradient-accent">worth showing off.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
            From idea to deployable prompt — one workspace engineered for students, developers,
            AI engineers and job seekers.
          </p>
        </Reveal>
        <FeatureGrid />
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="mx-auto mt-24 w-full max-w-5xl px-2 sm:mt-32">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow mb-3 text-violet-400">Workflow</p>
          <h2 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
            Three steps to a project recruiters remember
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="glass card-hover relative flex flex-col gap-3 overflow-hidden rounded-2xl p-6"
            >
              <span className="font-display absolute right-5 top-4 text-5xl font-bold text-white/[0.06]">
                {s.step}
              </span>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/10 text-brand-300">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-white">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="mx-auto mt-24 w-full max-w-5xl px-2 pb-10 sm:mt-32">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-[28px] px-6 py-14 text-center sm:px-12">
            <div className="aurora opacity-50" aria-hidden />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/10" />
            <div className="relative">
              <KeyRound className="mx-auto h-9 w-9 text-brand-300" />
              <h2 className="font-display mt-5 text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
                Ready to build your next standout project?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-sm text-slate-400 sm:text-base">
                Add a free Gemini or Groq key in Settings and start generating in seconds. No
                credit card required.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/generate">
                  <Button size="lg" className="group">
                    Start Generating <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button size="lg" variant="outline">
                    <KeyRound className="h-4 w-4" /> Add API Key
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
