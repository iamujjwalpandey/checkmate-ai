import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildIdeasPrompt } from "@/lib/system-prompt";
import { callAI } from "@/lib/ai";
import { parseJsonLoose, uid, clamp } from "@/lib/utils";
import type { GenerateInput, ProjectIdea, Settings } from "@/types";

export const dynamic = "force-dynamic";

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/[,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

function normalizeIdea(raw: Record<string, unknown>, idx: number): ProjectIdea {
  const s = (raw.scores ?? {}) as Record<string, unknown>;
  const num = (v: unknown, d: number) => clamp(Number(v) || d);
  return {
    id: uid("idea"),
    projectName: (raw.projectName as string) || `Untitled Project ${idx + 1}`,
    description: (raw.description as string) || "",
    domain: (raw.domain as string) || "",
    targetUsers: (raw.targetUsers as string) || "",
    problemSolved: (raw.problemSolved as string) || "",
    whyPowerful: (raw.whyPowerful as string) || "",
    targetCompanies: toArray(raw.targetCompanies),
    techStack: toArray(raw.techStack),
    aiIntegration: (raw.aiIntegration as string) || "",
    databasePlan: (raw.databasePlan as string) || "",
    frontendComplexity: num(raw.frontendComplexity, 5),
    backendComplexity: num(raw.backendComplexity, 5),
    deploymentMethod: (raw.deploymentMethod as string) || "",
    scores: {
      resumeImpact: num(s.resumeImpact, 7),
      githubValue: num(s.githubValue, 7),
      recruiterImpression: num(s.recruiterImpression, 7),
      marketRelevance: num(s.marketRelevance, 7),
      startupPotential: num(s.startupPotential, 7),
    },
    difficulty: (raw.difficulty as string) || "Advanced",
    estimatedBuildTime: (raw.estimatedBuildTime as string) || "3-4 weeks",
    mvpFeatures: toArray(raw.mvpFeatures),
    advancedFeatures: toArray(raw.advancedFeatures),
    uiInspiration: toArray(raw.uiInspiration),
    monetization: (raw.monetization as string) || "",
  };
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = body.input as GenerateInput | undefined;
  const settings = (body.settings as Settings) ?? ({} as Settings);

  if (!input?.domain || !input?.goal) {
    return NextResponse.json(
      { error: "Please choose a domain and goal before generating." },
      { status: 400 },
    );
  }

  const safeInput: GenerateInput = {
    domain: input.domain,
    goal: input.goal,
    skillLevel: input.skillLevel || "Industry Level",
    companyStyle: input.companyStyle || "Startup style",
    techStack: Array.isArray(input.techStack) ? input.techStack : [],
    ideaCount: Number(input.ideaCount) || 5,
    complexity: input.complexity || "Production-ready",
    outputType: input.outputType || "Full blueprint",
    freeTierOnly: Boolean(input.freeTierOnly),
  };

  let result;
  try {
    result = await callAI({
      task: "ideas",
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildIdeasPrompt(safeInput),
      settings,
      keys: { gemini: settings.geminiKey, groq: settings.groqKey },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("NO_API_KEY")) {
      return NextResponse.json(
        { error: "NO_API_KEY", message: "Add a Gemini or Groq API key in Settings to start." },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const parsed = parseJsonLoose<{ ideas?: unknown[] }>(result.content);
  const rawIdeas = parsed?.ideas ?? (Array.isArray(parsed) ? parsed : []);
  const ideas = (rawIdeas as Record<string, unknown>[]).map(normalizeIdea);

  if (!ideas.length) {
    return NextResponse.json(
      {
        error:
          "The model responded, but the ideas couldn't be parsed. Try again or switch provider in Settings.",
        raw: result.content.slice(0, 400),
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ideas,
    provider: result.provider,
    model: result.model,
    fellback: result.fellback,
  });
}
