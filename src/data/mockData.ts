import { Project, User, Sector, ProjectStatus, ProjectUrgency } from "../types";

export const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "manager",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "coordinator",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export const sectors: Sector[] = [
  { id: "1", name: "Assembly" },
  { id: "2", name: "Machining" },
  { id: "3", name: "Quality Control" },
  { id: "4", name: "Logistics" },
  { id: "5", name: "Maintenance" },
];

export const statuses: Record<ProjectStatus, { label: string; color: string }> = {
  requested: { label: "Requested", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  approved: { label: "Approved", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  in_progress: { label: "In Progress", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  paused: { label: "Paused", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
};

export const urgencies: Record<ProjectUrgency, { label: string; color: string; icon: string }> = {
  low: { label: "Low", color: "text-green-500", icon: "Arrow-Down" },
  medium: { label: "Medium", color: "text-yellow-500", icon: "Minus" },
  high: { label: "High", color: "text-red-500", icon: "Arrow-Up" },
};

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Assembly Line Automation",
    sector: "Assembly",
    cell: "Cell A1",
    status: "in_progress",
    urgency: "medium",
    startDate: "2025-01-15",
    estimatedEndDate: "2025-05-30",
    description: "Automate the final assembly process to increase throughput and reduce manual errors.",
    expectedGains: {
      people: true,
      costs: true,
      ergonomics: true,
    },
    requestedBy: "2",
    approvedBy: "1",
    timeline: [
      { id: "t1", projectId: "1", type: "request", date: "2025-01-01", userId: "2" },
      { id: "t2", projectId: "1", type: "approval", date: "2025-01-10", userId: "1", comment: "Approved with priority" },
      { id: "t3", projectId: "1", type: "start", date: "2025-01-15", userId: "3" },
    ],
    logs: [
      { id: "l1", projectId: "1", action: "Project requested", timestamp: "2025-01-01T10:30:00", userId: "2" },
      { id: "l2", projectId: "1", action: "Project approved", timestamp: "2025-01-10T14:15:00", userId: "1" },
      { id: "l3", projectId: "1", action: "Project started", timestamp: "2025-01-15T09:00:00", userId: "3" },
    ],
  },
  {
    id: "2",
    name: "Quality Inspection System",
    sector: "Quality Control",
    cell: "QC Station 3",
    status: "approved",
    urgency: "high",
    estimatedEndDate: "2025-04-15",
    description: "Implement computer vision system for automated quality inspection of machined parts.",
    expectedGains: {
      costs: true,
      ergonomics: false,
    },
    requestedBy: "2",
    approvedBy: "1",
    timeline: [
      { id: "t4", projectId: "2", type: "request", date: "2024-12-15", userId: "2" },
      { id: "t5", projectId: "2", type: "approval", date: "2025-01-05", userId: "1" },
    ],
    logs: [
      { id: "l4", projectId: "2", action: "Project requested", timestamp: "2024-12-15T11:45:00", userId: "2" },
      { id: "l5", projectId: "2", action: "Project approved", timestamp: "2025-01-05T16:30:00", userId: "1" },
    ],
  },
  {
    id: "3",
    name: "Predictive Maintenance System",
    sector: "Maintenance",
    cell: "Plant-wide",
    status: "requested",
    urgency: "medium",
    estimatedEndDate: "2025-07-20",
    description: "Implement IoT sensors and predictive analytics to anticipate equipment failures.",
    expectedGains: {
      costs: true,
      people: false,
      ergonomics: false,
    },
    requestedBy: "3",
    timeline: [
      { id: "t6", projectId: "3", type: "request", date: "2025-01-20", userId: "3" },
    ],
    logs: [
      { id: "l6", projectId: "3", action: "Project requested", timestamp: "2025-01-20T13:15:00", userId: "3" },
    ],
  },
  {
    id: "4",
    name: "Inventory Tracking System",
    sector: "Logistics",
    cell: "Warehouse A",
    status: "completed",
    urgency: "low",
    startDate: "2024-10-10",
    endDate: "2024-12-20",
    estimatedEndDate: "2024-12-31",
    description: "Implement RFID-based inventory tracking system to improve accuracy and reduce manual counting.",
    expectedGains: {
      people: true,
      costs: true,
      ergonomics: false,
    },
    requestedBy: "2",
    approvedBy: "1",
    timeline: [
      { id: "t7", projectId: "4", type: "request", date: "2024-09-15", userId: "2" },
      { id: "t8", projectId: "4", type: "approval", date: "2024-10-01", userId: "1" },
      { id: "t9", projectId: "4", type: "start", date: "2024-10-10", userId: "3" },
      { id: "t10", projectId: "4", type: "completion", date: "2024-12-20", userId: "3" },
    ],
    logs: [
      { id: "l7", projectId: "4", action: "Project requested", timestamp: "2024-09-15T10:00:00", userId: "2" },
      { id: "l8", projectId: "4", action: "Project approved", timestamp: "2024-10-01T14:30:00", userId: "1" },
      { id: "l9", projectId: "4", action: "Project started", timestamp: "2024-10-10T09:15:00", userId: "3" },
      { id: "l10", projectId: "4", action: "Project completed", timestamp: "2024-12-20T16:45:00", userId: "3" },
    ],
  },
  {
    id: "5",
    name: "CNC Machine Integration",
    sector: "Machining",
    cell: "Machining Cell B",
    status: "paused",
    urgency: "high",
    startDate: "2024-11-15",
    estimatedEndDate: "2025-03-01",
    description: "Integrate CNC machines with central production system for automated job scheduling.",
    expectedGains: {
      people: false,
      costs: true,
      ergonomics: true,
    },
    requestedBy: "3",
    approvedBy: "1",
    timeline: [
      { id: "t11", projectId: "5", type: "request", date: "2024-10-20", userId: "3" },
      { id: "t12", projectId: "5", type: "approval", date: "2024-11-05", userId: "1" },
      { id: "t13", projectId: "5", type: "start", date: "2024-11-15", userId: "2" },
      { id: "t14", projectId: "5", type: "pause", date: "2024-12-10", userId: "1", comment: "Paused due to component shortage" },
    ],
    logs: [
      { id: "l11", projectId: "5", action: "Project requested", timestamp: "2024-10-20T11:20:00", userId: "3" },
      { id: "l12", projectId: "5", action: "Project approved", timestamp: "2024-11-05T15:45:00", userId: "1" },
      { id: "l13", projectId: "5", action: "Project started", timestamp: "2024-11-15T08:30:00", userId: "2" },
      { id: "l14", projectId: "5", action: "Project paused", timestamp: "2024-12-10T14:00:00", userId: "1", details: "Paused due to component shortage" },
    ],
  },
];

export function getDashboardStats() {
  return {
    total: mockProjects.length,
    inProgress: mockProjects.filter(p => p.status === "in_progress").length,
    paused: mockProjects.filter(p => p.status === "paused").length,
    approved: mockProjects.filter(p => p.status === "approved").length,
    completed: mockProjects.filter(p => p.status === "completed").length,
  };
}