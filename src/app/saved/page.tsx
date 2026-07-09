"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bookmark,
  Search,
  Star,
  Copy,
  Download,
  FileText,
  Briefcase,
  Share2,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/shared/empty-state";
import { ScoreBadges } from "@/components/shared/score-display";
import { PromptResultDialog } from "@/components/shared/prompt-result-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/components/providers/projects";
import { useToast } from "@/components/providers/toast";
import { copyToClipboard, downloadFile, slugify, timeAgo, cn } from "@/lib/utils";
import { buildProjectPackageMarkdown, ideaToReadme, resumeToText } from "@/lib/export";
import type { ProjectIdea, SavedProject } from "@/types";

function toIdea(p: SavedProject): ProjectIdea {
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

const IconBtn = ({
  onClick,
  title,
  children,
  className,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={onClick}
    title={title}
    aria-label={title}
    className={cn(
      "grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 transition-colors hover:border-white/20 hover:text-white",
      className,
    )}
  >
    {children}
  </button>
);

export default function SavedPage() {
  const { projects, remove, toggleFavorite, loading } = useProjects();
  const { toast } = useToast();
  const [query, setQuery] = React.useState("");
  const [favOnly, setFavOnly] = React.useState(false);
  const [view, setView] = React.useState<ProjectIdea | null>(null);
  const [open, setOpen] = React.useState(false);

  const filtered = projects.filter((p) => {
    const q = query.toLowerCase();
    const mq =
      !q || p.projectName.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q);
    const mf = !favOnly || p.isFavorite;
    return mq && mf;
  });

  const openView = (p: SavedProject) => {
    setView(toIdea(p));
    setOpen(true);
  };

  const copyPrompt = (p: SavedProject) => {
    if (p.masterPrompt) {
      copyToClipboard(p.masterPrompt);
      toast({ title: "Master prompt copied", variant: "success" });
    } else toast({ title: "No prompt saved for this project", variant: "warning" });
  };

  const copyResume = (p: SavedProject) => {
    if (p.resumeBullets?.length) {
      copyToClipboard(resumeToText(p.resumeBullets, p.projectName));
      toast({ title: "Resume bullets copied", variant: "success" });
    } else toast({ title: "No resume bullets saved", variant: "warning" });
  };

  const copyLinkedin = (p: SavedProject) => {
    if (p.linkedinPost) {
      copyToClipboard(p.linkedinPost);
      toast({ title: "LinkedIn post copied", variant: "success" });
    } else toast({ title: "No LinkedIn post saved", variant: "warning" });
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="brand" className="w-fit">
          <Bookmark className="h-3.5 w-3.5" /> Saved Projects
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">Your vault</h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Every project you save is stored in your browser and synced to the connected database.
          Export prompts, READMEs and resume bullets anytime.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved projects yet"
          description="Generate or explore ideas and hit Save. They'll appear here with full export options."
          action={
            <Link href="/generate">
              <Button>
                <ExternalLink className="h-4 w-4" /> Generate Ideas
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search saved projects…"
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Star className={cn("h-4 w-4", favOnly ? "fill-amber-400 text-amber-400" : "text-slate-500")} />
              <span className="text-sm text-slate-400">Favorites</span>
              <Switch checked={favOnly} onCheckedChange={setFavOnly} />
            </div>
          </Card>

          <div className="flex flex-col gap-3">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.25) }}
              >
                <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <button onClick={() => toggleFavorite(p.id)} title="Toggle favorite">
                        <Star
                          className={cn(
                            "h-4 w-4 transition-colors",
                            p.isFavorite
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600 hover:text-slate-400",
                          )}
                        />
                      </button>
                      <Badge variant="brand">{p.domain}</Badge>
                      <Badge variant="outline">{p.goal}</Badge>
                      <span className="text-[11px] text-slate-500">{timeAgo(p.createdAt)}</span>
                    </div>
                    <h3 className="truncate text-sm font-semibold text-white">{p.projectName}</h3>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{p.description}</p>
                    <div className="mt-2">
                      <ScoreBadges scores={p.scores} />
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <IconBtn title="View package" onClick={() => openView(p)}>
                      <ExternalLink className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Copy master prompt" onClick={() => copyPrompt(p)}>
                      <Copy className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title="Download full package (.md)"
                      onClick={() => {
                        downloadFile(
                          `${slugify(p.projectName)}-package.md`,
                          buildProjectPackageMarkdown(toIdea(p)),
                        );
                        toast({ title: "Package downloaded", variant: "success" });
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title="Download README.md"
                      onClick={() => downloadFile(`README-${slugify(p.projectName)}.md`, ideaToReadme(toIdea(p)))}
                    >
                      <FileText className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Copy resume bullets" onClick={() => copyResume(p)}>
                      <Briefcase className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn title="Copy LinkedIn post" onClick={() => copyLinkedin(p)}>
                      <Share2 className="h-4 w-4" />
                    </IconBtn>
                    <IconBtn
                      title="Delete"
                      className="hover:border-red-400/30 hover:text-red-300"
                      onClick={() => {
                        remove(p.id);
                        toast({ title: "Project deleted", variant: "default" });
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconBtn>
                  </div>
                </Card>
              </motion.div>
            ))}
            {filtered.length === 0 && (
              <p className="py-10 text-center text-sm text-slate-500">No projects match your filters.</p>
            )}
          </div>
        </>
      )}

      <PromptResultDialog idea={view} open={open} onOpenChange={setOpen} />
    </div>
  );
}
