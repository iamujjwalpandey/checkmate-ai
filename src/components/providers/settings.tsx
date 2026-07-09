"use client";

import * as React from "react";
import type { ProviderId, Settings } from "@/types";
import { DEFAULT_SETTINGS, loadSettings, saveSettings } from "@/lib/storage";

interface SettingsCtx {
  settings: Settings;
  hydrated: boolean;
  update: (partial: Partial<Settings>) => void;
  replace: (s: Settings) => void;
  clearKeys: () => void;
  hasGemini: boolean;
  hasGroq: boolean;
  hasAnyKey: boolean;
  activeProvider: ProviderId | "none";
  activeProviderLabel: string;
  activeModel: string;
}

const Ctx = React.createContext<SettingsCtx | null>(null);

export function useSettings() {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useSettings must be used within SettingsProvider");
  return c;
}

const PROVIDER_LABELS: Record<ProviderId, string> = {
  auto: "Auto Detect",
  gemini: "Google Gemini",
  groq: "Groq",
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<Settings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    setSettings(loadSettings());
    setHydrated(true);
  }, []);

  const persist = React.useCallback((next: Settings) => {
    setSettings(next);
    saveSettings(next);
  }, []);

  const update = React.useCallback(
    (partial: Partial<Settings>) => persist({ ...settings, ...partial }),
    [settings, persist],
  );

  const replace = React.useCallback((s: Settings) => persist(s), [persist]);
  const clearKeys = React.useCallback(
    () => persist({ ...settings, geminiKey: "", groqKey: "" }),
    [settings, persist],
  );

  const hasGemini = Boolean(settings.geminiKey.trim());
  const hasGroq = Boolean(settings.groqKey.trim());
  const hasAnyKey = hasGemini || hasGroq;

  const autoActive: ProviderId | "none" =
    settings.preferredProvider === "auto" || settings.autoDetect
      ? hasGemini && hasGroq
        ? "auto"
        : hasGemini
          ? "gemini"
          : hasGroq
            ? "groq"
            : "none"
      : settings.preferredProvider;

  const activeProvider: ProviderId | "none" = !hasAnyKey
    ? "none"
    : autoActive;

  const activeModel =
    activeProvider === "groq" ? settings.groqModel : settings.geminiModel;

  const value: SettingsCtx = {
    settings,
    hydrated,
    update,
    replace,
    clearKeys,
    hasGemini,
    hasGroq,
    hasAnyKey,
    activeProvider,
    activeProviderLabel:
      activeProvider === "none" ? "No provider" : PROVIDER_LABELS[activeProvider],
    activeModel,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
