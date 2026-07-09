import type { ProjectIdea, Blueprint, PromptPackage } from "@/types";

export function blueprintToMarkdown(bp: Blueprint, name = "Project"): string {
  const list = (arr: string[]) => (arr.length ? arr.map((x) => `- ${x}`).join("\n") : "_none_");
  return `# ${name} — Build Blueprint

## Product Vision
${bp.productVision}

## Target Users
${bp.targetUsers}

## Core Problem
${bp.coreProblem}

## Core Features
${list(bp.coreFeatures)}

## MVP Features
${list(bp.mvpFeatures)}

## Advanced Features
${list(bp.advancedFeatures)}

## Tech Stack
${list(bp.techStack)}

## Frontend Requirements
${bp.frontendRequirements}

## Backend Requirements
${bp.backendRequirements}

## Database Schema
${bp.databaseSchema}

## AI Integration
${bp.aiIntegration}

## Authentication
${bp.authentication}

## Dashboard Layout
${bp.dashboardLayout}

## UI / UX Style
${bp.uiUxStyle}

## Pages
${list(bp.pages)}

## Components
${list(bp.components)}

## API Routes
${list(bp.apiRoutes)}

## Error Handling
${bp.errorHandling}

## Loading & Empty States
${bp.loadingStates}

## Empty States
${bp.emptyStates}

## Responsive Design
${bp.responsiveDesign}

## Security Rules
${bp.securityRules}

## Performance Requirements
${bp.performanceRequirements}

## Deployment Instructions
${bp.deploymentInstructions}

## Environment Variables
${list(bp.environmentVariables)}

## README Instruction
${bp.readmeInstruction}

## Final Instruction
${bp.finalInstruction}
`;
}

export function resumeToText(bullets: string[], name = "Project"): string {
  return `${name} — Resume Bullets\n\n${bullets.map((b) => `• ${b}`).join("\n")}\n`;
}

export function linkedinToText(post: string): string {
  return post;
}

export function ideaToReadme(idea: ProjectIdea): string {
  const list = (arr: string[]) => (arr.length ? arr.map((x) => `- ${x}`).join("\n") : "");
  const outline = idea.promptPackage?.githubReadmeOutline ?? [];
  const sections = outline.length
    ? outline.map((h) => `## ${h}`).join("\n\n")
    : `## Overview\n${idea.description}\n\n## Features\n${list(idea.mvpFeatures)}\n\n## Tech Stack\n${list(idea.techStack)}`;

  return `# ${idea.projectName}

> ${idea.description}

${sections}

## Problem Solved
${idea.problemSolved}

## Why It's Powerful
${idea.whyPowerful}

## Tech Stack
${list(idea.techStack)}

## AI Integration
${idea.aiIntegration}

## Database
${idea.databasePlan}

## Scores
- Resume Impact: ${idea.scores.resumeImpact}/10
- GitHub Value: ${idea.scores.githubValue}/10
- Recruiter Impression: ${idea.scores.recruiterImpression}/10
- Market Relevance: ${idea.scores.marketRelevance}/10
- Startup Potential: ${idea.scores.startupPotential}/10

## License
MIT
`;
}

export function buildProjectPackageMarkdown(idea: ProjectIdea): string {
  const pkg = idea.promptPackage;
  const parts: string[] = [`# ${idea.projectName}\n\n> ${idea.description}\n`];
  if (pkg?.masterPrompt) {
    parts.push(`---\n\n# 🚀 Master Prompt (paste into Lovable / Bolt / Cursor)\n\n\`\`\`\n${pkg.masterPrompt}\n\`\`\``);
  }
  if (idea.blueprint) {
    parts.push(`---\n\n${blueprintToMarkdown(idea.blueprint, idea.projectName)}`);
  }
  if (pkg?.resumeBullets?.length) {
    parts.push(`---\n\n# 📄 Resume Bullets\n\n${pkg.resumeBullets.map((b) => `- ${b}`).join("\n")}`);
  }
  if (pkg?.githubReadmeOutline?.length) {
    parts.push(`---\n\n# 📦 GitHub README Outline\n\n${pkg.githubReadmeOutline.map((h) => `1. ${h}`).join("\n")}`);
  }
  if (pkg?.linkedinPost) {
    parts.push(`---\n\n# 💼 LinkedIn Showcase Post\n\n${pkg.linkedinPost}`);
  }
  if (pkg?.interviewExplanation) {
    parts.push(`---\n\n# 🎤 Interview Explanation\n\n${pkg.interviewExplanation}`);
  }
  return parts.join("\n\n");
}
