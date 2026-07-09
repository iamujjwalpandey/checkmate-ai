import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";
import { AppShell } from "@/components/layout/app-shell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "CHECKMATE AI — Generate Industry-Level Projects Recruiters Notice",
    template: "%s · CHECKMATE AI",
  },
  description:
    "CHECKMATE AI helps you discover resume-worthy project ideas, design complete architectures, and generate build-ready prompts for vibe coding platforms like Lovable, Bolt, Cursor & v0.",
  keywords: [
    "AI project ideas",
    "vibe coding",
    "resume projects",
    "master prompt generator",
    "portfolio projects",
    "Gemini",
    "Groq",
  ],
  authors: [{ name: "CHECKMATE AI" }],
  openGraph: {
    title: "CHECKMATE AI — AI Project Architect",
    description:
      "Generate industry-level software projects and build-ready prompts for vibe coding platforms.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans antialiased">
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
