export type User = {
  id?: string;
  nome: string;
  usuario: string;
  email?: string;
  haveemail: boolean;
  avatar?: string;
  funcao: string;
  nivel: string;
  matricula: string;
  codbarras: string;
  rfid: string;
  setor: string;
  unidade: string;
};

export enum ProjectType {
  APP_DEVELOPMENT = "app_development",
  PROCESS_AUTOMATION = "process_automation",
  APP_IMPROVEMENT = "app_improvement",
  APP_FIX = "app_fix",
  CARPENTRY = "carpentry",
  METALWORK = "metalwork",
}

export type ProjectStatus = "requested" | "approved" | "in_progress" | "paused" | "completed" | "rejected";

export type ProjectUrgency = "low" | "medium" | "high";

export type PauseRecord = {
  start?: Date | string;
  end?: Date | string;
  reason: string;
  user: string;
};

export type Team = {
  id: string;
  name: string;
  description?: string;
  members?: User[];
};

export type Project = {
  id: string;
  projectName: string; // Matches server model field name
  sector: string;
  cell?: string; // Frontend specific field for UI display
  status: ProjectStatus;
  urgency: ProjectUrgency;
  projectType: string;
  startDate?: Date | string;
  estimatedDurationTime?: string | IntervalObject; // PostgreSQL interval format (e.g., "30 days", "2 weeks", "90 days") or object
  description: string;
  expectedGains?: string[]; // Matches server model as string array
  projectTags?: string[];
  pictures?: string[];
  requestedBy: User | string; // Can be User object or string ID
  approvedBy?: string | null;
  approvedAt?: Date | string | null;
  pausedAt?: Date | string | null;
  recordedPauses?: PauseRecord[];
  automationTeam?: Team | null;
  concludedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
  // Frontend specific fields for backwards compatibility
  timeline?: TimelineEvent[];
  logs?: LogEntry[];
};

export type TimelineEvent = {
  id: string;
  projectId: string;
  type: string;
  date: string;
  userId: string | User;
  comment?: string;
};

export type LogEntry = {
  id: string;
  projectId: string;
  action: string;
  timestamp: string;
  userId: string | User;
  details?: string;
};

export type Sector = {
  id: string;
  name: string;
};

export type DashboardStats = {
  total: number;
  inProgress: number;
  paused: number;
  approved: number;
  completed: number;
};

export type IntervalObject = {
  days?: number
  weeks?: number
  months?: number
  years?: number
  hours?: number
  minutes?: number
  seconds?: number
}