"use client";

import * as React from "react";
import type { ProjectIdea, SavedProject } from "@/types";
import { loadProjectsCache, saveProjectsCache } from "@/lib/storage";
import { uid } from "@/lib/utils";

export function ideaToSavedProject(idea: ProjectIdea, goal = "Resume"): SavedProject {
  return {
    id: uid("proj"),
    guestId: "local",
    projectName: idea.projectName,
    domain: idea.domain,
    goal,
    description: idea.description,
    techStack: idea.techStack,
    scores: idea.scores,
    blueprint: idea.blueprint ?? null,
    masterPrompt: idea.promptPackage?.masterPrompt ?? "",
    resumeBullets: idea.promptPackage?.resumeBullets ?? [],
    linkedinPost: idea.promptPackage?.linkedinPost ?? "",
    readmeOutline: idea.promptPackage?.githubReadmeOutline ?? [],
    interviewExplanation: idea.promptPackage?.interviewExplanation ?? "",
    idea,
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface ProjectsCtx {
  projects: SavedProject[];
  loading: boolean;
  hydrated: boolean;
  save: (input: SavedProject) => Promise<SavedProject>;
  remove: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  isSaved: (projectName: string) => boolean;
  getSaved: (projectName: string) => SavedProject | undefined;
}

const Ctx = React.createContext<ProjectsCtx | null>(null);

export function useProjects() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useProjects must be used within ProjectsProvider");
  return c;
}

/**
 * Fully client-side persistence. Projects are stored in the browser's
 * localStorage — no database or server required. This keeps the app
 * trivially deployable (e.g. on Vercel) with zero infrastructure.
 */
export function ProjectsProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<SavedProject[]>([]);
  const [hydrated, setHydrated] = React.useState(false);

  const setAndCache = React.useCallback(
    (updater: SavedProject[] | ((p: SavedProject[]) => SavedProject[])) => {
      setProjects((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        saveProjectsCache(next);
        return next;
      });
    },
    [],
  );

  // Hydrate once on the client from localStorage.
  React.useEffect(() => {
    setProjects(loadProjectsCache());
    setHydrated(true);
  }, []);

  const save = React.useCallback(
    async (input: SavedProject): Promise<SavedProject> => {
      const payload: SavedProject = { ...input, guestId: "local" };
      if (!payload.id) payload.id = uid("proj");
      setAndCache((prev) => {
        const idx = prev.findIndex((x) => x.projectName === payload.projectName);
        if (idx >= 0) {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], ...payload, updatedAt: new Date().toISOString() };
          return copy;
        }
        return [payload, ...prev];
      });
      return payload;
    },
    [setAndCache],
  );

  const remove = React.useCallback(
    async (id: string) => {
      setAndCache((prev) => prev.filter((x) => x.id !== id));
    },
    [setAndCache],
  );

  const toggleFavorite = React.useCallback(
    async (id: string) => {
      setAndCache((prev) =>
        prev.map((x) =>
          x.id === id
            ? { ...x, isFavorite: !x.isFavorite, updatedAt: new Date().toISOString() }
            : x,
        ),
      );
    },
    [setAndCache],
  );

  const value: ProjectsCtx = {
    projects,
    loading: false,
    hydrated,
    save,
    remove,
    toggleFavorite,
    isSaved: (name) => projects.some((x) => x.projectName === name),
    getSaved: (name) => projects.find((x) => x.projectName === name),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
