"use client";

import { motion } from "framer-motion";
import { Bookmark, FileStack, Wand2, ArrowUpRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreBadges } from "@/components/shared/score-display";
import { useProjects, ideaToSavedProject } from "@/components/providers/projects";
import { useToast } from "@/components/providers/toast";
import { difficultyColor, cn } from "@/lib/utils";
import type { ProjectIdea } from "@/types";

interface Props {
  idea: ProjectIdea;
  goal?: string;
  index?: number;
  onBlueprint: (idea: ProjectIdea) => void;
  onPrompt: (idea: ProjectIdea) => void;
  onOpen: (idea: ProjectIdea) => void;
  loadingBlueprint?: boolean;
  loadingPrompt?: boolean;
}

export function ProjectCard({
  idea,
  goal,
  index = 0,
  onBlueprint,
  onPrompt,
  onOpen,
  loadingBlueprint,
  loadingPrompt,
}: Props) {
  const { isSaved, save } = useProjects();
  const { toast } = useToast();
  const saved = isSaved(idea.projectName);

  const handleSave = async () => {
    await save(ideaToSavedProject(idea, goal));
    toast({
      title: saved ? "Saved project updated" : "Project saved",
      variant: "success",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.4) }}
    >
      <Card className="card-hover flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <button onClick={() => onOpen(idea)} className="group text-left">
            <h3 className="text-[17px] font-semibold leading-snug text-white transition-colors group-hover:text-brand-200">
              {idea.projectName}
            </h3>
          </button>
          <button
            onClick={handleSave}
            aria-label="Save project"
            className="shrink-0 rounded-lg p-1.5 transition-colors hover:bg-white/5"
          >
            <Bookmark
              className={cn(
                "h-4 w-4 transition-colors",
                saved ? "fill-brand-400 text-brand-400" : "text-slate-500 hover:text-slate-200",
              )}
            />
          </button>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">{idea.description}</p>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="brand">{idea.domain}</Badge>
          <span
            className={cn(
              "rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] font-medium",
              difficultyColor(idea.difficulty),
            )}
          >
            {idea.difficulty}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" /> {idea.estimatedBuildTime}
          </span>
        </div>

        <ScoreBadges scores={idea.scores} />

        <div className="flex flex-wrap gap-1">
          {idea.techStack.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 text-[11px] text-slate-400"
            >
              {t}
            </span>
          ))}
          {idea.techStack.length > 5 && (
            <span className="rounded-md px-2 py-0.5 text-[11px] text-slate-500">
              +{idea.techStack.length - 5}
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <Button size="sm" variant="outline" onClick={() => onOpen(idea)}>
            Details <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            loading={loadingBlueprint}
            onClick={() => onBlueprint(idea)}
          >
            <FileStack className="h-3.5 w-3.5" /> Blueprint
          </Button>
          <Button size="sm" loading={loadingPrompt} onClick={() => onPrompt(idea)}>
            <Wand2 className="h-3.5 w-3.5" /> Prompt
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
