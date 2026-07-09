"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  KeyRound,
  Wand2,
  Compass,
  AlertTriangle,
  RefreshCw,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { ProjectCard } from "@/components/shared/project-card";
import { IdeaDetailDialog } from "@/components/shared/idea-detail-dialog";
import { PromptResultDialog } from "@/components/shared/prompt-result-dialog";
import { useGenerate } from "@/hooks/use-generate";
import { useSettings } from "@/components/providers/settings";
import {
  DOMAINS,
  GOALS,
  SKILL_LEVELS,
  COMPANY_STYLES,
  TECH_STACKS,
  IDEA_COUNTS,
  COMPLEXITIES,
  OUTPUT_TYPES,
} from "@/lib/constants";
import type { GenerateInput } from "@/types";
import { cn } from "@/lib/utils";

const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

export default function GeneratePage() {
  const { settings, update, hasAnyKey, hydrated } = useSettings();
  const gen = useGenerate();

  const [input, setInput] = React.useState<GenerateInput>({
    domain: "AI / ML",
    goal: "Resume",
    skillLevel: "Industry Level",
    companyStyle: "Vercel",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    ideaCount: 5,
    complexity: "Production-ready",
    outputType: "Full blueprint",
    freeTierOnly: settings.freeTierOnly,
  });

  React.useEffect(() => {
    if (!hydrated) return;
    setInput((prev) => ({
      ...prev,
      goal: settings.defaultGoal || prev.goal,
      companyStyle: settings.defaultCompanyStyle || prev.companyStyle,
      outputType: settings.defaultOutputType || prev.outputType,
      freeTierOnly: settings.freeTierOnly,
    }));
  }, [hydrated, settings.defaultGoal, settings.defaultCompanyStyle, settings.defaultOutputType, settings.freeTierOnly]);

  const set = <K extends keyof GenerateInput>(k: K, v: GenerateInput[K]) =>
    setInput((p) => ({ ...p, [k]: v }));

  const toggleTech = (t: string) =>
    setInput((p) => ({
      ...p,
      techStack: p.techStack.includes(t)
        ? p.techStack.filter((x) => x !== t)
        : [...p.techStack, t],
    }));

  const handleGenerate = () => gen.generateIdeas(input);

  const showOnboarding = gen.error === "NO_API_KEY" || (!hasAnyKey && !gen.generating && gen.ideas.length === 0);

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="brand" className="w-fit">
          <Sparkles className="h-3.5 w-3.5" /> Project Generator
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Generate recruiter-worthy projects
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Configure your intent and let the AI architect return scored, build-ready ideas — then
          turn any one into a complete vibe coding master prompt.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Form */}
        <div className="xl:sticky xl:top-20 xl:self-start">
          <Card className="flex flex-col gap-5 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <Field label="Project domain">
                <Select value={input.domain} onValueChange={(v) => set("domain", v)} options={toOpts(DOMAINS)} />
              </Field>
              <Field label="Goal">
                <Select value={input.goal} onValueChange={(v) => set("goal", v)} options={toOpts(GOALS)} />
              </Field>
              <Field label="Skill level">
                <Select value={input.skillLevel} onValueChange={(v) => set("skillLevel", v)} options={toOpts(SKILL_LEVELS)} />
              </Field>
              <Field label="Target company style">
                <Select value={input.companyStyle} onValueChange={(v) => set("companyStyle", v)} options={toOpts(COMPANY_STYLES)} />
              </Field>
              <Field label="Complexity">
                <Select value={input.complexity} onValueChange={(v) => set("complexity", v)} options={toOpts(COMPLEXITIES)} />
              </Field>
              <Field label="Output type">
                <Select value={input.outputType} onValueChange={(v) => set("outputType", v)} options={toOpts(OUTPUT_TYPES)} />
              </Field>
            </div>

            <Field label="Number of ideas">
              <div className="flex flex-wrap gap-1.5">
                {IDEA_COUNTS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => set("ideaCount", n)}
                    className={cn(
                      "h-9 min-w-[3rem] rounded-lg border px-3 text-sm font-medium transition-colors",
                      input.ideaCount === n
                        ? "border-brand-400/40 bg-brand-500/15 text-white"
                        : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Preferred tech stack">
              <div className="flex max-h-44 flex-wrap gap-1.5 overflow-auto no-scrollbar">
                {TECH_STACKS.map((t) => {
                  const active = input.techStack.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTech(t)}
                      className={cn(
                        "rounded-md border px-2 py-1 text-xs transition-colors",
                        active
                          ? "border-brand-400/40 bg-brand-500/15 text-brand-200"
                          : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
                      )}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">Free Tier Only</p>
                <p className="text-[11px] text-slate-500">Recommend only zero-cost tools</p>
              </div>
              <Switch
                checked={settings.freeTierOnly}
                onCheckedChange={(v) => update({ freeTierOnly: v })}
              />
            </div>

            <Button size="lg" loading={gen.generating} onClick={handleGenerate} className="w-full">
              <Sparkles className="h-4 w-4" />
              {gen.generating ? "Generating…" : "Generate Ideas"}
            </Button>
            {!hasAnyKey && (
              <Link
                href="/settings"
                className="flex items-center justify-center gap-1.5 text-xs text-amber-300 hover:text-amber-200"
              >
                <KeyRound className="h-3.5 w-3.5" /> Add a free API key to generate
              </Link>
            )}
          </Card>
        </div>

        {/* Results */}
        <div className="min-w-0">
          {gen.generating ? (
            <Card>
              <LoadingState />
            </Card>
          ) : showOnboarding ? (
            <EmptyState
              icon={KeyRound}
              title="Add an API key to start generating"
              description="CHECKMATE AI calls Google Gemini and Groq directly from your browser. Add a free key in Settings — it's stored locally and never hardcoded. No key? Explore curated example ideas instead."
              action={
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Link href="/settings">
                    <Button>
                      <KeyRound className="h-4 w-4" /> Open Settings
                    </Button>
                  </Link>
                  <Link href="/idea-explorer">
                    <Button variant="outline">
                      <Compass className="h-4 w-4" /> Explore Example Ideas
                    </Button>
                  </Link>
                </div>
              }
            />
          ) : gen.error ? (
            <EmptyState
              icon={AlertTriangle}
              title="Generation hit a snag"
              description={gen.error}
              action={
                <Button variant="outline" onClick={handleGenerate}>
                  <RefreshCw className="h-4 w-4" /> Try again
                </Button>
              }
            />
          ) : gen.ideas.length === 0 ? (
            <EmptyState
              icon={Rocket}
              title="Generate your first industry-level project"
              description="Pick your domain, goal and target company, then hit Generate. You'll get scored ideas with architecture, scores and build paths."
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-slate-400">
                  <span className="font-semibold text-white">{gen.ideas.length}</span> ideas for{" "}
                  <span className="text-brand-300">{input.domain}</span> · {input.goal}
                </p>
                {gen.meta && (
                  <Badge variant="outline">
                    <Wand2 className="h-3 w-3" /> {gen.meta.provider} · {gen.meta.model}
                    {gen.meta.fellback && <span className="text-amber-300"> (fallback)</span>}
                  </Badge>
                )}
              </div>
              <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {gen.ideas.map((idea, i) => (
                  <ProjectCard
                    key={idea.id}
                    idea={idea}
                    index={i}
                    goal={input.goal}
                    onBlueprint={gen.generateBlueprint}
                    onPrompt={gen.generatePrompt}
                    onOpen={gen.openDetail}
                    loadingBlueprint={gen.loadingIdea[idea.id] === "blueprint"}
                    loadingPrompt={gen.loadingIdea[idea.id] === "prompt"}
                  />
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>

      <IdeaDetailDialog
        idea={gen.detailIdea}
        goal={input.goal}
        open={gen.detailOpen}
        onOpenChange={gen.setDetailOpen}
        onBlueprint={gen.generateBlueprint}
        onPrompt={gen.generatePrompt}
        loadingBlueprint={gen.detailIdea ? gen.loadingIdea[gen.detailIdea.id] === "blueprint" : false}
        loadingPrompt={gen.detailIdea ? gen.loadingIdea[gen.detailIdea.id] === "prompt" : false}
      />
      <PromptResultDialog idea={gen.activeIdea} open={gen.promptOpen} onOpenChange={gen.setPromptOpen} />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
