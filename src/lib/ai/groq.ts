import { DEFAULT_GROQ_MODEL } from "@/lib/constants";

export interface GroqArgs {
  apiKey: string;
  model?: string;
  systemPrompt: string;
  userPrompt: string;
}

const ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export async function callGroq({
  apiKey,
  model = DEFAULT_GROQ_MODEL,
  systemPrompt,
  userPrompt,
}: GroqArgs): Promise<string> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await safeText(res);
    throw new Error(`Groq error (${res.status}): ${detail}`);
  }

  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Groq returned an empty response.");
  return text;
}

export async function testGroq(apiKey: string, model = DEFAULT_GROQ_MODEL) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: 16,
      messages: [{ role: "user", content: 'Reply with JSON: {"ok":true}' }],
    }),
  });
  if (!res.ok) {
    const detail = await safeText(res);
    throw new Error(`Groq error (${res.status}): ${detail}`);
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
