import type { AICallInput, AICallResult, AITask, ProviderId, Settings } from "@/types";
import { callGemini } from "@/lib/ai/gemini";
import { callGroq } from "@/lib/ai/groq";

export interface AvailableProviders {
  gemini: boolean;
  groq: boolean;
}

export function getEnvKeys() {
  return {
    gemini: process.env.GEMINI_API_KEY?.trim() || "",
    groq: process.env.GROQ_API_KEY?.trim() || "",
  };
}

export function resolveKeys(input: AICallInput) {
  const env = getEnvKeys();
  const gemini =
    env.gemini || input.settings.geminiKey?.trim() || input.keys.gemini?.trim() || "";
  const groq =
    env.groq || input.settings.groqKey?.trim() || input.keys.groq?.trim() || "";
  return { gemini, groq };
}

export function availableFrom(keys: { gemini: string; groq: string }): AvailableProviders {
  return { gemini: Boolean(keys.gemini), groq: Boolean(keys.groq) };
}

/** Auto-detect routing: deep/long tasks → Gemini, fast tasks → Groq. */
export function pickProvider(
  task: AITask,
  settings: Settings,
  available: AvailableProviders,
): { provider: "gemini" | "groq"; model: string } {
  const preferLong = task === "blueprint" || task === "master";
  const useAuto = settings.preferredProvider === "auto" || settings.autoDetect;

  let provider: ProviderId;
  if (!useAuto) {
    provider = settings.preferredProvider;
  } else {
    provider = preferLong ? "gemini" : "groq";
  }

  // honour availability, falling back to whichever exists
  if (provider === "gemini" && !available.gemini) provider = "groq";
  if (provider === "groq" && !available.groq) provider = "gemini";

  if (provider === "gemini") {
    return { provider: "gemini", model: settings.geminiModel };
  }
  return { provider: "groq", model: settings.groqModel };
}

export async function callAI(input: AICallInput): Promise<AICallResult> {
  const keys = resolveKeys(input);
  const available = availableFrom(keys);

  if (!available.gemini && !available.groq) {
    throw new Error("NO_API_KEY");
  }

  const primary = pickProvider(input.task, input.settings, available);
  const fallback = primary.provider === "gemini" ? "groq" : "gemini";
  const canFallback = available[fallback];

  const run = async (provider: "gemini" | "groq", model: string) => {
    if (provider === "gemini") {
      return callGemini({
        apiKey: keys.gemini,
        model,
        systemPrompt: input.systemPrompt,
        userPrompt: input.userPrompt,
      });
    }
    return callGroq({
      apiKey: keys.groq,
      model,
      systemPrompt: input.systemPrompt,
      userPrompt: input.userPrompt,
    });
  };

  try {
    const content = await run(primary.provider, primary.model);
    return { provider: primary.provider, model: primary.model, content };
  } catch (err) {
    if (!canFallback) throw err;
    const fbModel =
      fallback === "gemini" ? input.settings.geminiModel : input.settings.groqModel;
    const content = await run(fallback, fbModel);
    return { provider: fallback, model: fbModel, content, fellback: true };
  }
}
