import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-4)}`;
}

export function clamp(n: number, min = 0, max = 10) {
  return Math.max(min, Math.min(max, n));
}

export function avg(nums: number[]) {
  if (!nums.length) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}

/** Robustly parse JSON from an LLM response that may include code fences or prose. */
export function parseJsonLoose<T = unknown>(raw: string): T | null {
  if (!raw) return null;
  let text = raw.trim();
  // strip markdown code fences
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  try {
    return JSON.parse(text) as T;
  } catch {
    /* try extracting the first balanced JSON object/array */
  }
  const tryExtract = (open: string, close: string) => {
    const start = text.indexOf(open);
    if (start === -1) return null;
    let depth = 0;
    let inStr = false;
    let esc = false;
    for (let i = start; i < text.length; i++) {
      const ch = text[i];
      if (inStr) {
        if (esc) esc = false;
        else if (ch === "\\") esc = true;
        else if (ch === '"') inStr = false;
      } else {
        if (ch === '"') inStr = true;
        else if (ch === open) depth++;
        else if (ch === close) {
          depth--;
          if (depth === 0) return text.slice(start, i + 1);
        }
      }
    }
    return null;
  };
  const obj = tryExtract("{", "}") || tryExtract("[", "]");
  if (obj) {
    try {
      return JSON.parse(obj) as T;
    } catch {
      return null;
    }
  }
  return null;
}

export async function copyToClipboard(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fall through */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function downloadFile(filename: string, content: string, type = "text/markdown") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDate(iso);
}

export function difficultyColor(level: string) {
  const l = level.toLowerCase();
  if (l.includes("begin") || l.includes("easy")) return "text-emerald-300";
  if (l.includes("inter")) return "text-accent-300";
  if (l.includes("advan") || l.includes("industry")) return "text-brand-300";
  if (l.includes("faang") || l.includes("research") || l.includes("expert") || l.includes("god"))
    return "text-violet-400";
  return "text-slate-300";
}

export function scoreColor(n: number) {
  if (n >= 8.5) return "#34d399";
  if (n >= 7) return "#22d3ee";
  if (n >= 5) return "#818cf8";
  if (n >= 3.5) return "#fbbf24";
  return "#f87171";
}
