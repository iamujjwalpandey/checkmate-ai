"use client";

import * as React from "react";
import type { ProjectIdea, GenerateInput, Blueprint } from "@/types";
import { useSettings } from "@/components/providers/settings";
import { useToast } from "@/components/providers/toast";

export function useGenerate(initialIdeas?: ProjectIdea[]) {
  const { settings } = useSettings();
  const { toast } = useToast();

  const [ideas, setIdeas] = React.useState<ProjectIdea[]>(initialIdeas ?? []);
  const [generating, setGenerating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [meta, setMeta] = React.useState<{
    provider?: string;
    model?: string;
    fellback?: boolean;
  } | null>(null);

  const [loadingIdea, setLoadingIdea] = React.useState<
    Record<string, "blueprint" | "prompt" | "full" | undefined>
  >({});
  const [activeIdea, setActiveIdea] = React.useState<ProjectIdea | null>(null);
  const [detailIdea, setDetailIdea] = React.useState<ProjectIdea | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [promptOpen, setPromptOpen] = React.useState(false);

  const post = async (url: string, body: unknown) => {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return { res, data: await res.json() };
  };

  const generateIdeas = React.useCallback(
    async (input: GenerateInput): Promise<boolean> => {
      setGenerating(true);
      setError(null);
      try {
        const { res, data } = await post("/api/generate-ideas", { input, settings });
        if (!res.ok) {
          setError(data.error === "NO_API_KEY" ? "NO_API_KEY" : data.error || "Generation failed.");
          setGenerating(false);
          return false;
        }
        setIdeas(data.ideas);
        setMeta({ provider: data.provider, model: data.model, fellback: data.fellback });
        toast({
          title: `Generated ${data.ideas.length} ideas`,
          description: `via ${data.provider} · ${data.model}`,
          variant: "success",
        });
        setGenerating(false);
        return true;
      } catch {
        setError("Network error. Please check your connection and try again.");
        setGenerating(false);
        return false;
      }
    },
    [settings, toast],
  );

  const clearLoading = (id: string) =>
    setLoadingIdea((p) => {
      const c = { ...p };
      delete c[id];
      return c;
    });

  const generateBlueprint = React.useCallback(
    async (idea: ProjectIdea) => {
      setLoadingIdea((p) => ({ ...p, [idea.id]: "blueprint" }));
      try {
        const { res, data } = await post("/api/generate-blueprint", { idea, settings });
        if (!res.ok) {
          if (data.error === "NO_API_KEY") setError("NO_API_KEY");
          else toast({ title: "Blueprint failed", description: data.error, variant: "error" });
          return;
        }
        const updated = { ...idea, blueprint: data.blueprint };
        setIdeas((prev) => prev.map((x) => (x.id === idea.id ? { ...x, blueprint: data.blueprint } : x)));
        setActiveIdea(updated);
        setDetailIdea(updated);
        setPromptOpen(true);
        toast({ title: "Blueprint ready", variant: "success" });
      } catch {
        toast({ title: "Network error", variant: "error" });
      } finally {
        clearLoading(idea.id);
      }
    },
    [settings, toast],
  );

  const generatePrompt = React.useCallback(
    async (idea: ProjectIdea) => {
      setLoadingIdea((p) => ({ ...p, [idea.id]: "prompt" }));
      try {
        const { res, data } = await post("/api/generate-master-prompt", {
          idea,
          blueprint: idea.blueprint ?? null,
          settings,
        });
        if (!res.ok) {
          if (data.error === "NO_API_KEY") setError("NO_API_KEY");
          else toast({ title: "Prompt failed", description: data.error, variant: "error" });
          return;
        }
        const merged: ProjectIdea = { ...idea, promptPackage: data.promptPackage };
        setIdeas((prev) =>
          prev.map((x) => (x.id === idea.id ? { ...x, promptPackage: data.promptPackage } : x)),
        );
        setActiveIdea(merged);
        setPromptOpen(true);
        toast({ title: "Master prompt ready", variant: "success" });
      } catch {
        toast({ title: "Network error", variant: "error" });
      } finally {
        clearLoading(idea.id);
      }
    },
    [settings, toast],
  );

  const generateFullPackage = React.useCallback(
    async (idea: ProjectIdea) => {
      setLoadingIdea((p) => ({ ...p, [idea.id]: "full" }));
      try {
        let bp: Blueprint | null = idea.blueprint ?? null;
        if (!bp) {
          const r1 = await post("/api/generate-blueprint", { idea, settings });
          if (!r1.res.ok) {
            if (r1.data.error === "NO_API_KEY") setError("NO_API_KEY");
            else toast({ title: "Blueprint failed", description: r1.data.error, variant: "error" });
            return;
          }
          bp = r1.data.blueprint;
        }
        const withBp: ProjectIdea = { ...idea, blueprint: bp };
        const r2 = await post("/api/generate-master-prompt", {
          idea: withBp,
          blueprint: bp,
          settings,
        });
        if (!r2.res.ok) {
          if (r2.data.error === "NO_API_KEY") setError("NO_API_KEY");
          else toast({ title: "Prompt failed", description: r2.data.error, variant: "error" });
          return;
        }
        const full: ProjectIdea = { ...withBp, promptPackage: r2.data.promptPackage };
        setIdeas((prev) =>
          prev.map((x) =>
            x.id === idea.id ? { ...x, blueprint: bp, promptPackage: r2.data.promptPackage } : x,
          ),
        );
        setActiveIdea(full);
        setPromptOpen(true);
        toast({ title: "Complete package ready", variant: "success" });
      } catch {
        toast({ title: "Network error", variant: "error" });
      } finally {
        clearLoading(idea.id);
      }
    },
    [settings, toast],
  );

  const openDetail = React.useCallback((idea: ProjectIdea) => {
    setDetailIdea(idea);
    setDetailOpen(true);
  }, []);

  return {
    ideas,
    setIdeas,
    generating,
    error,
    setError,
    meta,
    generateIdeas,
    generateBlueprint,
    generatePrompt,
    generateFullPackage,
    loadingIdea,
    activeIdea,
    setActiveIdea,
    detailIdea,
    setDetailIdea,
    detailOpen,
    setDetailOpen,
    promptOpen,
    setPromptOpen,
    openDetail,
  };
}
