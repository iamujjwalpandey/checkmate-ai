"use client";

import * as React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { PageTransition } from "@/components/layout/page-transition";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen">
      <div className="app-bg" aria-hidden />
      <div className="app-grid" aria-hidden />
      <div className="app-noise" aria-hidden />

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="flex min-h-screen flex-col lg:pl-[264px]">
        <Topbar onMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
          <PageTransition>{children}</PageTransition>
        </main>
        <footer className="border-t border-white/8 bg-navy-950/40 px-4 py-8 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <p className="font-display text-xs font-medium tracking-[0.18em] text-slate-500 uppercase">
              CHECKMATE AI · Project Architect
            </p>
            <p className="text-xs text-slate-600">
              Keys stay local · never hardcoded · free-tier friendly
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
