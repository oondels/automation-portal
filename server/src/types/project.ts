export enum ProjectUrgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum ProjectStatus {
  REQUESTED = "requested",
  APPROVED = "approved",
  IN_PROGRESS = "in_progress",
  PAUSED = "paused",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

export enum ProjectType {
  APP_DEVELOPMENT = "app_development",
  PROCESS_AUTOMATION = "process_automation",
  APP_IMPROVEMENT = "app_improvement",
  APP_FIX = "app_fix",
  CARPENTRY = "carpentry",
  METALWORK = "metalwork",
}

export interface CreateProjectDTO {
  projectName: string;
  sector: string;
  urgency?: ProjectUrgency;
  projectType?: ProjectType;
  startDate?: Date;
  estimatedDurationTime?: string;
  status?: ProjectStatus;
  description: string;
  expectedGains?: string[];
  projectTags?: string[];
  pictures?: string[];
  requestedBy: number;
  approvedBy?: string;
  approvedAt?: Date;
  pausedAt?: Date;
  recordedPauses?: PauseRecord[];
  automationTeamId?: string;
  concludedAt?: Date;
}

export interface PauseRecord {
  start?: Date;
  end?: Date;
  reason:    string;
  user:      string;
}