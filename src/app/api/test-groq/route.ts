import { NextResponse } from "next/server";
import { testGroq } from "@/lib/ai/groq";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { key?: string; model?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const key = (body.key || process.env.GROQ_API_KEY || "").trim();
  if (!key) {
    return NextResponse.json({ ok: false, message: "No Groq key provided." }, { status: 400 });
  }

  try {
    const res = await testGroq(key, body.model);
    return NextResponse.json({ ok: true, model: res.model, message: "Groq connection healthy." });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Connection failed.";
    return NextResponse.json({ ok: false, message }, { status: 200 });
  }
}
