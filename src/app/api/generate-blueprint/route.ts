import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildBlueprintPrompt } from "@/lib/system-prompt";
import { callAI } from "@/lib/ai";
import { parseJsonLoose } from "@/lib/utils";
import type { Blueprint, ProjectIdea, Settings } from "@/types";

export const dynamic = "force-dynamic";

function toArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof v === "string")
    return v
      .split(/\n|(?<=[a-z])\.\s+/)
      .map((s) => s.trim().replace(/^\d+[.)]\s*/, ""))
      .filter(Boolean);
  return [];
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const idea = body.idea as ProjectIdea | undefined;
  const settings = (body.settings as Settings) ?? ({} as Settings);

  if (!idea?.projectName) {
    return NextResponse.json({ error: "A project is required." }, { status: 400 });
  }

  let result;
  try {
    result = await callAI({
      task: "blueprint",
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildBlueprintPrompt(idea),
      settings,
      keys: { gemini: settings.geminiKey, groq: settings.groqKey },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("NO_API_KEY")) {
      return NextResponse.json(
        { error: "NO_API_KEY", message: "Add an API key in Settings to generate blueprints." },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const raw = parseJsonLoose<Partial<Blueprint>>(result.content);
  if (!raw) {
    return NextResponse.json(
      { error: "Could not parse the blueprint. Please try again." },
      { status: 502 },
    );
  }

  const blueprint: Blueprint = {
    productVision: raw.productVision ?? "",
    targetUsers: raw.targetUsers ?? idea.targetUsers,
    coreProblem: raw.coreProblem ?? idea.problemSolved,
    coreFeatures: toArray(raw.coreFeatures),
    mvpFeatures: toArray(raw.mvpFeatures).length ? toArray(raw.mvpFeatures) : idea.mvpFeatures,
    advancedFeatures: toArray(raw.advancedFeatures).length
      ? toArray(raw.advancedFeatures)
      : idea.advancedFeatures,
    techStack: toArray(raw.techStack).length ? toArray(raw.techStack) : idea.techStack,
    frontendRequirements: raw.frontendRequirements ?? "",
    backendRequirements: raw.backendRequirements ?? "",
    databaseSchema: raw.databaseSchema ?? idea.databasePlan,
    aiIntegration: raw.aiIntegration ?? idea.aiIntegration,
    authentication: raw.authentication ?? "",
    dashboardLayout: raw.dashboardLayout ?? "",
    uiUxStyle: raw.uiUxStyle ?? "",
    pages: toArray(raw.pages),
    components: toArray(raw.components),
    apiRoutes: toArray(raw.apiRoutes),
    errorHandling: raw.errorHandling ?? "",
    loadingStates: raw.loadingStates ?? "",
    emptyStates: raw.emptyStates ?? "",
    responsiveDesign: raw.responsiveDesign ?? "",
    securityRules: raw.securityRules ?? "",
    performanceRequirements: raw.performanceRequirements ?? "",
    deploymentInstructions: raw.deploymentInstructions ?? idea.deploymentMethod,
    environmentVariables: toArray(raw.environmentVariables),
    readmeInstruction: raw.readmeInstruction ?? "",
    finalInstruction: raw.finalInstruction ?? "",
  };

  return NextResponse.json({
    blueprint,
    provider: result.provider,
    model: result.model,
    fellback: result.fellback,
  });
}
