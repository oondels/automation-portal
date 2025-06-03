import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  AlertCircle, 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  Download,
  FileDown,
  Filter, 
  HelpCircle,
  Info,
  Loader2, 
  MessageCircle,
  Minus, 
  Users 
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
  const totalActive = projects.filter(p => p.status !== "completed" && p.status !== "rejected").length;
  const pendingApproval = projects.filter(p => p.status === "requested").length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;
  const delayed = projects.filter(p => {
    if (!p.estimatedEndDate || p.status === "completed" || p.status === "rejected") return false;
    return new Date(p.estimatedEndDate) < new Date();
  }).length;

  // Team capacity metrics
  const teamMembers = 3; // Mock value - replace with actual team size
  const maxProjectsPerMember = 4; // Maximum recommended projects per team member
  const currentProjectsPerMember = totalActive / teamMembers;
  const capacityPercentage = (currentProjectsPerMember / maxProjectsPerMember) * 100;
  const isOverloaded = capacityPercentage > 85;

  // Monthly backlog data (last 6 months)
  const backlogData = [
    { month: "Jan", total: 12, completed: 8 },
    { month: "Feb", total: 15, completed: 10 },
    { month: "Mar", total: 18, completed: 12 },
    { month: "Apr", total: 22, completed: 15 },
    { month: "May", total: 25, completed: 18 },
    { month: "Jun", total: 28, completed: 20 }
  ];

  // Project distribution by sector
  const sectorData = sectors.map(sector => ({
    name: sector.name,
    value: projects.filter(p => p.sector === sector.name).length
  }));

  const handleExportReport = () => {
    // Implementation for report generation would go here
    console.log("Generating report...");
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Dashboard de Automação</h1>
          <p className="text-muted-foreground">
            Acompanhamento em tempo real das solicitações e capacidade do setor
          </p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <FileDown className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Link to="/new-request">
            <Button>Nova Solicitação</Button>
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      <Card className="border-l-4 border-l-primary bg-primary/5">
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <p className="text-sm">
              O status das solicitações está sempre atualizado e disponível a todos. 
              Para saber prazos, consulte esta tela. Para sugestões de melhoria ou dúvidas, utilize o menu de contato.
            </p>
          </div>
          <Button variant="ghost" size="sm">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contato
          </Button>
        </CardContent>
      </Card>

      {/* Capacity Warning */}
      {isOverloaded && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border-l-4 border-destructive bg-destructive/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="font-medium text-destructive">
                  Alerta de Capacidade
                </p>
                <p className="text-sm text-destructive/80">
                  Equipe está operando a {Math.round(capacityPercentage)}% da capacidade recomendada. 
                  Considere reforço na equipe ou repriorização de demandas.
                </p>
              </div>
            </div>
            <Button variant="destructive" size="sm">
              Ver Detalhes
            </Button>
          </div>
        </motion.div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solicitações Ativas</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActive}</div>
            <p className="text-xs text-muted-foreground">
              Total de projetos em andamento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApproval}</div>
            <p className="text-xs text-muted-foreground">
              Solicitações em análise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Projetos em desenvolvimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{delayed}</div>
            <p className="text-xs text-muted-foreground">
              Projetos com prazo excedido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Capacity Card */}
      <Card>
        <CardHeader>
          <CardTitle>Capacidade da Equipe</CardTitle>
          <CardDescription>
            Análise da carga atual vs. capacidade recomendada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Capacidade Atual</p>
                <p className="text-2xl font-bold">
                  {currentProjectsPerMember.toFixed(1)} projetos/membro
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Capacidade Recomendada</p>
                <p className="text-2xl font-bold">
                  {maxProjectsPerMember} projetos/membro
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Utilização</p>
                <p className="text-2xl font-bold">
                  {Math.round(capacityPercentage)}%
                </p>
              </div>
            </div>
            
            <div className="h-3 rounded-full bg-muted">
              <div 
                className={`h-3 rounded-full transition-all ${
                  capacityPercentage > 85 
                    ? 'bg-destructive' 
                    : capacityPercentage > 70 
                    ? 'bg-warning' 
                    : 'bg-success'
                }`}
                style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              {capacityPercentage > 85 
                ? "Equipe sobrecarregada. Ação necessária."
                : capacityPercentage > 70
                ? "Aproximando do limite. Monitorar."
                : "Capacidade adequada."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Backlog</CardTitle>
            <CardDescription>
              Histórico de solicitações vs. entregas
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
                  dataKey="total" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Total de Solicitações"
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  name="Projetos Concluídos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Setor</CardTitle>
            <CardDescription>
              Solicitações ativas por área
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sectorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sectorData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`hsl(${index * 360 / sectorData.length}, 70%, 50%)`} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}