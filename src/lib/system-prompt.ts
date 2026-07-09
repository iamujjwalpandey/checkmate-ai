import { AI_PERSONA } from "@/lib/constants";
import type { GenerateInput, ProjectIdea, Blueprint } from "@/types";

export const SYSTEM_PROMPT = `You are ${AI_PERSONA}, an elite AI project architect, senior software engineer, product strategist, technical recruiter, startup advisor, UI/UX strategist, and vibe coding prompt engineer.

Your job is to generate ONLY high-quality, modern, industry-level software project ideas and convert them into complete build-ready prompts. Avoid generic beginner projects (calculators, to-do apps, weather apps, basic CRUD) unless the user explicitly asks for beginner level. Every project must be practical, impressive, technically meaningful, and useful for resume, GitHub, interviews, or startup MVPs.

Always include clear architecture, features, tech stack, AI integration, deployment plan, UI inspiration, realistic scoring (0-10), and an implementation roadmap. When generating prompts for coding tools, be extremely specific, structured, and execution-focused.

Rules:
- Respond with valid minified JSON only. No markdown, no commentary outside JSON.
- All scores are numbers from 0 to 10 with one decimal place.
- All arrays contain concise, high-signal strings.
- Be creative but realistic. Prefer 2026-era tech: LLM agents, RAG, vector search, edge functions, real-time, multi-tenant SaaS, automation, and modern UX.`;

export function buildIdeasPrompt(input: GenerateInput): string {
  const stack = input.techStack.length ? input.techStack.join(", ") : "let the AI choose a modern stack";
  const free = input.freeTierOnly
    ? `IMPORTANT — FREE TIER ONLY MODE IS ON: Every recommended tool, database, host, AI model, and service MUST have a free tier or zero-cost path (Vercel, Supabase, Neon, Cloudflare, GitHub Pages, Hugging Face free models, Gemini/Groq free tiers, Auth.js, Upstash). Do not recommend paid-only services.`
    : "";
  const avoid =
    input.skillLevel.toLowerCase().includes("begin")
      ? "Acceptable to include approachable-but-still-impressive projects."
      : "Do NOT generate basic projects (todo, calculator, weather, simple CRUD). Only ambitious, real-world, production-grade ideas.";

  return `Generate ${input.ideaCount} high-impact, ${input.complexity} software project ideas.

Context:
- Domain: ${input.domain}
- Goal: ${input.goal}
- Skill level: ${input.skillLevel}
- Target company design bar: ${input.companyStyle}
- Preferred tech stack: ${stack}
${free}

${avoid}

Return JSON in EXACTLY this shape:
{
  "ideas": [
    {
      "projectName": "string",
      "description": "one punchy line",
      "domain": "string",
      "targetUsers": "string",
      "problemSolved": "string",
      "whyPowerful": "string",
      "targetCompanies": ["string"],
      "techStack": ["string"],
      "aiIntegration": "string",
      "databasePlan": "string",
      "frontendComplexity": 0,
      "backendComplexity": 0,
      "deploymentMethod": "string",
      "scores": {
        "resumeImpact": 0,
        "githubValue": 0,
        "recruiterImpression": 0,
        "marketRelevance": 0,
        "startupPotential": 0
      },
      "difficulty": "Beginner | Intermediate | Advanced | Industry Level | FAANG Level",
      "estimatedBuildTime": "e.g. 2-3 weeks",
      "mvpFeatures": ["string"],
      "advancedFeatures": ["string"],
      "uiInspiration": ["real product names"],
      "monetization": "string"
    }
  ]
}

Return ${input.ideaCount} idea objects in the "ideas" array. Make them distinct across sub-domains. Make every idea genuinely portfolio-worthy.`;
}

export function buildBlueprintPrompt(idea: ProjectIdea): string {
  return `Take this project and produce a COMPLETE, build-ready blueprint.

PROJECT: ${idea.projectName}
DESCRIPTION: ${idea.description}
TARGET USERS: ${idea.targetUsers}
PROBLEM: ${idea.problemSolved}
AI INTEGRATION: ${idea.aiIntegration}
DATABASE: ${idea.databasePlan}
TECH STACK: ${idea.techStack.join(", ")}
MVP FEATURES: ${idea.mvpFeatures.join("; ")}
ADVANCED FEATURES: ${idea.advancedFeatures.join("; ")}

Return JSON in EXACTLY this shape:
{
  "productVision": "string",
  "targetUsers": "string",
  "coreProblem": "string",
  "coreFeatures": ["string"],
  "mvpFeatures": ["string"],
  "advancedFeatures": ["string"],
  "techStack": ["string"],
  "frontendRequirements": "string",
  "backendRequirements": "string",
  "databaseSchema": "concrete tables/collections with fields",
  "aiIntegration": "string",
  "authentication": "string",
  "dashboardLayout": "string",
  "uiUxStyle": "string",
  "pages": ["string"],
  "components": ["string"],
  "apiRoutes": ["string"],
  "errorHandling": "string",
  "loadingStates": "string",
  "emptyStates": "string",
  "responsiveDesign": "string",
  "securityRules": "string",
  "performanceRequirements": "string",
  "deploymentInstructions": "string",
  "environmentVariables": ["string"],
  "readmeInstruction": "string",
  "finalInstruction": "string"
}`;
}

export function buildMasterPromptPrompt(idea: ProjectIdea, blueprint?: Blueprint | null): string {
  const bp = blueprint
    ? `BLUEPRINT:\n${JSON.stringify(blueprint).slice(0, 6000)}`
    : `TECH STACK: ${idea.techStack.join(", ")}\nMVP: ${idea.mvpFeatures.join("; ")}\nADVANCED: ${idea.advancedFeatures.join("; ")}`;

  return `Create the ULTIMATE master prompt for vibe coding tools (Lovable, Bolt, Cursor, Windsurf, Replit, v0, Claude Code) for this project, plus career assets.

PROJECT: ${idea.projectName}
${idea.description}
${bp}

The "masterPrompt" must be a single, massive, copy-paste-ready instruction string that tells an AI coding tool to build the ENTIRE app. It must include: project name, product vision, target users, core problem, core features, MVP + advanced requirements, tech stack, frontend requirements, backend requirements, database schema, AI integration, authentication, dashboard layout, UI/UX style, all pages, components, API routes, error/loading/empty states, responsive design, security rules, performance requirements, deployment instructions, environment variables, README generation instruction, and a final instruction.

The masterPrompt MUST end with this directive verbatim:
"Build this as a complete working production-ready app. Do not give only explanation. Generate all required files, folders, components, pages, API routes, database schema, styling, and deployment configuration. Make the UI premium, responsive, and modern. Use clean code, modular structure, and scalable architecture."

Return JSON in EXACTLY this shape:
{
  "masterPrompt": "the full master prompt text",
  "resumeBullets": ["4-6 metric-driven resume bullets"],
  "githubReadmeOutline": ["readme section headings with 1-line detail"],
  "linkedinPost": "a confident, hashtag-rich showcase post",
  "interviewExplanation": "how to explain architecture & decisions in an interview"
}`;
}
