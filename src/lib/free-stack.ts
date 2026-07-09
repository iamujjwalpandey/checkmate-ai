export interface FreeTool {
  name: string;
  category: string;
  why: string;
  url?: string;
}

export const FREE_STACK: FreeTool[] = [
  { name: "Vercel", category: "Hosting", why: "Generous free Hobby tier, perfect for Next.js." },
  { name: "Supabase", category: "Database + Auth", why: "Free Postgres, auth, storage, edge functions." },
  { name: "Neon", category: "Database", why: "Serverless Postgres free tier with branching." },
  { name: "Cloudflare Pages", category: "Hosting / Edge", why: "Free static + edge hosting, Workers included." },
  { name: "GitHub Pages", category: "Hosting", why: "Free static site hosting from your repo." },
  { name: "Firebase", category: "Database + Auth", why: "Spark plan free tier for auth + Firestore." },
  { name: "Hugging Face", category: "AI Models", why: "Free hosted inference for open models." },
  { name: "Gemini API", category: "AI", why: "Free tier on 2.5 Flash / Flash-Lite for structured output." },
  { name: "Groq API", category: "AI", why: "Free OpenAI-compatible ultra-fast inference." },
  { name: "Auth.js", category: "Auth", why: "Free open-source auth for Next.js." },
  { name: "Clerk", category: "Auth", why: "Free tier for up to 10k MAU." },
  { name: "Upstash", category: "Cache / Queue", why: "Free serverless Redis & Kafka daily quota." },
  { name: "Resend", category: "Email", why: "Free transactional email tier." },
  { name: "Cloudinary", category: "Media", why: "Free image/video transformation credits." },
];

export const FREE_STACK_CATEGORIES = Array.from(
  new Set(FREE_STACK.map((t) => t.category)),
);
