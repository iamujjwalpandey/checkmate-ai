export type ProviderId = "auto" | "gemini" | "groq";

export interface GenerateInput {
  domain: string;
  goal: string;
  skillLevel: string;
  companyStyle: string;
  techStack: string[];
  ideaCount: number;
  complexity: string;
  outputType: string;
  freeTierOnly: boolean;
}

export interface Scores {
  resumeImpact: number;
  githubValue: number;
  recruiterImpression: number;
  marketRelevance: number;
  startupPotential: number;
}

export interface ProjectIdea {
  id: string;
  projectName: string;
  description: string;
  domain: string;
  targetUsers: string;
  problemSolved: string;
  whyPowerful: string;
  targetCompanies: string[];
  techStack: string[];
  aiIntegration: string;
  databasePlan: string;
  frontendComplexity: number;
  backendComplexity: number;
  deploymentMethod: string;
  scores: Scores;
  difficulty: string;
  estimatedBuildTime: string;
  mvpFeatures: string[];
  advancedFeatures: string[];
  uiInspiration: string[];
  monetization: string;
  blueprint?: Blueprint | null;
  promptPackage?: PromptPackage | null;
}

export interface Blueprint {
  productVision: string;
  targetUsers: string;
  coreProblem: string;
  coreFeatures: string[];
  mvpFeatures: string[];
  advancedFeatures: string[];
  techStack: string[];
  frontendRequirements: string;
  backendRequirements: string;
  databaseSchema: string;
  aiIntegration: string;
  authentication: string;
  dashboardLayout: string;
  uiUxStyle: string;
  pages: string[];
  components: string[];
  apiRoutes: string[];
  errorHandling: string;
  loadingStates: string;
  emptyStates: string;
  responsiveDesign: string;
  securityRules: string;
  performanceRequirements: string;
  deploymentInstructions: string;
  environmentVariables: string[];
  readmeInstruction: string;
  finalInstruction: string;
}

export interface PromptPackage {
  masterPrompt: string;
  resumeBullets: string[];
  githubReadmeOutline: string[];
  linkedinPost: string;
  interviewExplanation: string;
}

export interface SavedProject {
  id: string;
  guestId: string;
  projectName: string;
  domain: string;
  goal: string;
  description: string;
  techStack: string[];
  scores: Scores;
  blueprint: Blueprint | null;
  masterPrompt: string;
  resumeBullets: string[];
  linkedinPost: string;
  readmeOutline: string[];
  interviewExplanation: string;
  idea: ProjectIdea;
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
}

export interface Settings {
  geminiKey: string;
  groqKey: string;
  preferredProvider: ProviderId;
  autoDetect: boolean;
  freeTierOnly: boolean;
  geminiModel: string;
  groqModel: string;
  defaultDifficulty: string;
  defaultGoal: string;
  defaultStack: string;
  defaultOutputType: string;
  defaultCompanyStyle: string;
}

export type AITask = "ideas" | "blueprint" | "master";

export interface AICallInput {
  task: AITask;
  systemPrompt: string;
  userPrompt: string;
  settings: Settings;
  keys: { gemini?: string; groq?: string };
}

export interface AICallResult {
  provider: "gemini" | "groq";
  model: string;
  content: string;
  fellback?: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}
