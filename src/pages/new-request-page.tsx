import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Activity,
  AlertCircle,
  Clock,
  Factory,
  FileText,
  Layers,
  MapPin,
  Tags
} from "lucide-react";
import { useProjects } from "../context/projects-context";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { sectors } from "../data/mockData";
import { ProjectUrgency } from "../types";

const projectTypes = [
  { id: "app_dev", label: "Desenvolvimento de Aplicativo" },
  { id: "iot", label: "IOT" },
  { id: "process", label: "Automação de Processos" },
];

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
  const { addProject } = useProjects();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    sector: "",
    cell: "",
    projectType: "",
    urgency: "" as ProjectUrgency,
    description: "",
    selectedGains: [] as string[],
  });

  const handleGainToggle = (gainId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGains: prev.selectedGains.includes(gainId)
        ? prev.selectedGains.filter(id => id !== gainId)
        : [...prev.selectedGains, gainId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sector || !formData.cell || !formData.projectType || !formData.urgency || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const expectedGainsObject = expectedGains.reduce((acc, gain) => ({
        ...acc,
        [gain.id]: formData.selectedGains.includes(gain.id)
      }), {});

      const newProject = addProject({
        name: formData.name,
        sector: formData.sector,
        cell: formData.cell,
        status: "requested",
        urgency: formData.urgency,
        description: formData.description,
        expectedGains: expectedGainsObject,
        requestedBy: user?.id || "",
        estimatedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });

      toast.success("Project request submitted successfully!");
      navigate(`/projects/${newProject.id}`);
    } catch (error) {
      toast.error("Failed to submit project request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-3xl py-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Nova Solicitação de Projeto</h1>
            <p className="text-muted-foreground">
              Envie uma nova solicitação de projeto de automação para revisão
            </p>
          </div>
          <div className="hidden md:block">
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Projeto</CardTitle>
            <CardDescription>
              Informe os detalhes do projeto que você deseja solicitar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Nome do Projeto <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Digite o título do projeto"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="max-w-xl"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sector" className="flex items-center gap-2">
                  <Factory className="h-4 w-4" />
                  Setor <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.sector}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sector: value }))}
                >
                  <SelectTrigger>
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

              <div className="space-y-2">
                <Label htmlFor="cell" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Célula <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="cell"
                  placeholder="Especifique a célula"
                  value={formData.cell}
                  onChange={(e) => setFormData(prev => ({ ...prev, cell: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Tipo de Projeto <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.projectType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
                className="grid gap-2 md:grid-cols-3"
              >
                {projectTypes.map((type) => (
                  <Label
                    key={type.id}
                    htmlFor={type.id}
                    className="flex cursor-pointer items-center space-x-2 rounded-md border p-4 hover:bg-accent"
                  >
                    <RadioGroupItem value={type.id} id={type.id} />
                    <span>{type.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Nível de Urgência <span className="text-destructive">*</span>
              </Label>
              <RadioGroup
                value={formData.urgency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, urgency: value as ProjectUrgency }))}
                className="grid gap-2 md:grid-cols-3"
              >
                {urgencyLevels.map((level) => (
                  <Label
                    key={level.value}
                    htmlFor={level.value}
                    className={`flex cursor-pointer items-center space-x-2 rounded-md border p-4 ${level.color}`}
                  >
                    <RadioGroupItem value={level.value} id={level.value} />
                    <span>{level.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Descrição do Projeto <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva os objetivos e o escopo do projeto"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Tags className="h-4 w-4" />
                Ganhos Esperados
              </Label>
              <div className="flex flex-wrap gap-2">
                {expectedGains.map((gain) => (
                  <Button
                    key={gain.id}
                    type="button"
                    variant={formData.selectedGains.includes(gain.id) ? "default" : "outline"}
                    onClick={() => handleGainToggle(gain.id)}
                    className="h-auto py-1.5"
                  >
                    {gain.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
              />
            ) : null}
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </Button>
        </div>
      </motion.form>
    </div>
  );
}