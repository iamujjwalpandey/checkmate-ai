import type { Settings, SavedProject } from "@/types";
import { DEFAULT_GEMINI_MODEL, DEFAULT_GROQ_MODEL } from "@/lib/constants";

const PREFIX = "checkmate:";
const K = {
  guest: `${PREFIX}guest_id`,
  settings: `${PREFIX}settings`,
  projects: `${PREFIX}projects`,
};

function isClient() {
  return typeof window !== "undefined";
}

export function getGuestId(): string {
  if (!isClient()) return "server";
  let id = localStorage.getItem(K.guest);
  if (!id) {
    id = `guest_${Math.random().toString(36).slice(2, 12)}${Date.now().toString(36)}`;
    localStorage.setItem(K.guest, id);
  }
  return id;
}

export const DEFAULT_SETTINGS: Settings = {
  geminiKey: "",
  groqKey: "",
  preferredProvider: "auto",
  autoDetect: true,
  freeTierOnly: false,
  geminiModel: DEFAULT_GEMINI_MODEL,
  groqModel: DEFAULT_GROQ_MODEL,
  defaultDifficulty: "Industry Level",
  defaultGoal: "Resume",
  defaultStack: "Next.js",
  defaultOutputType: "Full blueprint",
  defaultCompanyStyle: "Vercel",
};

export function loadSettings(): Settings {
  if (!isClient()) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(K.settings);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: Settings) {
  if (!isClient()) return;
  localStorage.setItem(K.settings, JSON.stringify(s));
}

export function loadProjectsCache(): SavedProject[] {
  if (!isClient()) return [];
  try {
    const raw = localStorage.getItem(K.projects);
    return raw ? (JSON.parse(raw) as SavedProject[]) : [];
  } catch {
    return [];
  }
}

export function saveProjectsCache(list: SavedProject[]) {
  if (!isClient()) return;
  try {
    localStorage.setItem(K.projects, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

export function clearAllLocal() {
  if (!isClient()) return;
  localStorage.removeItem(K.settings);
  localStorage.removeItem(K.projects);
}
