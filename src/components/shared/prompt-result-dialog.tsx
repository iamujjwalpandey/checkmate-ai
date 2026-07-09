"use client";

import * as React from "react";
import { Copy, Download, FileText, Wand2, Briefcase, Share2, BookMarked, Mic2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/providers/toast";
import { copyToClipboard, downloadFile, slugify } from "@/lib/utils";
import {
  buildProjectPackageMarkdown,
  blueprintToMarkdown,
  resumeToText,
  linkedinToText,
  ideaToReadme,
} from "@/lib/export";
import type { ProjectIdea } from "@/types";

function PreBlock({ text }: { text: string }) {
  return (
    <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap rounded-xl border border-white/8 bg-black/30 p-4 text-[13px] leading-relaxed text-slate-300 no-scrollbar">
      {text}
    </pre>
  );
}

function ListBlock({ items }: { items: string[] }) {
  return (
    <div className="flex max-h-[55vh] flex-col gap-2 overflow-auto no-scrollbar">
      {items.map((it, i) => (
        <div
          key={i}
          className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-slate-300"
        >
          {it}
        </div>
      ))}
    </div>
  );
}

export function PromptResultDialog({
  idea,
  open,
  onOpenChange,
}: {
  idea: ProjectIdea | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { toast } = useToast();
  const [tab, setTab] = React.useState("prompt");
  const pkg = idea?.promptPackage;
  const bp = idea?.blueprint;

  React.useEffect(() => {
    if (open) setTab("prompt");
  }, [open]);

  if (!idea) return null;

  const copy = (text: string, label: string) => {
    copyToClipboard(text);
    toast({ title: `Copied ${label}`, variant: "success" });
  };

  const slug = slugify(idea.projectName);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-3xl">
      <div className="flex flex-col gap-4 pr-1">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-300">
              Build-ready package
            </p>
            <h2 className="text-lg font-bold text-white">{idea.projectName}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              onClick={() => {
                if (pkg?.masterPrompt) copy(pkg.masterPrompt, "master prompt");
              }}
            >
              <Copy className="h-3.5 w-3.5" /> Copy Prompt
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                downloadFile(`${slug}-full-package.md`, buildProjectPackageMarkdown(idea))
              }
            >
              <Download className="h-3.5 w-3.5" /> Export All
            </Button>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="prompt">
              <Wand2 className="h-3.5 w-3.5" /> Master Prompt
            </TabsTrigger>
            <TabsTrigger value="blueprint">
              <FileText className="h-3.5 w-3.5" /> Blueprint
            </TabsTrigger>
            <TabsTrigger value="resume">
              <Briefcase className="h-3.5 w-3.5" /> Resume
            </TabsTrigger>
            <TabsTrigger value="readme">
              <BookMarked className="h-3.5 w-3.5" /> README
            </TabsTrigger>
            <TabsTrigger value="linkedin">
              <Share2 className="h-3.5 w-3.5" /> LinkedIn
            </TabsTrigger>
            <TabsTrigger value="interview">
              <Mic2 className="h-3.5 w-3.5" /> Interview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prompt">
            {pkg?.masterPrompt ? (
              <PreBlock text={pkg.masterPrompt} />
            ) : (
              <p className="text-sm text-slate-500">No prompt generated yet.</p>
            )}
          </TabsContent>

          <TabsContent value="blueprint">
            {bp ? (
              <PreBlock text={blueprintToMarkdown(bp, idea.projectName)} />
            ) : (
              <p className="text-sm text-slate-500">Generate a blueprint to see architecture.</p>
            )}
          </TabsContent>

          <TabsContent value="resume">
            {pkg?.resumeBullets?.length ? (
              <ListBlock items={pkg.resumeBullets} />
            ) : (
              <p className="text-sm text-slate-500">No resume bullets yet.</p>
            )}
          </TabsContent>

          <TabsContent value="readme">
            {pkg?.githubReadmeOutline?.length ? (
              <ListBlock items={pkg.githubReadmeOutline} />
            ) : (
              <p className="text-sm text-slate-500">No README outline yet.</p>
            )}
          </TabsContent>

          <TabsContent value="linkedin">
            {pkg?.linkedinPost ? (
              <PreBlock text={linkedinToText(pkg.linkedinPost)} />
            ) : (
              <p className="text-sm text-slate-500">No LinkedIn post yet.</p>
            )}
          </TabsContent>

          <TabsContent value="interview">
            {pkg?.interviewExplanation ? (
              <PreBlock text={pkg.interviewExplanation} />
            ) : (
              <p className="text-sm text-slate-500">No interview explanation yet.</p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-white/8 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadFile(`README-${slug}.md`, ideaToReadme(idea))}
          >
            <Download className="h-3.5 w-3.5" /> README.md
          </Button>
          {pkg?.resumeBullets?.length ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(`${slug}-resume.txt`, resumeToText(pkg.resumeBullets, idea.projectName))}
            >
              <Download className="h-3.5 w-3.5" /> Resume
            </Button>
          ) : null}
          <Button size="sm" onClick={() => copy(buildProjectPackageMarkdown(idea), "full package")}>
            <Copy className="h-3.5 w-3.5" /> Copy Everything
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
