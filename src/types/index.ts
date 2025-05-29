export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "coordinator" | "manager" | "admin";
};

export type ProjectStatus = "requested" | "approved" | "in_progress" | "paused" | "completed" | "rejected";

export type ProjectUrgency = "low" | "medium" | "high";

export type Project = {
  id: string;
  name: string;
  sector: string;
  cell: string;
  status: ProjectStatus;
  urgency: ProjectUrgency;
  startDate?: string;
  endDate?: string;
  estimatedEndDate: string;
  description: string;
  expectedGains: {
    people?: boolean;
    costs?: boolean;
    ergonomics?: boolean;
    [key: string]: boolean | undefined;
  };
  requestedBy: string;
  approvedBy?: string;
  timeline: TimelineEvent[];
  logs: LogEntry[];
};

export type TimelineEvent = {
  id: string;
  projectId: string;
  type: "request" | "approval" | "start" | "pause" | "resume" | "completion" | "rejection";
  date: string;
  userId: string;
  comment?: string;
};

export type LogEntry = {
  id: string;
  projectId: string;
  action: string;
  timestamp: string;
  userId: string;
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