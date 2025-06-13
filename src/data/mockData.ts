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
  { id: "1", name: "Manutenção" },
  { id: "2", name: "Melhoria Contínua" },
  { id: "3", name: "Qualidade" },
  { id: "4", name: "Logística" },
  { id: "5", name: "Refeitório" },
];

export const statuses: Record<ProjectStatus, { label: string; color: string }> = {
  requested: { label: "Solicitado", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" },
  approved: { label: "Aprovado", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300" },
  in_progress: { label: "Em Progresso", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" },
  paused: { label: "Pausado", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" },
  completed: { label: "Concluído", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" },
  rejected: { label: "Rejeitado", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" },
};

export const urgencies: Record<ProjectUrgency, { label: string; color: string; icon: string }> = {
  baixa: { label: "Baixa", color: "text-green-500", icon: "Arrow-Down" },
  media: { label: "Média", color: "text-yellow-500", icon: "Minus" },
  alta: { label: "Alta", color: "text-red-500", icon: "Arrow-Up" },
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "Aplicativo de Monitoramento de Bombas",
    sector: "Manutenção",
    projectType: "app_development",
    status: "completed",
    urgency: "alta",
    startDate: "2023-07-14",
    estimatedEndDate: "2023-11-10",
    description: "Desenvolvimento de aplicativo para monitorar o funcionamento e consumo energético das bombas hidráulicas.",
    expectedGains: {
      people: true,
      costs: true,
      ergonomics: false
    },
    projectTags: ["app", "monitoramento", "bomba hidráulica", "manutenção preditiva"],
    requestedBy: "2",
    approvedBy: "1",
    approvedAt: "2023-07-17",
    concludedAt: "2023-11-12",
    timeline: [
      { id: "t1", projectId: "p1", type: "solicitacao", date: "2023-07-14", userId: "2" },
      { id: "t2", projectId: "p1", type: "aprovacao", date: "2023-07-17", userId: "1" },
      { id: "t3", projectId: "p1", type: "inicio", date: "2023-07-20", userId: "2" },
      { id: "t4", projectId: "p1", type: "conclusao", date: "2023-11-12", userId: "2" }
    ],
    logs: []
  },
  {
    id: "p2",
    name: "Automação de Iluminação do Galpão",
    sector: "Manutenção",
    projectType: "automacao_industrial",
    status: "completed",
    urgency: "media",
    startDate: "2023-10-01",
    estimatedEndDate: "2024-01-10",
    description: "Projeto de automação do sistema de iluminação, visando redução de consumo e controle remoto via IoT.",
    expectedGains: {
      people: false,
      costs: true,
      ergonomics: true
    },
    projectTags: ["iot", "automacao", "iluminacao", "eficiencia energética"],
    requestedBy: "3",
    approvedBy: "2",
    approvedAt: "2023-10-03",
    concludedAt: "2024-01-11",
    timeline: [
      { id: "t5", projectId: "p2", type: "solicitacao", date: "2023-10-01", userId: "3" },
      { id: "t6", projectId: "p2", type: "aprovacao", date: "2023-10-03", userId: "2" },
      { id: "t7", projectId: "p2", type: "inicio", date: "2023-10-10", userId: "3" },
      { id: "t8", projectId: "p2", type: "conclusao", date: "2024-01-11", userId: "3" }
    ],
    logs: []
  },
  {
    id: "p3",
    name: "Integração de Sensores IoT para Compressores",
    sector: "Manutenção",
    projectType: "iot",
    status: "in_progress",
    urgency: "alta",
    startDate: "2024-01-20",
    estimatedEndDate: "2024-04-20",
    description: "Implementação de sensores IoT para monitoramento de pressão, temperatura e consumo dos compressores industriais.",
    expectedGains: {
      people: true,
      costs: true,
      ergonomics: false
    },
    projectTags: ["iot", "sensores", "compressores", "monitoramento"],
    requestedBy: "1",
    approvedBy: "3",
    approvedAt: "2024-01-22",
    concludedAt: null,
    timeline: [
      { id: "t9", projectId: "p3", type: "solicitacao", date: "2024-01-20", userId: "1" },
      { id: "t10", projectId: "p3", type: "aprovacao", date: "2024-01-22", userId: "3" },
      { id: "t11", projectId: "p3", type: "inicio", date: "2024-01-28", userId: "1" }
    ],
    logs: []
  },
  {
    id: "p4",
    name: "Sistema de Alertas de Falha",
    sector: "Manutenção",
    projectType: "automacao_industrial",
    status: "requested",
    urgency: "baixa",
    startDate: "2024-03-05",
    estimatedEndDate: "2024-07-10",
    description: "Criação de sistema para geração automática de alertas em caso de falha em máquinas essenciais.",
    expectedGains: {
      people: true,
      costs: false,
      ergonomics: true
    },
    projectTags: ["alerta", "manutencao preditiva", "falha", "automacao"],
    requestedBy: "2",
    approvedBy: null,
    approvedAt: null,
    concludedAt: null,
    timeline: [
      { id: "t12", projectId: "p4", type: "solicitacao", date: "2024-03-05", userId: "2" }
    ],
    logs: []
  },
  {
    id: "p5",
    name: "Plataforma de Solicitação de Manutenção",
    sector: "Manutenção",
    projectType: "app_development",
    status: "in_progress",
    urgency: "media",
    startDate: "2024-05-12",
    estimatedEndDate: "2024-09-30",
    description: "Desenvolvimento de plataforma web para registro, acompanhamento e priorização de solicitações de manutenção.",
    expectedGains: {
      people: true,
      costs: true,
      ergonomics: true
    },
    projectTags: ["app", "plataforma", "manutencao", "gestao"],
    requestedBy: "3",
    approvedBy: "2",
    approvedAt: "2024-05-15",
    concludedAt: null,
    timeline: [
      { id: "t13", projectId: "p5", type: "solicitacao", date: "2024-05-12", userId: "3" },
      { id: "t14", projectId: "p5", type: "aprovacao", date: "2024-05-15", userId: "2" },
      { id: "t15", projectId: "p5", type: "inicio", date: "2024-05-18", userId: "3" }
    ],
    logs: []
  }
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