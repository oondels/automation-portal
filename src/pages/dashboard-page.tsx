import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Activity, 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  Filter, 
  Loader2, 
  Minus, 
  Users, 
  AlertTriangle,
  Calendar
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useProjects } from "../context/projects-context";
import { Project, ProjectStatus, ProjectUrgency } from "../types";
import { formatDate } from "../lib/utils";
import { statuses, sectors, urgencies } from "../data/mockData";
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell, Pie, PieChart } from "recharts";

export function DashboardPage() {
  const { projects } = useProjects();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<ProjectUrgency | "all">("all");

  // Calculate key metrics
  const totalRequests = projects.length;
  const pendingApproval = projects.filter(p => p.status === "requested").length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;
  const approvedNotStarted = projects.filter(p => p.status === "approved").length;
  const teamMembers = 1; // Mock value - replace with actual team size
  const requestsPerMember = totalRequests > 0 ? (inProgress / teamMembers).toFixed(1) : 0;
  const isOverloaded = Number(requestsPerMember) > 3; // Threshold of 3 projects per team member

  // Status distribution for donut chart
  const statusData = Object.entries(statuses).map(([key, { label }]) => ({
    name: label,
    value: projects.filter(p => p.status === key).length
  }));

  // Weekly requests data (mock data - replace with actual data)
  const weeklyData = [
    { week: "Semana 1", requests: 5 },
    { week: "Semana 2", requests: 8 },
    { week: "Semana 3", requests: 12 },
    { week: "Semana 4", requests: 7 },
    { week: "Semana 5", requests: 15 },
    { week: "Semana 6", requests: 10 }
  ];

  // Backlog trend data (mock data - replace with actual data)
  const backlogData = [
    { month: "Jan", backlog: 10 },
    { month: "Feb", backlog: 15 },
    { month: "Mar", backlog: 25 },
    { month: "Apr", backlog: 30 },
    { month: "May", backlog: 40 },
    { month: "Jun", backlog: 45 }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#6b7280'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Gerenciamento de Solicitações</h1>
          <p className="text-muted-foreground">
            Monitoramento automático de solicitações de projetos e capacidade da equpe
          </p>
        </div>
        <Link to="/new-request">
          <Button>New Project Request</Button>
        </Link>
      </motion.div>

      {isOverloaded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border-l-4 border-warning bg-warning/10 p-4"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <p className="text-sm text-black">
              Alerta: A equipe está atualmente sobrecarregada com {requestsPerMember} projetos por membro da equipe
            </p>
          </div>
        </motion.div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Requisições</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                Todas as solicitações de projetos de automação
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApproval}</div>
              <p className="text-xs text-muted-foreground">
                Aguardando revisão e aprovação
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Carga da Equipe</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requestsPerMember}</div>
              <p className="text-xs text-muted-foreground">
                Projetos ativos por membro da Equipe
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Status do Projeto</CardTitle>
            <CardDescription>
              Estado atual de todas as solicitações de automação
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trends de Solicitações Semanais</CardTitle>
            <CardDescription>
              Novas solicitações de automação por semana
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="hsl(var(--primary))">
                  {weeklyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tendência de crescimento do backlog</CardTitle>
          <CardDescription>
            Cumulativo de backlog de projetos ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={backlogData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="backlog" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral da Capacidade da Equipe</CardTitle>
          <CardDescription>
            Alocação e capacidade de recursos atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Membros da Equipe</p>
                <p className="text-2xl font-bold">{teamMembers}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Projetos Ativos</p>
                <p className="text-2xl font-bold">{inProgress}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Projetos por Membro</p>
                <p className="text-2xl font-bold">{requestsPerMember}</p>
              </div>
            </div>
            
            <div className="h-3 rounded-full bg-muted">
              <div 
                className={`h-3 rounded-full transition-all ${
                  isOverloaded ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ 
                  width: `${Math.min((Number(requestsPerMember) / 3) * 100, 100)}%` 
                }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              {isOverloaded 
                ? "A equipe está sobrecarregada. Considere adicionar mais recursos."
                : "Capacidade da equipe está dentro dos limites aceitáveis."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}