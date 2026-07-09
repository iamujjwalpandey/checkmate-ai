"use client";

import * as React from "react";
import { Bookmark, FileStack, Wand2, Target, AlertCircle, Sparkles, Cpu, Database, Rocket } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion } from "@/components/ui/accordion";
import { ScoreGrid } from "@/components/shared/score-display";
import { useProjects, ideaToSavedProject } from "@/components/providers/projects";
import { useToast } from "@/components/providers/toast";
import { difficultyColor, cn } from "@/lib/utils";
import type { ProjectIdea } from "@/types";

interface Props {
  idea: ProjectIdea | null;
  goal?: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBlueprint: (idea: ProjectIdea) => void;
  onPrompt: (idea: ProjectIdea) => void;
  loadingBlueprint?: boolean;
  loadingPrompt?: boolean;
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Target;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </p>
      <p className="text-sm leading-relaxed text-slate-300">{children}</p>
    </div>
  );
}

export function IdeaDetailDialog({
  idea,
  goal,
  open,
  onOpenChange,
  onBlueprint,
  onPrompt,
  loadingBlueprint,
  loadingPrompt,
}: Props) {
  const { isSaved, save } = useProjects();
  const { toast } = useToast();
  if (!idea) return null;
  const saved = isSaved(idea.projectName);

  const handleSave = async () => {
    await save(ideaToSavedProject(idea, goal));
    toast({ title: saved ? "Saved project updated" : "Project saved", variant: "success" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-2xl">
      <div className="flex flex-col gap-5 pr-2">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <Badge variant="brand">{idea.domain}</Badge>
            <span
              className={cn(
                "rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium",
                difficultyColor(idea.difficulty),
              )}
            >
              {idea.difficulty}
            </span>
            <Badge variant="outline">{idea.estimatedBuildTime}</Badge>
          </div>
          <h2 className="text-xl font-bold leading-tight text-white">{idea.projectName}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">{idea.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field icon={Target} label="Target Users">
            {idea.targetUsers}
          </Field>
          <Field icon={AlertCircle} label="Problem Solved">
            {idea.problemSolved}
          </Field>
        </div>

        <Field icon={Sparkles} label="Why It's Powerful">
          {idea.whyPowerful}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field icon={Cpu} label="AI Integration">
            {idea.aiIntegration}
          </Field>
          <Field icon={Database} label="Database">
            {idea.databasePlan}
          </Field>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Impact Scores
          </p>
          <ScoreGrid scores={idea.scores} />
        </div>

        <Accordion
          items={[
            {
              title: `MVP Features (${idea.mvpFeatures.length})`,
              content: (
                <ul className="flex flex-col gap-1.5">
                  {idea.mvpFeatures.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: `Advanced Features (${idea.advancedFeatures.length})`,
              content: (
                <ul className="flex flex-col gap-1.5">
                  {idea.advancedFeatures.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              title: `UI Inspiration & Monetization`,
              content: (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {idea.uiInspiration.map((u, i) => (
                      <Badge key={i} variant="accent">
                        {u}
                      </Badge>
                    ))}
                  </div>
                  <p className="flex items-center gap-1.5">
                    <Rocket className="h-3.5 w-3.5 text-accent-300" /> {idea.monetization}
                  </p>
                </div>
              ),
            },
          ]}
        />

        <div className="flex flex-wrap items-center gap-2 border-t border-white/8 pt-4">
          <Button variant="outline" onClick={handleSave}>
            <Bookmark className={cn("h-4 w-4", saved && "fill-brand-400 text-brand-400")} />
            {saved ? "Saved" : "Save Project"}
          </Button>
          <Button
            variant="secondary"
            loading={loadingBlueprint}
            onClick={() => onBlueprint(idea)}
            className="ml-auto"
          >
            <FileStack className="h-4 w-4" /> Generate Blueprint
          </Button>
          <Button loading={loadingPrompt} onClick={() => onPrompt(idea)}>
            <Wand2 className="h-4 w-4" /> Vibe Prompt
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
