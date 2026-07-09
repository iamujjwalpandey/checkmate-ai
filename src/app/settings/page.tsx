"use client";

import * as React from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  Trash2,
  Download,
  Upload,
  Plug,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
  Settings as SettingsIcon,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { useSettings } from "@/components/providers/settings";
import { useProjects } from "@/components/providers/projects";
import { useToast } from "@/components/providers/toast";
import { useGuestId } from "@/hooks/use-guest";
import {
  PROVIDERS,
  GEMINI_MODELS,
  GROQ_MODELS,
  GOALS,
  TECH_STACKS,
  OUTPUT_TYPES,
  COMPANY_STYLES,
  SKILL_LEVELS,
} from "@/lib/constants";
import { clearAllLocal } from "@/lib/storage";
import { downloadFile, cn } from "@/lib/utils";
import type { SavedProject } from "@/types";

type TestState = "idle" | "loading" | "ok" | "error";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-violet-500/10 text-brand-300">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { settings, update, clearKeys, hasGemini, hasGroq, activeProviderLabel, activeModel } =
    useSettings();
  const { projects, save } = useProjects();
  const { toast } = useToast();
  const { guestId } = useGuestId();

  const [showGem, setShowGem] = React.useState(false);
  const [showGroq, setShowGroq] = React.useState(false);
  const [tests, setTests] = React.useState<{ gemini: TestState; groq: TestState }>({
    gemini: "idle",
    groq: "idle",
  });
  const [testMsg, setTestMsg] = React.useState<{ gemini: string; groq: string }>({
    gemini: "",
    groq: "",
  });
  const fileRef = React.useRef<HTMLInputElement>(null);

  const runTest = async (provider: "gemini" | "groq") => {
    const key = provider === "gemini" ? settings.geminiKey : settings.groqKey;
    const model = provider === "gemini" ? settings.geminiModel : settings.groqModel;
    if (!key) {
      setTests((p) => ({ ...p, [provider]: "error" }));
      setTestMsg((p) => ({ ...p, [provider]: "Enter a key first." }));
      return;
    }
    setTests((p) => ({ ...p, [provider]: "loading" }));
    setTestMsg((p) => ({ ...p, [provider]: "" }));
    try {
      const res = await fetch(`/api/test-${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, model }),
      });
      const data = await res.json();
      setTests((p) => ({ ...p, [provider]: data.ok ? "ok" : "error" }));
      setTestMsg((p) => ({ ...p, [provider]: data.message ?? "" }));
    } catch {
      setTests((p) => ({ ...p, [provider]: "error" }));
      setTestMsg((p) => ({ ...p, [provider]: "Network error." }));
    }
  };

  const handleExport = () => {
    downloadFile("checkmate-saved-projects.json", JSON.stringify(projects, null, 2), "application/json");
    toast({ title: "Exported saved projects", variant: "success" });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as SavedProject[];
      if (!Array.isArray(parsed)) throw new Error("Invalid file");
      let count = 0;
      for (const item of parsed) {
        if (!item.projectName) continue;
        await save({ ...item, id: "", guestId });
        count++;
      }
      toast({ title: `Imported ${count} projects`, variant: "success" });
    } catch {
      toast({ title: "Import failed", description: "Please use a valid export JSON file.", variant: "error" });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleClearData = () => {
    clearAllLocal();
    toast({ title: "Local data cleared", description: "Reload to reflect changes.", variant: "default" });
    setTimeout(() => window.location.reload(), 900);
  };

  const toOpts = (arr: string[]) => arr.map((v) => ({ value: v, label: v }));

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Badge variant="brand" className="w-fit">
          <SettingsIcon className="h-3.5 w-3.5" /> Settings
        </Badge>
        <h1 className="font-display text-3xl font-bold tracking-[-0.02em] text-white sm:text-4xl">
          Provider & preferences
        </h1>
        <p className="max-w-2xl text-sm text-slate-400">
          Configure your AI providers, default generation settings and data. Keys are stored only in
          your browser.
        </p>
      </div>

      {/* Status card */}
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-brand-500/20 to-accent-500/10">
            <Zap className="h-5 w-5 text-brand-300" />
            <span
              className={cn(
                "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-navy-900",
                hasGemini || hasGroq ? "bg-emerald-400" : "bg-amber-400",
              )}
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{activeProviderLabel}</p>
            <p className="text-xs text-slate-400">
              {hasGemini || hasGroq ? `Model: ${activeModel}` : "No provider configured"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.freeTierOnly && (
            <Badge variant="success">
              <Sparkles className="h-3 w-3" /> Free Tier Only
            </Badge>
          )}
          <Badge variant={settings.autoDetect ? "brand" : "outline"}>
            {settings.autoDetect ? "Auto Detect" : "Manual"}
          </Badge>
          <Badge variant={hasGemini ? "brand" : "outline"}>
            Gemini {hasGemini ? "✓" : "—"}
          </Badge>
          <Badge variant={hasGroq ? "accent" : "outline"}>
            Groq {hasGroq ? "✓" : "—"}
          </Badge>
        </div>
      </Card>

      {/* AI providers */}
      <Section
        icon={Plug}
        title="AI Provider Settings"
        description="Bring your own free keys. Auto Detect routes deep tasks to Gemini and fast tasks to Groq, with automatic fallback."
      >
        <div className="flex flex-col gap-4">
          {/* Gemini */}
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label>Google Gemini API key</Label>
              {tests.gemini !== "idle" && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-[11px]",
                    tests.gemini === "ok" && "text-emerald-400",
                    tests.gemini === "error" && "text-red-400",
                    tests.gemini === "loading" && "text-slate-400",
                  )}
                >
                  {tests.gemini === "ok" && <CheckCircle2 className="h-3 w-3" />}
                  {tests.gemini === "error" && <XCircle className="h-3 w-3" />}
                  {tests.gemini === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
                  {tests.gemini === "ok" ? "Connected" : testMsg.gemini}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showGem ? "text" : "password"}
                  value={settings.geminiKey}
                  onChange={(e) => update({ geminiKey: e.target.value })}
                  placeholder="AIza…"
                  className="pr-9"
                />
                <button
                  onClick={() => setShowGem((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-300"
                >
                  {showGem ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button variant="secondary" loading={tests.gemini === "loading"} onClick={() => runTest("gemini")}>
                <Plug className="h-4 w-4" /> Test
              </Button>
            </div>
            <Select
              className="mt-2"
              value={settings.geminiModel}
              onValueChange={(v) => update({ geminiModel: v })}
              options={GEMINI_MODELS.map((m) => ({ value: m.id, label: m.label, note: m.note }))}
            />
          </div>

          {/* Groq */}
          <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <Label>Groq API key</Label>
              {tests.groq !== "idle" && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-[11px]",
                    tests.groq === "ok" && "text-emerald-400",
                    tests.groq === "error" && "text-red-400",
                    tests.groq === "loading" && "text-slate-400",
                  )}
                >
                  {tests.groq === "ok" && <CheckCircle2 className="h-3 w-3" />}
                  {tests.groq === "error" && <XCircle className="h-3 w-3" />}
                  {tests.groq === "loading" && <Loader2 className="h-3 w-3 animate-spin" />}
                  {tests.groq === "ok" ? "Connected" : testMsg.groq}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showGroq ? "text" : "password"}
                  value={settings.groqKey}
                  onChange={(e) => update({ groqKey: e.target.value })}
                  placeholder="gsk_…"
                  className="pr-9"
                />
                <button
                  onClick={() => setShowGroq((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 hover:text-slate-300"
                >
                  {showGroq ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button variant="secondary" loading={tests.groq === "loading"} onClick={() => runTest("groq")}>
                <Plug className="h-4 w-4" /> Test
              </Button>
            </div>
            <Select
              className="mt-2"
              value={settings.groqModel}
              onValueChange={(v) => update({ groqModel: v })}
              options={GROQ_MODELS.map((m) => ({ value: m.id, label: m.label, note: m.note }))}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-white/[0.02] p-4">
          <Row label="Preferred provider" hint="Auto Detect picks the best model per task">
            <Select
              className="sm:w-64"
              value={settings.preferredProvider}
              onValueChange={(v) => update({ preferredProvider: v as typeof settings.preferredProvider })}
              options={PROVIDERS.map((p) => ({ value: p.id, label: p.label }))}
            />
          </Row>
          <Row label="Auto Detect best free model" hint="Smart routing + automatic fallback">
            <Switch checked={settings.autoDetect} onCheckedChange={(v) => update({ autoDetect: v })} />
          </Row>
          <Row label="Free Tier Only Mode" hint="Recommend only zero-cost tools & services">
            <Switch
              checked={settings.freeTierOnly}
              onCheckedChange={(v) => update({ freeTierOnly: v })}
            />
          </Row>
        </div>

        <Button variant="danger" onClick={() => { clearKeys(); toast({ title: "API keys cleared", variant: "default" }); }}>
          <Trash2 className="h-4 w-4" /> Clear saved keys
        </Button>
      </Section>

      {/* Preferences */}
      <Section
        icon={Sparkles}
        title="App Preferences"
        description="Defaults pre-filled on the Project Generator."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="mb-1.5 block">Default difficulty</Label>
            <Select value={settings.defaultDifficulty} onValueChange={(v) => update({ defaultDifficulty: v })} options={toOpts(SKILL_LEVELS)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Default goal</Label>
            <Select value={settings.defaultGoal} onValueChange={(v) => update({ defaultGoal: v })} options={toOpts(GOALS)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Default tech stack</Label>
            <Select value={settings.defaultStack} onValueChange={(v) => update({ defaultStack: v })} options={toOpts(TECH_STACKS)} />
          </div>
          <div>
            <Label className="mb-1.5 block">Default output type</Label>
            <Select value={settings.defaultOutputType} onValueChange={(v) => update({ defaultOutputType: v })} options={toOpts(OUTPUT_TYPES)} />
          </div>
          <div className="sm:col-span-2">
            <Label className="mb-1.5 block">Default target company style</Label>
            <Select value={settings.defaultCompanyStyle} onValueChange={(v) => update({ defaultCompanyStyle: v })} options={toOpts(COMPANY_STYLES)} />
          </div>
        </div>
      </Section>

      {/* Data */}
      <Section
        icon={Database}
        title="Data Settings"
        description="Export, import or wipe your local workspace. Guest ID links your saves."
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4" /> Export saved projects
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload className="h-4 w-4" /> Import projects
          </Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
          <Button variant="danger" onClick={handleClearData}>
            <Trash2 className="h-4 w-4" /> Clear local data
          </Button>
        </div>
        <p className="text-[11px] text-slate-600">Guest ID: <span className="font-mono text-slate-500">{guestId || "—"}</span></p>
      </Section>

      {/* Security */}
      <Card className="flex items-start gap-3 border-brand-400/20 bg-brand-500/[0.04] p-5">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-300" />
        <p className="text-sm leading-relaxed text-slate-300">
          <span className="font-semibold text-white">Security note.</span> Your API keys are never
          hardcoded. In demo mode, keys are stored locally in your browser. For production, use
          secure environment variables or encrypted database storage.
        </p>
      </Card>
    </div>
  );
}
