/**
 * Lightweight health check. This app is fully client-side persisted
 * (localStorage), so there is no database dependency to verify.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    ok: true,
    storage: "local",
    providers: ["gemini", "groq"],
  });
}
