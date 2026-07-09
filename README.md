# ♟️ CHECKMATE AI

> **Generate industry-level software projects that recruiters actually notice.**

CHECKMATE AI is an AI-powered **project architect** that helps students, developers, AI engineers, software engineers, and job seekers discover resume-worthy, GitHub-worthy, portfolio-worthy ideas — and convert them into complete **build-ready prompts** for vibe coding platforms (Lovable, Bolt, Cursor, Windsurf, Replit, v0, Claude Code).

It generates high-impact project ideas with **resume, GitHub, recruiter, market and startup scores**, full architecture, AI integration, deployment plans, a **master vibe-coding prompt**, resume bullets, a GitHub README outline, a LinkedIn showcase post and an interview explanation.

---

## ✨ Features

- **Project Generator** — domain, goal, skill level, target company, complexity, tech stack, idea count & output type.
- **Idea Explorer** — curated, portfolio-grade example projects (no API key needed to browse).
- **Prompt Builder** — turn any idea into a complete, paste-ready master prompt + full package.
- **Saved Projects** — vault with favorites, copy & export (Markdown, README, resume, LinkedIn).
- **Settings** — bring-your-own Gemini/Groq keys, Auto Detect, Free Tier Only mode, connection tests.
- **Dual AI providers** — Google Gemini (deep reasoning) & Groq (ultra-fast) with **automatic fallback**.
- **Auto Detect** — routes deep tasks to Gemini, fast tasks to Groq.
- **Free Tier Only Mode** — recommends only tools with a real free tier.
- **Premium dark UI** — glassmorphism, gradients, Framer Motion, cinematic Apple × SpaceX feel.

---

## 🧱 Tech Stack

| Layer    | Tech                                                            |
| -------- | -------------------------------------------------------------- |
| Frontend | Next.js (App Router), React 19, TypeScript, Tailwind CSS v4    |
| Motion   | Framer Motion                                                  |
| Icons    | lucide-react                                                   |
| Backend  | Next.js Route Handlers (`app/api/*`)                           |
| Storage  | **localStorage** (no database required)                        |
| AI       | Google Gemini API · Groq API (OpenAI-compatible)              |
| Deploy   | Vercel                                                         |

> **No database.** All saved projects, settings and keys are stored in the user's browser via localStorage, so the app deploys with **zero infrastructure**.

> **Auth**: guest mode by default (anonymous local profile). Supabase Auth can be layered on later via the optional env vars.

---

## 🚀 Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (optional)
cp .env.example .env
#   - (optional) set GEMINI_API_KEY / GROQ_API_KEY as server-side defaults

# 3. Run the dev server
npm run dev
```

Open <http://localhost:3000>, go to **Settings**, and paste a **free** API key:

- **Gemini** — <https://aistudio.google.com/api-keys> (key starts with `AIza…`)
- **Groq** — <https://console.groq.com/keys> (key starts with `gsk_…`)

No database setup, no migrations, no `DATABASE_URL` — you're ready immediately.

---

## 🔑 API keys & security

- Keys are **never hardcoded**.
- Keys are stored **only in your browser** (localStorage) and sent only to this app's own server routes to call the providers.
- For production, you may optionally set `GEMINI_API_KEY` / `GROQ_API_KEY` as environment variables (server-side only) to act as defaults.

---

## 🌐 API routes

| Route                              | Purpose                                            |
| ---------------------------------- | -------------------------------------------------- |
| `POST /api/generate-ideas`         | Generate scored project ideas (JSON).              |
| `POST /api/generate-blueprint`     | Generate a full build blueprint.                   |
| `POST /api/generate-master-prompt` | Generate master prompt + career assets.            |
| `POST /api/test-gemini`            | Validate a Gemini key.                             |
| `POST /api/test-groq`              | Validate a Groq key.                               |
| `GET /api/health`                  | Health check (stateless).                          |

All routes are **stateless** — they only validate input, apply Auto Detect routing, and call the AI providers. Persistence is handled entirely client-side.

---

## ☁️ Deploy to Vercel

1. Push to GitHub.
2. Import the repo in [Vercel](https://vercel.com/new).
3. (Optional) add `GEMINI_API_KEY` / `GROQ_API_KEY` environment variables.
4. Deploy. Done — **no database to provision.**

---

## 📁 Structure

```
src/
  app/              # pages + stateless API routes (App Router)
  components/       # ui/, layout/, shared/, home/, providers/
  hooks/            # use-generate, use-guest
  lib/              # ai/, constants, system-prompt, export, storage, utils
  types/            # shared TypeScript types
```

---

## 📄 License

MIT — build something worth showing off.
