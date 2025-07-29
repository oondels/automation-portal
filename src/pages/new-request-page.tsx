import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  MessageCircleQuestion,
  Clock,
  Factory,
  FileText,
  Layers,
  Tags,
  Hammer,
  Drill,
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { sectors } from "../data/mockData";
import { ProjectType, ProjectUrgency } from "../types";
import { Tooltip } from "../components/ui/tooltip";
import notification from "../components/Notification";
import { useProjects } from "../context/projects-context";

const urgencyLevels: { value: ProjectUrgency; label: string; color: string }[] = [
  { value: "low", label: "Baixa", color: "bg-success/10 text-success hover:bg-success/20" },
  { value: "medium", label: "Média", color: "bg-warning/10 text-warning hover:bg-warning/20" },
  { value: "high", label: "Alta", color: "bg-destructive/10 text-destructive hover:bg-destructive/20" },
];

const expectedGains = [
  { id: "people", label: "Pessoas" },
  { id: "costs", label: "Custos Operacionais" },
  { id: "ergonomics", label: "Ergonomia" },
];

export function NewRequestPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addProject } = useProjects();

  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    projectType: "",
    projectSector: "",
    urgency: "" as ProjectUrgency,
    description: "",
    selectedGains: [] as string[],
  });

  const handleGainToggle = (gainId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedGains: prev.selectedGains.includes(gainId)
        ? prev.selectedGains.filter((id) => id !== gainId)
        : [...prev.selectedGains, gainId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.sector ||
      !formData.projectType ||
      !formData.urgency ||
      !formData.description
    ) {
      notification.warning(
        "Aviso!",
        "Todos os campos são necessários.",
        3000
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = {
        projectName: formData.name,
        sector: formData.sector,
        status: "requested" as const,
        urgency: formData.urgency,
        description: formData.description,
        projectType: formData.projectType,
        expectedGains: formData.selectedGains || [],
        requestedBy: user?.matricula || "",
      };

      const newProject = await addProject(requestData);
      notification.success(
        "Solicitação de projeto enviada com sucesso!",
        "Sua solicitação foi registrada e está sendo processada.",
        3000
      );

      navigate(`/projects/`);
    } catch (error: any) {
      console.error("Erro ao solicitar Projeto: ", error);
      
      notification.error(
        "Erro ao enviar solicitação de projeto",
        error.response.data.message || "Sua solicitação não pôde ser processada. Tente novamente mais tarde.",
        5000
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              Nova Solicitação de Projeto
            </h1>
            <p className="text-muted-foreground mt-2">
              {/* TODO: Mostrar tipo de projeto dinamicamente de acordo com a escolha do usuario, exemplo: projeto de automação ou projeto de marcenaria */}
              Envie uma nova solicitação de projeto de automação para revisão
            </p>
          </div>
          <div className="hidden md:flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
            {/* TODO: Alterar ícone dinâmicamente de acordo com o tipo de slicitação, exemplo: Automação, Marcenaria, Serralheria, etc */}
            {/* <BrainCircuit className="h-8 w-8 text-primary" /> */}
            {/* <Drill className="h-8 w-8 text-primary" /> */}
            {/* <Hammer className="h-8 w-8 text-primary" /> */}
            {(() => {
              switch (formData.projectSector) {
                case "automation":
                  return <BrainCircuit className="h-8 w-8 text-primary" />;
                case "carpentry":
                  return <Hammer className="h-8 w-8 text-primary" />;
                case "metalwork":
                  return <Drill className="h-8 w-8 text-primary" />;
                default:
                  return <Factory className="h-8 w-8 text-primary" />;
              }
            })()}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-1 border shadow-sm"
      >
        <motion.form onSubmit={handleSubmit} className="space-y-8">
          <Card className="overflow-hidden border-0 shadow-none">
            <CardHeader className="bg-muted/30 px-6 py-5 border-b">
              <CardTitle className="text-xl flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Detalhes do Projeto
              </CardTitle>
              <CardDescription className="text-base">
                Informe os detalhes do projeto que você deseja solicitar.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 px-6 py-6">
              <div className="space-y-3 pt-2">
                <Label htmlFor="projectType" className="flex items-center gap-2 text-base font-medium">
                  <Layers className="h-4 w-4 text-primary" />
                  Setor do Projeto
                </Label>
                <Select
                  value={formData.projectSector}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, projectSector: value }))}
                >
                  <SelectTrigger className="w-full rounded-lg border-muted-foreground/20 focus-visible:ring-primary">
                    <SelectValue placeholder="Selecione um Tipo de Projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="automation">Automação</SelectItem>
                    <SelectItem value="carpentry">Marcenaria</SelectItem>
                    <SelectItem value="metalwork">Serralheria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Just show project type select if the project request goes for `Automation` */}
              {(() => {
                switch (formData.projectSector) {
                  case "automation":
                    return (
                      <div className="space-y-3 pt-2">
                        <Label htmlFor="projectType" className="flex items-center gap-2 text-base font-medium">
                          <Layers className="h-4 w-4 text-primary" />
                          Tipo de Projeto
                        </Label>
                        <Select
                          value={formData.projectType}
                          onValueChange={(value) => setFormData((prev) => ({ ...prev, projectType: value }))}
                        >
                          <SelectTrigger className="w-full rounded-lg border-muted-foreground/20 focus-visible:ring-primary">
                            <SelectValue placeholder="Selecione um Tipo de Projeto" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value={ProjectType.APP_DEVELOPMENT}>Desenvolvimento de Aplicação</SelectItem>
                            <SelectItem value={ProjectType.PROCESS_AUTOMATION}>Automação de Processos</SelectItem>
                            <SelectItem value={ProjectType.APP_IMPROVEMENT}>Melhoria de Aplicativo</SelectItem>
                            <SelectItem value={ProjectType.APP_FIX}>Correção de Aplicativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  case "carpentry":
                    return;
                  case "metalwork":
                    return;
                }
              })()}

              <div className="space-y-3">
                <Label htmlFor="name" className="flex items-center gap-2 text-base font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Nome do Projeto
                </Label>
                <Input
                  id="name"
                  placeholder="Digite o título do projeto"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="max-w-xl rounded-lg border-muted-foreground/20 focus-visible:ring-primary"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="sector" className="flex items-center gap-2 text-base font-medium">
                    <Factory className="h-4 w-4 text-primary" />
                    Setor Solicitante
                  </Label>
                  <Select
                    value={formData.sector}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, sector: value }))}
                  >
                    <SelectTrigger className="rounded-lg border-muted-foreground/20 focus-visible:ring-primary">
                      <SelectValue placeholder="Selecione um Setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.name}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Clock className="h-4 w-4 text-primary" />
                  Nível de Urgência{" "}
                  <Tooltip content="Escolha o nível de urgência para o projeto.">
                    <span className="ml-1 cursor-pointer text-primary/70 hover:text-primary transition-colors">
                      <MessageCircleQuestion className="h-4 w-4" />
                    </span>
                  </Tooltip>
                </Label>
                <RadioGroup
                  value={formData.urgency}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, urgency: value as ProjectUrgency }))}
                  className="grid gap-3 md:grid-cols-3"
                >
                  {urgencyLevels.map((level) => {
                    // Replace aggressive colors with more friendly variants
                    const colorMap = {
                      low: "bg-emerald-50 text-black-100 hover:bg-emerald-100 border-emerald-100",
                      medium: "bg-amber-50 text-black-100 hover:bg-amber-100 border-amber-100",
                      high: "bg-rose-50 text-black-100 hover:bg-rose-100 border-rose-100",
                    };
                    const color = colorMap[level.value as keyof typeof colorMap];

                    return (
                      <Label
                        key={level.value}
                        htmlFor={level.value}
                        className={`flex cursor-pointer items-center space-x-2 rounded-xl border p-4 transition-colors ${color}`}
                      >
                        <RadioGroupItem value={level.value} id={level.value} />
                        <span>{level.label}</span>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>

              <div className="space-y-3 pt-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-base font-medium">
                  <FileText className="h-4 w-4 text-primary" />
                  Descrição do Projeto
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva os objetivos e o escopo do projeto"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[120px] rounded-lg border-muted-foreground/20 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-3 pt-2">
                <Label className="flex items-center gap-2 text-base font-medium">
                  <Tags className="h-4 w-4 text-primary" />
                  Ganhos Esperados
                </Label>
                <div className="flex flex-wrap gap-2">
                  {expectedGains.map((gain) => (
                    <Button
                      key={gain.id}
                      type="button"
                      variant={formData.selectedGains.includes(gain.id) ? "default" : "outline"}
                      onClick={() => handleGainToggle(gain.id)}
                      className={`h-auto py-2 px-4 rounded-full transition-all ${
                        formData.selectedGains.includes(gain.id)
                          ? "bg-primary/90 hover:bg-primary"
                          : "hover:bg-primary/10 hover:text-primary"
                      }`}
                    >
                      {gain.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-4 p-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="rounded-full px-6">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px] rounded-full px-6 py-6 h-auto font-medium text-base bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600 transition-all"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                  />
                  <span>Enviando...</span>
                </>
              ) : (
                "Enviar Solicitação"
              )}
            </Button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
