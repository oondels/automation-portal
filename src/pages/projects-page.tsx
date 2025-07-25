import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  Clock,
  Grid,
  Minus,
  Plus,
  Search,
  SlidersHorizontal,
  X
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useProjects } from "../context/projects-context";
import { Project, ProjectStatus, ProjectUrgency } from "../types";
import { formatDate, calculateEstimatedEndDate } from "../lib/utils";
import { statuses, sectors, urgencies } from "../data/mockData";

export function ProjectsPage() {
  const { projects } = useProjects();
  const [view, setView] = useState<"table" | "grid">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | "all">("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<ProjectUrgency | "all">("all");
  const [showFilters, setShowFilters] = useState(false);

  // Calculate KPIs
  const totalActive = projects.filter(p => p.status !== "completed" && p.status !== "rejected").length;
  const pendingApproval = projects.filter(p => p.status === "requested").length;
  const inProgress = projects.filter(p => p.status === "in_progress").length;
  const delayed = projects.filter(p => {
    if (!p.estimatedDurationTime || p.status === "completed" || p.status === "rejected") return false;
    const estimatedEndDate = calculateEstimatedEndDate(p.startDate, p.estimatedDurationTime);
    return estimatedEndDate < new Date();
  }).length;

  // Team capacity metrics
  const teamMembers = 3; // Mock value
  const maxProjectsPerMember = 4;
  const currentProjectsPerMember = totalActive / teamMembers;
  const capacityPercentage = (currentProjectsPerMember / maxProjectsPerMember) * 100;
  const isOverloaded = capacityPercentage > 85;

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project?.cell?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || project.status === statusFilter;
    const matchesSector = sectorFilter === "all" || project.sector === sectorFilter;
    const matchesUrgency = urgencyFilter === "all" || project.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesSector && matchesUrgency;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSectorFilter("all");
    setUrgencyFilter("all");
  };

  // Get urgency icon and color
  const getUrgencyInfo = (urgency: ProjectUrgency) => {
    switch (urgency) {
      case "high":
        return { icon: <ArrowUp className="h-4 w-4" />, color: "text-destructive" };
      case "medium":
        return { icon: <Minus className="h-4 w-4" />, color: "text-warning" };
      case "low":
        return { icon: <ArrowDown className="h-4 w-4" />, color: "text-success" };
    }
  };

  // Calculate project progress
  const getProjectProgress = (project: Project) => {
    const startDate = project.startDate ? new Date(project.startDate) : new Date();
    const endDate = calculateEstimatedEndDate(project.startDate, project.estimatedDurationTime);
    const today = new Date();
    
    const total = endDate.getTime() - startDate.getTime();
    const elapsed = today.getTime() - startDate.getTime();
    const progress = Math.min(Math.max((elapsed / total) * 100, 0), 100);
    
    const isDelayed = today > endDate && project.status !== 'completed';
    
    return { progress, isDelayed, endDate };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Projetos de Automação</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe o progresso dos projetos
          </p>
        </motion.div>
        <Link to="/new-request">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Projeto
          </Button>
        </Link>
      </div>

      {/* KPIs Grid */}
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalActive}</div>
              <p className="text-xs text-muted-foreground">
                Em diferentes estágios
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aguardando Aprovação</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingApproval}</div>
              <p className="text-xs text-muted-foreground">
                Necessitam análise
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Desenvolvimento</CardTitle>
              <Activity className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgress}</div>
              <p className="text-xs text-muted-foreground">
                Projetos em execução
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{delayed}</div>
              <p className="text-xs text-muted-foreground">
                Necessitam atenção
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Sector Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Visão do Setor</CardTitle>
          <CardDescription>Status atual da capacidade da equipe</CardDescription>
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
                <p className="text-sm font-medium">Capacidade Ideal</p>
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
            
            {isOverloaded && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>
                  Capacidade excedida em {Math.round(capacityPercentage - 100)}%. 
                  Recomendação: solicitar reforço na equipe.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Projetos</CardTitle>
          <CardDescription>
            Gerencie e acompanhe todas as solicitações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, descrição, setor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full md:w-auto"
              >
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
                {(statusFilter !== "all" || sectorFilter !== "all" || urgencyFilter !== "all") && (
                  <Badge variant="secondary" className="ml-2">
                    {[
                      statusFilter !== "all",
                      sectorFilter !== "all",
                      urgencyFilter !== "all"
                    ].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant={view === "table" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("table")}
                >
                  <Activity className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setView("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex flex-wrap gap-4">
                    <Select
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value as ProjectStatus | "all")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos Status</SelectItem>
                        {Object.entries(statuses).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={sectorFilter}
                      onValueChange={(value) => setSectorFilter(value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos Setores</SelectItem>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.name}>
                            {sector.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={urgencyFilter}
                      onValueChange={(value) => setUrgencyFilter(value as ProjectUrgency | "all")}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Urgência" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas Urgências</SelectItem>
                        {Object.entries(urgencies).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {(statusFilter !== "all" || sectorFilter !== "all" || urgencyFilter !== "all") && (
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="h-10"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Limpar Filtros
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <AlertCircle className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Nenhum projeto encontrado</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tente ajustar seus filtros ou critérios de busca.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            </motion.div>
          ) : view === "table" ? (
            <div className="relative overflow-x-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Projeto
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Setor
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Urgência
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Progresso
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Prazo
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => {
                    const urgencyInfo = getUrgencyInfo(project.urgency);
                    const { progress, isDelayed, endDate } = getProjectProgress(project);
                    
                    return (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`border-b transition-colors hover:bg-muted/50 ${
                          isDelayed ? 'bg-destructive/5' : ''
                        }`}
                      >
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="font-medium">{project.projectName}</span>
                            <span className="text-xs text-muted-foreground">
                              {project.cell}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">{project.sector}</td>
                        <td className="p-4 align-middle">
                          <Badge className={statuses[project.status].color}>
                            {statuses[project.status].label}
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div className={`flex items-center gap-2 ${urgencyInfo.color}`}>
                            {urgencyInfo.icon}
                            <span className="capitalize">{project.urgency}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="w-full space-y-1">
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className={`h-2 rounded-full ${
                                  isDelayed ? 'bg-destructive' : 'bg-primary'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {Math.round(progress)}% decorrido
                            </p>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className={isDelayed ? 'text-destructive' : ''}>
                              {formatDate(endDate)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-right align-middle">
                          <Link to={`/project/${project.id}`}>
                            <Button variant="outline" size="sm">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => {
                const urgencyInfo = getUrgencyInfo(project.urgency);
                const { progress, isDelayed, endDate } = getProjectProgress(project);
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className={isDelayed ? 'border-destructive' : ''}>
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{project.projectName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {project.sector} - {project.cell}
                            </p>
                          </div>
                          <Badge className={statuses[project.status].color}>
                            {statuses[project.status].label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-4">
                          <div className={`flex items-center gap-2 ${urgencyInfo.color}`}>
                            {urgencyInfo.icon}
                            <span className="capitalize">{project.urgency} Urgência</span>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Progresso</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                              <div
                                className={`h-2 rounded-full ${
                                  isDelayed ? 'bg-destructive' : 'bg-primary'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className={isDelayed ? 'text-destructive' : ''}>
                              Prazo: {formatDate(endDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Link to={`/project/${project.id}`}>
                            <Button className="w-full" variant="outline">
                              Ver Detalhes
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <p>
              Exibindo {filteredProjects.length} de {projects.length} projetos
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}