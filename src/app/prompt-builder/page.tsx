"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Wand2, Search, KeyRound, AlertTriangle, FileStack, Package, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ScoreBadges } from "@/components/shared/score-display";
import { PromptResultDialog } from "@/components/shared/prompt-result-dialog";
import { useGenerate } from "@/hooks/use-generate";
import { useSettings } from "@/components/providers/settings";
import { useProjects } from "@/components/providers/projects";
import { SAMPLE_IDEAS } from "@/lib/sample-data";
import type { ProjectIdea, SavedProject } from "@/types";

function savedToIdea(p: SavedProject): ProjectIdea {
  if (p.idea && p.idea.projectName) return p.idea;
  return {
    id: p.id,
    projectName: p.projectName,
    description: p.description,
    domain: p.domain,
    targetUsers: "",
    problemSolved: "",
    whyPowerful: "",
    targetCompanies: [],
    techStack: p.techStack,
    aiIntegration: "",
    databasePlan: "",
    frontendComplexity: 5,
    backendComplexity: 5,
    deploymentMethod: "",
    scores: p.scores,
    difficulty: "Advanced",
    estimatedBuildTime: "",
    mvpFeatures: [],
    advancedFeatures: [],
    uiInspiration: [],
    monetization: "",
    blueprint: p.blueprint,
    promptPackage: p.masterPrompt
      ? {
          masterPrompt: p.masterPrompt,
          resumeBullets: p.resumeBullets,
          githubReadmeOutline: p.readmeOutline,
          linkedinPost: p.linkedinPost,
          interviewExplanation: p.interviewExplanation,
        }
      : null,
  };
}

export default function PromptBuilderPage() {
  const gen = useGenerate();
  const { hasAnyKey } = useSettings();
  const { projects } = useProjects();
  const [query, setQuery] = React.useState("");

  const list = React.useMemo(() => {
    const saved = projects.map(savedToIdea).filter((i) => i.projectName);
    const merged = [...saved, ...SAMPLE_IDEAS];
    const seen = new Set<string>();
    return merged.filter((x) => {
      if (seen.has(x.projectName)) return false;
      seen.add(x.projectName);
      return true;
    });
  }, [projects]);

  const filtered = list.filter((idea) => {
    const q = query.toLowerCase();
    return (
      !q ||
      idea.projectName.toLowerCase().includes(q) ||
      idea.domain.toLowerCase().includes(q) ||
      idea.techStack.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="violet" className="w-fit">
          <Wand2 className="h-3.5 w-3.5" /> Prompt Builder
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Build a master vibe-coding prompt
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Pick any project and generate a complete, paste-ready master prompt for Lovable, Bolt,
          Cursor, Windsurf, Replit, v0 or Claude Code — plus resume bullets, README outline and
          interview talking points.
        </p>
      </div>

      {!hasAnyKey ? (
        <EmptyState
          icon={KeyRound}
          title="Add an API key to build prompts"
          description="Prompt generation calls Gemini or Groq. Add a free key in Settings — it's stored locally and never hardcoded."
          action={
            <Link href="/settings">
              <Button>
                <KeyRound className="h-4 w-4" /> Add API Key
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {gen.error === "NO_API_KEY" && (
            <Card className="flex items-center gap-3 border-amber-400/25 bg-amber-500/5 p-4">
              <AlertTriangle className="h-5 w-5 text-amber-300" />
              <p className="text-sm text-amber-100">
                The selected provider needs a key. Add one in Settings.
              </p>
            </Card>
          )}

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your saved + curated projects…"
              className="pl-9"
            />
          </div>

          <div className="flex flex-col gap-3">
            {filtered.map((idea, i) => {
              const loading = gen.loadingIdea[idea.id];
              return (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.3) }}
                >
                  <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Bookmark className="h-3.5 w-3.5 text-slate-600" />
                        <Badge variant="brand">{idea.domain}</Badge>
                      </div>
                      <h3 className="truncate text-sm font-semibold text-white">
                        {idea.projectName}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                        {idea.description}
                      </p>
                      <div className="mt-2">
                        <ScoreBadges scores={idea.scores} />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        loading={loading === "blueprint" || loading === "full"}
                        onClick={() => gen.generateBlueprint(idea)}
                      >
                        <FileStack className="h-3.5 w-3.5" /> Blueprint
                      </Button>
                      <Button size="sm" loading={loading === "prompt"} onClick={() => gen.generatePrompt(idea)}>
                        <Wand2 className="h-3.5 w-3.5" /> Prompt
                      </Button>
                      <Button size="sm" variant="accent" loading={loading === "full"} onClick={() => gen.generateFullPackage(idea)}>
                        <Package className="h-3.5 w-3.5" /> Full Package
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <EmptyState
                icon={Search}
                title="No projects found"
                description="Generate ideas or save projects to see them here."
              />
            )}
          </div>
        </>
      )}

      <PromptResultDialog idea={gen.activeIdea} open={gen.promptOpen} onOpenChange={gen.setPromptOpen} />
    </div>
  );
}
