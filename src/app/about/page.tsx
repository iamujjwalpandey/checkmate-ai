"use client";

import Link from "next/link";
import { GraduationCap, Sparkles, ArrowRight, Gift, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { FREE_STACK } from "@/lib/free-stack";

const STEPS = [
  {
    title: "1 · Configure your intent",
    content:
      "Choose a domain, goal, skill level, target company style, complexity and tech stack. CHECKMATE AI is tuned to avoid basic projects unless you ask for beginner level.",
  },
  {
    title: "2 · Generate scored ideas",
    content:
      "The AI returns high-impact ideas with resume, GitHub, recruiter, market and startup scores, plus architecture, AI integration and deployment paths.",
  },
  {
    title: "3 · Build the master prompt",
    content:
      "Turn any idea into a complete vibe-coding master prompt with resume bullets, a GitHub README outline, a LinkedIn post and an interview explanation.",
  },
];

const FAQ = [
  {
    title: "Do I need to pay for anything?",
    content:
      "No. CHECKMATE AI is designed around free tiers. Use Google Gemini and Groq free API keys, and the Free Tier Only Mode ensures every recommended tool has a zero-cost path.",
  },
  {
    title: "Where are my API keys stored?",
    content:
      "Keys are stored only in your browser's local storage and are never hardcoded into the source. They are sent only to your own app's server routes to call the providers. For production, use environment variables.",
  },
  {
    title: "How does Auto Detect work?",
    content:
      "Deep tasks (full blueprints, master prompts, README, resume bullets) route to Gemini for richer reasoning. Fast tasks (idea lists, summaries, brainstorming) route to Groq for low latency. If one provider fails, it falls back to the other.",
  },
  {
    title: "Which vibe coding platforms are supported?",
    content:
      "The generated master prompt works with Lovable, Bolt, Cursor, Windsurf, Replit, v0, Claude Code and any AI coding assistant.",
  },
  {
    title: "Are my saved projects synced?",
    content:
      "Yes. Projects are saved to a connected PostgreSQL database keyed to an anonymous guest ID, with a local-storage cache for instant offline access.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 pb-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <Badge variant="violet" className="w-fit">
          <GraduationCap className="h-3.5 w-3.5" /> How It Works
        </Badge>
        <h1 className="font-display max-w-2xl text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl md:text-5xl">
          From idea to <span className="text-gradient">deployable prompt</span> in minutes
        </h1>
        <p className="max-w-xl text-sm text-slate-400">
          CHECKMATE AI is an elite project architect that generates resume-worthy, GitHub-worthy
          ideas and converts them into complete build-ready prompts.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href="/generate">
            <Button>
              <Sparkles className="h-4 w-4" /> Start generating
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline">
              <Zap className="h-4 w-4" /> Configure providers
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s) => (
          <Card key={s.title} className="p-5">
            <h3 className="text-sm font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.content}</p>
          </Card>
        ))}
      </div>

      {/* Free stack */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold tracking-tight text-white">Recommended free stack</h2>
        </div>
        <p className="mb-5 max-w-2xl text-sm text-slate-400">
          When <span className="text-emerald-300">Free Tier Only Mode</span> is on, CHECKMATE AI
          recommends only services with a real free tier.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FREE_STACK.map((t) => (
            <Card key={t.name} className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{t.name}</p>
                <Badge variant="success">{t.category}</Badge>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{t.why}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="mb-4 text-xl font-bold tracking-tight text-white">Frequently asked questions</h2>
        <Accordion items={FAQ} />
      </section>

      <Card className="flex flex-col items-center gap-3 p-8 text-center">
        <ShieldCheck className="h-7 w-7 text-brand-300" />
        <h2 className="text-xl font-bold text-white">Built for builders, by builders</h2>
        <p className="max-w-md text-sm text-slate-400">
          Stop shipping tutorial projects. Generate work that recruiters, interviewers and
          collaborators actually remember.
        </p>
        <Link href="/generate">
          <Button size="lg">
            Generate your next project <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
