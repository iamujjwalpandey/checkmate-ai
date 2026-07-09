"use client";

import * as React from "react";
import { ToastProvider } from "@/components/providers/toast";
import { SettingsProvider } from "@/components/providers/settings";
import { ProjectsProvider } from "@/components/providers/projects";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SettingsProvider>
        <ProjectsProvider>{children}</ProjectsProvider>
      </SettingsProvider>
    </ToastProvider>
  );
}
