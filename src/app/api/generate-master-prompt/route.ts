import { NextResponse } from "next/server";
import { SYSTEM_PROMPT, buildMasterPromptPrompt } from "@/lib/system-prompt";
import { callAI } from "@/lib/ai";
import { parseJsonLoose } from "@/lib/utils";
import type { Blueprint, PromptPackage, ProjectIdea, Settings } from "@/types";

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
  const blueprint = body.blueprint as Blueprint | undefined;
  const settings = (body.settings as Settings) ?? ({} as Settings);

  if (!idea?.projectName) {
    return NextResponse.json({ error: "A project is required." }, { status: 400 });
  }

  let result;
  try {
    result = await callAI({
      task: "master",
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: buildMasterPromptPrompt(idea, blueprint ?? null),
      settings,
      keys: { gemini: settings.geminiKey, groq: settings.groqKey },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("NO_API_KEY")) {
      return NextResponse.json(
        { error: "NO_API_KEY", message: "Add an API key in Settings to build master prompts." },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const raw = parseJsonLoose<Partial<PromptPackage>>(result.content);
  if (!raw || !raw.masterPrompt) {
    return NextResponse.json(
      { error: "Could not parse the master prompt. Please try again." },
      { status: 502 },
    );
  }

  const promptPackage: PromptPackage = {
    masterPrompt: String(raw.masterPrompt),
    resumeBullets: toArray(raw.resumeBullets),
    githubReadmeOutline: toArray(raw.githubReadmeOutline),
    linkedinPost: raw.linkedinPost ?? "",
    interviewExplanation: raw.interviewExplanation ?? "",
  };

  return NextResponse.json({
    promptPackage,
    provider: result.provider,
    model: result.model,
    fellback: result.fellback,
  });
}
