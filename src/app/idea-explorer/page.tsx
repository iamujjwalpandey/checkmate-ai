"use client";

import * as React from "react";
import Link from "next/link";
import { Compass, Search, KeyRound, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ProjectCard } from "@/components/shared/project-card";
import { IdeaDetailDialog } from "@/components/shared/idea-detail-dialog";
import { PromptResultDialog } from "@/components/shared/prompt-result-dialog";
import { useGenerate } from "@/hooks/use-generate";
import { SAMPLE_IDEAS } from "@/lib/sample-data";

export default function IdeaExplorerPage() {
  const gen = useGenerate(SAMPLE_IDEAS);
  const [query, setQuery] = React.useState("");
  const [domain, setDomain] = React.useState("All");
  const [difficulty, setDifficulty] = React.useState("All");

  const domains = React.useMemo(
    () => ["All", ...Array.from(new Set(SAMPLE_IDEAS.map((i) => i.domain)))],
    [],
  );
  const difficulties = React.useMemo(
    () => ["All", ...Array.from(new Set(SAMPLE_IDEAS.map((i) => i.difficulty)))],
    [],
  );

  const filtered = gen.ideas.filter((idea) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      idea.projectName.toLowerCase().includes(q) ||
      idea.description.toLowerCase().includes(q) ||
      idea.techStack.some((t) => t.toLowerCase().includes(q));
    const matchesDomain = domain === "All" || idea.domain === domain;
    const matchesDiff = difficulty === "All" || idea.difficulty === difficulty;
    return matchesQuery && matchesDomain && matchesDiff;
  });

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="accent" className="w-fit">
          <Compass className="h-3.5 w-3.5" /> Idea Explorer
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Curated industry-level projects
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Browse hand-picked, portfolio-grade projects. Open one for full scores and architecture,
          then generate a build-ready prompt — no setup required to explore.
        </p>
      </div>

      {gen.error === "NO_API_KEY" && (
        <Card className="flex flex-wrap items-center gap-3 border-amber-400/25 bg-amber-500/5 p-4">
          <AlertTriangle className="h-5 w-5 text-amber-300" />
          <p className="flex-1 text-sm text-amber-100">
            Add a free Gemini or Groq key to generate prompts and blueprints.
          </p>
          <Link href="/settings">
            <Button size="sm" variant="secondary">
              <KeyRound className="h-3.5 w-3.5" /> Settings
            </Button>
          </Link>
        </Card>
      )}

      <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tech, domains…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={domain}
            onValueChange={setDomain}
            options={domains.map((d) => ({ value: d, label: d }))}
            className="sm:w-44"
          />
          <Select
            value={difficulty}
            onValueChange={setDifficulty}
            options={difficulties.map((d) => ({ value: d, label: d }))}
            className="sm:w-44"
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No projects match your filters"
          description="Try a different domain, difficulty, or search term."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((idea, i) => (
            <ProjectCard
              key={idea.id}
              idea={idea}
              index={i}
              onBlueprint={gen.generateBlueprint}
              onPrompt={gen.generatePrompt}
              onOpen={gen.openDetail}
              loadingBlueprint={gen.loadingIdea[idea.id] === "blueprint"}
              loadingPrompt={gen.loadingIdea[idea.id] === "prompt"}
            />
          ))}
        </div>
      )}

      <IdeaDetailDialog
        idea={gen.detailIdea}
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
