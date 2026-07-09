import { NextResponse } from "next/server";
import { testGemini } from "@/lib/ai/gemini";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { key?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const key = (body.key || process.env.GEMINI_API_KEY || "").trim();
  if (!key) {
    return NextResponse.json(
      { ok: false, message: "No Gemini key provided." },
      { status: 400 },
    );
  }

  try {
    const res = await testGemini(key, body.model);
    return NextResponse.json({ ok: true, model: res.model, message: "Gemini connection healthy." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Connection failed.";
    return NextResponse.json({ ok: false, message }, { status: 200 });
  }
}
