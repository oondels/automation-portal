import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  MapPin,
  Tag,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  FileText,
  AlertTriangle,
  Activity,
  Timer,
  Users,
  Target,
  Image,
  Save,
  X,
  LucideMessageCircleQuestion,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { useProjects } from "../context/projects-context";
import { useAuth } from "../context/auth-context";
import { IntervalObject, Project, ProjectStatus } from "../types";
import { formatDate, calculateEstimatedEndDate, formateInterval } from "../lib/utils";

import { IntervalInput } from "../components/IntervalInput";
import { projectService } from "../services/ProjectService";
import notification from "../components/Notification";
import { Tooltip } from "../components/ui/tooltip";

export function ProjectDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { getProject, updateProjectStatus, isLoading } = useProjects();
  const authContext = useAuth();

  const [estimatedDurationTime, setEstimatedDurationTime] = useState<string>("");
  const [project, setProject] = useState<Project | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [statusComment, setStatusComment] = useState("");
  const [pauseReason, setPauseReason] = useState("");
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "logs">("overview");

  function isZeroInterval(i?: IntervalObject): boolean {
    if (!i) return true;
    return Object.values(i).every((v) => !v || v <= 0);
  }

  useEffect(() => {
    if (id && !isLoading) {
      const foundProject = getProject(id);
      console.log("Found project:", foundProject);
      setProject(foundProject);
      setEditedProject(foundProject || {});
    }
  }, [id, getProject, isLoading]);

  // Verificação de segurança para o contexto de autenticação
  if (!authContext) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Erro de autenticação</h2>
        <p className="text-muted-foreground">Contexto de autenticação não disponível.</p>
      </div>
    );
  }
  const { user } = authContext;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <h2 className="text-xl font-semibold">Carregando projeto...</h2>
        <p className="text-muted-foreground">Por favor, aguarde enquanto carregamos os dados.</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
        <p className="text-muted-foreground">O projeto solicitado não existe ou foi removido.</p>
        <Link to="/projects">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>
        </Link>
      </div>
    );
  }

  if (!project.id || !project.projectName) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Dados do projeto inválidos</h2>
        <p className="text-muted-foreground">Os dados do projeto estão corrompidos ou incompletos.</p>
        <Link to="/projects">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>
        </Link>
      </div>
    );
  }


  const handleSetEstimatedTime = async () => {
    console.log(estimatedDurationTime);
    try {
      await projectService.setEstimatedDurationTime(project.id, estimatedDurationTime);
      notification.success("Sucesso!", "Prazo estimado definido com sucesso.", 3000);
    } catch (error) {
      console.error("Error setting estimated time:", error);
      notification.error("Erro!", "Erro ao definir o prazo estimado do projeto.", 3000);
    }
  }

  if (user?.setor !== "AUTOMACAO" && user?.funcao !== "GERENTE" && project.status === "requested") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Clock className="h-12 w-12 text-yellow-200" />
        <h2 className="text-xl font-semibold">Projeto Solicitado...</h2>
        <h3>Aguarde a aprovação para visualizar informações.</h3>
        <p className="text-muted-foreground">
          Apenas gerentes podem visualizar e aprovar/rejeitar projetos solicitados.
        </p>
        <Link to="/projects">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Projetos
          </Button>
        </Link>
      </div>
    );
  }

  const approveProject = async (status: string) => {
    try {
      if (project.urgency === editedProject.urgency) {
        alert("A urgência do projeto foi mantida.");
      }

      await projectService.approveProject(project.id, status, editedProject.urgency as string);
      notification.success(
        "Sucesso!",
        `Projeto atualizado para: ${status === "approved" ? "Aprovado" : "Reprovado"}.`,
        3000
      );
    } catch (error: any) {
      notification.error("Erro!", error.response.data.message || "Erro ao atualizar status do projeto.", 3000);
    }
  };

  const handleStatusChange = (newStatus: ProjectStatus) => {
    if (newStatus === "paused") {
      setShowStatusDialog(true);
    } else {
      updateProjectStatus(project.id, newStatus, user?.id || "system", statusComment);
      setStatusComment("");
    }
  };

  const handlePauseProject = () => {
    if (pauseReason.trim()) {
      updateProjectStatus(project.id, "paused", user?.id || "system", pauseReason);
      setPauseReason("");
      setShowStatusDialog(false);
    }
  };

  const handleSaveEdit = () => {
    // Aqui seria implementada a atualização do projeto
    setProject({ ...project, ...editedProject });
    setIsEditing(false);
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "requested":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paused":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Calcular progresso do projeto
  const getProjectProgress = () => {
    if (
      !project.startDate ||
      !project.estimatedDurationTime ||
      typeof project.estimatedDurationTime !== "string" ||
      !project.estimatedDurationTime.trim()
    )
      return 0;

    const startDate = new Date(project.startDate);
    const endDate = calculateEstimatedEndDate(project.startDate, project.estimatedDurationTime);
    const today = new Date();

    const total = endDate.getTime() - startDate.getTime();
    const elapsed = today.getTime() - startDate.getTime();

    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const progress = getProjectProgress();
  const isDelayed =
    project.startDate &&
    project.estimatedDurationTime &&
    typeof project.estimatedDurationTime === "string" &&
    project.estimatedDurationTime.trim() &&
    new Date() > calculateEstimatedEndDate(project.startDate, project.estimatedDurationTime) &&
    project.status !== "completed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex items-center space-x-4">
          <Link to="/projects">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.projectName}</h1>
            <p className="text-muted-foreground">#{project.id}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSaveEdit} size="sm">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </>
          ) : (
            <>
              {/* Edit Button */}
              {/* <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                <Edit3 className="mr-2 h-4 w-4" />
                Editar
              </Button> */}

              {/* Botões de ação de status */}
              {project.status === "requested" && (
                <>
                  <Button onClick={() => approveProject("approved")} size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                  <Button variant="destructive" onClick={() => handleStatusChange("rejected")} size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Rejeitar
                  </Button>
                </>
              )}

              {project.status === "approved" && (
                <div className="flex flex-col space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium">Projeto Aprovado</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Aprovado por: {project.approvedBy?.split(".")[0] + " " + project.approvedBy?.split(".")[1]}
                  </p>
                  <div className="flex items-center space-x-2 text-blue-600 mt-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">Defina o prazo estimado de produção</span>
                  </div>
                </div>
              )}

              {project.status === "in_progress" && (
                <>
                  <Button variant="outline" onClick={() => handleStatusChange("paused")} size="sm">
                    <Pause className="mr-2 h-4 w-4" />
                    Pausar
                  </Button>
                  <Button onClick={() => handleStatusChange("completed")} size="sm">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Concluir
                  </Button>
                </>
              )}

              {project.status === "paused" && (
                <Button onClick={() => handleStatusChange("in_progress")} size="sm">
                  <Play className="mr-2 h-4 w-4" />
                  Retomar
                </Button>
              )}
            </>
          )}
        </div>
      </motion.div>

      {/* Status e Informações Principais */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Status</span>
            </div>
            <Badge className={`mt-2 ${getStatusColor(project.status)}`}>
              {project.status === "requested"
                ? "Solicitado"
                : project.status === "approved"
                ? "Aprovado"
                : project.status === "in_progress"
                ? "Em Andamento"
                : project.status === "paused"
                ? "Pausado"
                : project.status === "completed"
                ? "Concluído"
                : project.status === "rejected"
                ? "Rejeitado"
                : project.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Urgência</span>
            </div>

            {/* TODO: && user?.funcao === "gerente" */}
            {project.status === "requested" ? (
              <select
                value={editedProject.urgency || project.urgency}
                onChange={(e) =>
                  setEditedProject({ ...editedProject, urgency: e.target.value as "high" | "medium" | "low" })
                }
                className={`mt-2 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  bg-gray-100 text-gray-800 border-gray-200`}
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
              </select>
            ) : (
              <Badge className={`mt-2 ${getUrgencyColor(project.urgency)}`}>
                {project.urgency === "high" ? "Alta" : project.urgency === "medium" ? "Média" : "Baixa"}
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Data de Criação</span>
            </div>
            <p className="mt-2 font-semibold">{project.createdAt ? formatDate(project.createdAt) : "Não informado"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Timer className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Prazo Estimado</span>

              <Tooltip content="Defina o prazo do projeto, Exemplo: 1 mês, 2 semanas, 10 dias, 5 horas...">
                <span className="ml-1 cursor-pointer text-primary/70 hover:text-primary transition-colors">
                  <LucideMessageCircleQuestion className="h-4 w-4 pulse-info text-yellow-500" />
                </span>
              </Tooltip>
            </div>

            {/* TODO: Continuar implementação de atualização do tempo estimado de conclusão do projeto */}
            {project.status === "approved" && isZeroInterval(project.estimatedDurationTime as IntervalObject) ? (
              <div className="space-y-2 mt-2">
                {/* <input
                  type="text"
                  placeholder="Defina o prazo estimado"
                  className="w-full px-3 py-2 text-sm text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={estimatedDurationTime}
                  onChange={(e) => setEstimatedDurationTime(e.target.value)}
                /> */}
                <IntervalInput onChange={(value) => setEstimatedDurationTime(value)} />
                <Button onClick={handleSetEstimatedTime} size="sm" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Prazo
                </Button>
              </div>
            ) : (
              <div>
                <p className="mt-2 font-semibold">
                  {project.estimatedDurationTime &&
                  typeof project.estimatedDurationTime === "object"
                    ? formateInterval(project.estimatedDurationTime)
                    : "Não definido"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Progresso do Projeto */}
      {project.status === "in_progress" &&
        project.startDate &&
        project.estimatedDurationTime &&
        typeof project.estimatedDurationTime === "string" &&
        project.estimatedDurationTime.trim() && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Progresso do Projeto</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progresso: {Math.round(progress)}%</span>
                    <span className={isDelayed ? "text-red-600" : ""}>{isDelayed ? "Em atraso" : "No prazo"}</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className={`h-3 rounded-full transition-all ${isDelayed ? "bg-red-500" : "bg-blue-500"}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Início: {formatDate(project.startDate)}</span>
                    <span>
                      Previsão:{" "}
                      {formatDate(calculateEstimatedEndDate(project.startDate, project.estimatedDurationTime))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      {/* Tabs de Navegação */}
      <div className="border-b">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "timeline"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "logs"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Logs
          </button>
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Informações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Detalhes do Projeto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Descrição</Label>
                  {isEditing ? (
                    <Textarea
                      value={editedProject.description || ""}
                      onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                      rows={4}
                    />
                  ) : (
                    <p className="mt-1">{project.description || "Não informado"}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{project.sector || "Não informado"}</span>
                    </div>
                  </div>

                  {project.cell && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Célula</Label>
                      <p className="mt-1">{project.cell}</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo de Projeto</Label>
                  <div className="flex items-center mt-1">
                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{project.projectType || "Não informado"}</span>
                  </div>
                </div>

                {project.expectedGains && Array.isArray(project.expectedGains) && project.expectedGains.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Ganhos Esperados</Label>
                    <ul className="mt-1 space-y-1">
                      {project.expectedGains.map((gain, index) => (
                        <li key={index} className="flex items-center">
                          <Target className="h-3 w-3 mr-2 text-green-500" />
                          <span className="text-sm">{typeof gain === "string" ? gain : JSON.stringify(gain)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.projectTags && Array.isArray(project.projectTags) && project.projectTags.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {project.projectTags.map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {typeof tag === "string" ? tag : JSON.stringify(tag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informações do Solicitante */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Informações do Solicitante</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {typeof project.requestedBy === "object" ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Nome</Label>
                      <p className="mt-1 font-medium">{project.requestedBy.nome}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="mt-1">{project.requestedBy.email || "Não informado"}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Função</Label>
                      <p className="mt-1">{project.requestedBy.funcao}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Setor</Label>
                      <p className="mt-1">{project.requestedBy.setor}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Matrícula</Label>
                      <p className="mt-1">{project.requestedBy.matricula}</p>
                    </div>
                  </>
                ) : (
                  <p>
                    ID do usuário: {typeof project.requestedBy === "string" ? project.requestedBy : "Não informado"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Equipe Responsável */}
            {project.automationTeam && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Equipe Responsável</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Time</Label>
                    <p className="mt-1 font-medium">{project.automationTeam.name}</p>
                    {project.automationTeam.description && (
                      <p className="text-sm text-muted-foreground mt-1">{project.automationTeam.description}</p>
                    )}
                  </div>

                  {project.automationTeam.members &&
                    Array.isArray(project.automationTeam.members) &&
                    project.automationTeam.members.length > 0 && (
                      <div className="mt-4">
                        <Label className="text-sm font-medium text-muted-foreground">Membros</Label>
                        <div className="mt-2 space-y-2">
                          {project.automationTeam.members.map((member, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="h-4 w-4 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{member.nome}</p>
                                <p className="text-xs text-muted-foreground">{member.funcao}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Imagens do Projeto */}
            {project.pictures && Array.isArray(project.pictures) && project.pictures.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Image className="h-5 w-5" />
                    <span>Imagens</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {project.pictures.map((picture, index) => (
                      <div key={index} className="rounded-lg overflow-hidden border">
                        <img src={picture} alt={`Imagem ${index + 1}`} className="w-full h-32 object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {activeTab === "timeline" && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Timeline do Projeto</CardTitle>
                <CardDescription>Histórico completo de atividades e mudanças de status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.timeline && Array.isArray(project.timeline) && project.timeline.length > 0 ? (
                    project.timeline.map((event) => (
                      <div key={event.id} className="flex items-start space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                        <div className="flex-1">
                          <p className="font-medium">{event.type}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(event.date)}</p>
                          {event.comment && <p className="text-sm mt-1">{event.comment}</p>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhum evento registrado ainda.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {activeTab === "logs" && (
          <motion.div
            key="logs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Logs do Sistema</CardTitle>
                <CardDescription>Registro detalhado de todas as ações realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.logs && Array.isArray(project.logs) && project.logs.length > 0 ? (
                    project.logs.map((log) => (
                      <div key={log.id} className="border-l-2 border-blue-200 pl-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{log.action}</p>
                            {log.details && <p className="text-sm text-muted-foreground mt-1">{log.details}</p>}
                          </div>
                          <span className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">Nenhum log registrado ainda.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog para pausar projeto */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pausar Projeto</DialogTitle>
            <DialogDescription>Informe o motivo da pausa do projeto para registro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="pause-reason">Motivo da pausa</Label>
              <Textarea
                id="pause-reason"
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                placeholder="Descreva o motivo da pausa..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handlePauseProject} disabled={!pauseReason.trim()}>
                Pausar Projeto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
