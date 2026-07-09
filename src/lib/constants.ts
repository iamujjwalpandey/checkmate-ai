import type { ProviderId } from "@/types";

export const APP_NAME = "CHECKMATE AI";
export const AI_PERSONA = "ProjectForge AI";

export const DOMAINS = [
  "AI / ML",
  "Full Stack",
  "SaaS",
  "Developer Tools",
  "Cybersecurity",
  "Data Science",
  "Automation",
  "EdTech",
  "FinTech",
  "HealthTech",
  "Productivity",
  "AI Agents",
  "Web3",
  "Cloud",
  "Mobile App",
  "Creator Economy",
  "Resume Project",
  "Startup MVP",
];

export const GOALS = [
  "Resume",
  "GitHub",
  "Internship",
  "Job interview",
  "Freelancing",
  "Startup MVP",
  "Hackathon",
  "Personal brand",
  "Learning",
  "Portfolio",
];

export const SKILL_LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Industry Level",
  "FAANG Level",
];

export const COMPANY_STYLES = [
  "Google",
  "Meta",
  "Apple",
  "Microsoft",
  "Amazon",
  "Nvidia",
  "Anthropic",
  "OpenAI",
  "SpaceX",
  "Stripe",
  "Vercel",
  "Linear",
  "Perplexity",
  "Notion",
  "Startup style",
  "Enterprise style",
];

export const TECH_STACKS = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Supabase",
  "Firebase",
  "Node.js",
  "Express",
  "Python",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Gemini API",
  "Groq API",
  "LangChain",
  "Hugging Face",
  "Docker",
  "Vercel",
  "Cloudflare",
];

export const IDEA_COUNTS = [5, 10, 25, 50, 100];

export const COMPLEXITIES = [
  "MVP",
  "Production-ready",
  "Advanced",
  "Research-level",
  "Startup-grade",
];

export const OUTPUT_TYPES = [
  "Idea only",
  "Full blueprint",
  "Master prompt",
  "Resume package",
  "Complete project package",
];

export const PROVIDERS: { id: ProviderId; label: string; description: string }[] = [
  {
    id: "auto",
    label: "Auto Detect Best Free Model",
    description: "Smart routing — Gemini for deep blueprints, Groq for rapid ideas.",
  },
  {
    id: "gemini",
    label: "Google Gemini",
    description: "Deeper reasoning, long-form master prompts, structured output.",
  },
  {
    id: "groq",
    label: "Groq",
    description: "Ultra-fast generation, rapid brainstorming, low latency.",
  },
];

export const GEMINI_MODELS = [
  { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", note: "Balanced • free tier" },
  { id: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash-Lite", note: "Fastest • free tier" },
  { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", note: "Deepest reasoning • free tier" },
];

export const GROQ_MODELS = [
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B Versatile", note: "Best balance • free tier" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant", note: "Fastest • free tier" },
  { id: "llama-3.1-70b-versatile", label: "Llama 3.1 70B Versatile", note: "Complex tasks • free tier" },
];

export const DEFAULT_GEMINI_MODEL = "gemini-2.5-flash";
export const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

export const LOADING_MESSAGES = [
  "Analyzing industry trends…",
  "Studying recruiter expectations…",
  "Designing project architecture…",
  "Generating recruiter-worthy ideas…",
  "Scoring resume, GitHub & startup impact…",
  "Mapping the tech stack & AI integration…",
  "Crafting the master prompt…",
  "Optimizing for vibe coding platforms…",
  "Adding deployment & monetization paths…",
  "Finalizing your build-ready blueprint…",
];

export const VIBE_PLATFORMS = [
  "Lovable",
  "Bolt",
  "Cursor",
  "Windsurf",
  "Replit",
  "v0",
  "Claude Code",
];

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/generate", label: "Generate Ideas", icon: "Sparkles" },
  { href: "/idea-explorer", label: "Idea Explorer", icon: "Compass" },
  { href: "/prompt-builder", label: "Prompt Builder", icon: "Wand2" },
  { href: "/saved", label: "Saved Projects", icon: "Bookmark" },
  { href: "/settings", label: "Settings", icon: "Settings" },
  { href: "/about", label: "How It Works", icon: "GraduationCap" },
] as const;
