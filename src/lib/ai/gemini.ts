import { DEFAULT_GEMINI_MODEL } from "@/lib/constants";

export interface GeminiArgs {
  apiKey: string;
  model?: string;
  systemPrompt: string;
  userPrompt: string;
}

const ENDPOINT = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export async function callGemini({
  apiKey,
  model = DEFAULT_GEMINI_MODEL,
  systemPrompt,
  userPrompt,
}: GeminiArgs): Promise<string> {
  const res = await fetch(ENDPOINT(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.95,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!res.ok) {
    const detail = await safeText(res);
    throw new Error(`Gemini error (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts)
    ? parts.map((p: { text?: string }) => p?.text ?? "").join("")
    : "";
  if (!text) {
    const blocked = data?.promptFeedback?.blockReason;
    throw new Error(
      blocked
        ? `Gemini blocked the request (${blocked}). Try rephrasing.`
        : "Gemini returned an empty response.",
    );
  }
  return text;
}

export async function testGemini(apiKey: string, model = DEFAULT_GEMINI_MODEL) {
  const res = await fetch(ENDPOINT(model), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: 'Reply with the JSON: {"ok":true}' }] }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 32 },
    }),
  });
  if (!res.ok) {
    const detail = await safeText(res);
    throw new Error(`Gemini error (${res.status}): ${detail}`);
  }
  return { ok: true as const, model };
}

async function safeText(res: Response) {
  try {
    const j = await res.json();
    return j?.error?.message || JSON.stringify(j).slice(0, 240);
  } catch {
    try {
      return (await res.text()).slice(0, 240);
    } catch {
      return res.statusText;
    }
  }
}
