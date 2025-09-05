import { Project, User, Sector, ProjectStatus, ProjectUrgency } from "../types";

export const users: User[] = [
  {
    id: "1",
    nome: "John Doe",
    usuario: "john.doe",
    email: "john.doe@example.com",
    haveemail: true,
    avatar: "https://i.pravatar.cc/150?img=1",
    funcao: "manager",
    nivel: "senior",
    matricula: "12345",
    codbarras: "123456789",
    rfid: "RF001",
    setor: "Automação",
    unidade: "Principal"
  },
  {
    id: "2",
    nome: "Jane Smith",
    usuario: "jane.smith",
    email: "jane.smith@example.com",
    haveemail: true,
    avatar: "https://i.pravatar.cc/150?img=2",
    funcao: "coordinator",
    nivel: "senior",
    matricula: "12346",
    codbarras: "123456790",
    rfid: "RF002",
    setor: "Automação",
    unidade: "Principal"
  },
  {
    id: "3",
    nome: "Robert Johnson",
    usuario: "robert.johnson",
    email: "robert.johnson@example.com",
    haveemail: true,
    avatar: "https://i.pravatar.cc/150?img=3",
    funcao: "admin",
    nivel: "senior",
    matricula: "12347",
    codbarras: "123456791",
    rfid: "RF003",
    setor: "Automação",
    unidade: "Principal"
  },
];

export const sectors: Sector[] = [
  { id: "1", name: "Administrativo" },
  { id: "2", name: "Automação" },
  { id: "3", name: "Corte Automático" },
  { id: "4", name: "DP" },
  { id: "5", name: "Fabrica 1" },
  { id: "6", name: "Fabrica 2" },
  { id: "7", name: "Fabrica 3" },
  { id: "8", name: "Centro Distribuição" },
  { id: "9", name: "Manutenção" },
  { id: "10", name: "Melhoria Contínua" },
  { id: "11", name: "Modelagem" },
  { id: "12", name: "PCP" },
  { id: "13", name: "Pré Fabricado" },
  { id: "14", name: "Qualidade" },
  { id: "15", name: "Química" },
  { id: "16", name: "Refeitório" },
  { id: "17", name: "RH" },
  { id: "18", name: "Serigrafia" },
  { id: "19", name: "SSMA" },
  { id: "20", name: "Tempos e Métodos" },
  { id: "21", name: "TI" },
  { id: "22", name: "Outros" },
  { id: "23", name: "Consumo" },
  { id: "24", name: "Expedição" },
  { id: "25", name: "Almoxarifado/M²" },
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
  low: { label: "Baixa", color: "text-green-500", icon: "Arrow-Down" },
  medium: { label: "Média", color: "text-yellow-500", icon: "Minus" },
  high: { label: "Alta", color: "text-red-500", icon: "Arrow-Up" },
};

export const mockProjects: Project[] = [
  {
    id: "p1",
    projectName: "Aplicativo de Monitoramento de Bombas",
    sector: "Manutenção",
    projectType: "app_development",
    status: "completed",
    urgency: "high",
    startDate: "2023-07-14",
    estimatedDurationTime: "120 days",
    description: "Desenvolvimento de aplicativo para monitorar o funcionamento e consumo energético das bombas hidráulicas.",
    expectedGains: ["people", "costs"],
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
    projectName: "Automação de Iluminação do Galpão",
    sector: "Manutenção",
    projectType: "automacao_industrial",
    status: "completed",
    urgency: "medium",
    startDate: "2023-10-01",
    estimatedDurationTime: "100 days",
    description: "Projeto de automação do sistema de iluminação, visando redução de consumo e controle remoto via IoT.",
    expectedGains: ["costs", "ergonomics"],
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
    projectName: "Integração de Sensores IoT para Compressores",
    sector: "Manutenção",
    projectType: "iot",
    status: "in_progress",
    urgency: "high",
    startDate: "2024-01-20",
    estimatedDurationTime: "90 days",
    description: "Implementação de sensores IoT para monitoramento de pressão, temperatura e consumo dos compressores industriais.",
    expectedGains: ["people", "costs"],
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
    projectName: "Sistema de Alertas de Falha",
    sector: "Manutenção",
    projectType: "automacao_industrial",
    status: "requested",
    urgency: "low",
    startDate: "2024-03-05",
    estimatedDurationTime: "4 months",
    description: "Criação de sistema para geração automática de alertas em caso de falha em máquinas essenciais.",
    expectedGains: ["people", "ergonomics"],
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
    projectName: "Plataforma de Solicitação de Manutenção",
    sector: "Manutenção",
    projectType: "app_development",
    status: "in_progress",
    urgency: "medium",
    startDate: "2024-05-12",
    estimatedDurationTime: "20 weeks",
    description: "Desenvolvimento de plataforma web para registro, acompanhamento e priorização de solicitações de manutenção.",
    expectedGains: ["people", "costs", "ergonomics"],
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