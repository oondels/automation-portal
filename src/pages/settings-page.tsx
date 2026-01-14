import { useMemo, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BellOff,
  Mail,
  Save,
  Settings as SettingsIcon,
  Users,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  PlayCircle,
  PauseCircle,
  XCircle,
  FileCheck,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { useAuth } from "../context/auth-context";
import { configService, UserStats } from "../services/ConfigService";
import { teamService, TeamMember } from "../services/TeamService";
import notification from "../components/Notification";

export function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [canManageTeam, setCanManageTeam] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isTeamLoading, setIsTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);

  const [newMember, setNewMember] = useState({
    registration: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<
    Partial<Pick<TeamMember, "name" | "username" | "unidadeDass" | "role" | "level"> & { rfid: string; barcode: string }>
  >({});

  const localEligibleForTeamAdmin = useMemo(() => {
    const setor = String(user?.setor ?? "").trim().toUpperCase();
    const nivel = String(user?.nivel ?? "").trim().toUpperCase();
    const funcao = String(user?.funcao ?? "").trim().toUpperCase();
    return (
      setor === "AUTOMACAO" &&
      nivel === "A" &&
      ["ANALISTA", "COORDENADOR", "ADMIN"].includes(funcao)
    );
  }, [user?.funcao, user?.nivel, user?.setor]);
  
  // User Stats
  const [stats, setStats] = useState<UserStats>({
    requested: 0,
    approved: 0,
    inProgress: 0,
    paused: 0,
    completed: 0,
    rejected: 0,
    total: 0,
  });

  // Notification Settings
  const [email, setEmail] = useState("");
  const [unidadeDass, setUnidadeDass] = useState("SEST");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  // Load user data
  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load stats and notification settings in parallel
      const [statsData, notificationData, accessData] = await Promise.all([
        configService.getUserStats().catch(() => null),
        configService.getNotificationSettings().catch(() => null),
        localEligibleForTeamAdmin ? teamService.getAccess().catch(() => null) : Promise.resolve(null),
      ]);

      if (statsData) {
        setStats(statsData);
      }

      if (notificationData) {
        setEmail(notificationData.email || "");
        setUnidadeDass(notificationData.unidadeDass || "SEST");
        setIsEmailConfirmed(notificationData.confirmed || false);
        setNotificationsEnabled(
          notificationData.authorizedNotificationsApps?.includes("automation") || false
        );
      } else {
        // Set defaults from user context
        setUnidadeDass(user?.unidade || "SEST");
      }

      setCanManageTeam(Boolean(accessData?.canManage));
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      notification.error("Erro", "Não foi possível carregar suas configurações.");
    } finally {
      setIsLoading(false);
    }
  }, [localEligibleForTeamAdmin, user]);

  const loadTeamMembers = useCallback(async () => {
    if (!canManageTeam) {
      setTeamMembers([]);
      return;
    }

    setIsTeamLoading(true);
    setTeamError(null);
    try {
      const rows = await teamService.listMembers();
      setTeamMembers(rows);
    } catch (error: any) {
      const message = error?.response?.data?.message || "Não foi possível carregar a equipe.";
      setTeamError(message);
    } finally {
      setIsTeamLoading(false);
    }
  }, [canManageTeam]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  const handleCreateTeamMember = async () => {
    if (!newMember.registration) {
      notification.error("Erro", "Preencha a matrícula.");
      return;
    }

    setIsSaving(true);
    try {
      await teamService.createMember({
        registration: newMember.registration,
      });

      setNewMember({
        registration: "",
      });

      notification.success("Sucesso!", "Membro adicionado à equipe.");
      await loadTeamMembers();
    } catch (error: any) {
      notification.error("Erro", error?.response?.data?.message || "Não foi possível adicionar o membro.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (member: TeamMember) => {
    setEditingId(member.id);
    setEditDraft({
      name: member.name,
      username: member.username,
      unidadeDass: member.unidadeDass,
      role: member.role,
      level: member.level,
      rfid: member.rfid,
      barcode: member.barcode,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveEdit = async (id: string) => {
    setIsSaving(true);
    try {
      await teamService.updateMember(id, editDraft);
      notification.success("Sucesso!", "Membro atualizado.");
      cancelEdit();
      await loadTeamMembers();
    } catch (error: any) {
      notification.error("Erro", error?.response?.data?.message || "Não foi possível atualizar o membro.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeMember = async (id: string) => {
    const ok = window.confirm("Remover este membro da equipe?");
    if (!ok) return;

    setIsSaving(true);
    try {
      await teamService.removeMember(id);
      notification.success("Sucesso!", "Membro removido.");
      if (editingId === id) cancelEdit();
      await loadTeamMembers();
    } catch (error: any) {
      notification.error("Erro", error?.response?.data?.message || "Não foi possível remover o membro.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!email || !email.includes("@")) {
      notification.error("Erro", "Por favor, insira um email válido.");
      return;
    }

    setIsSaving(true);
    try {
      await configService.updateEmail(email, unidadeDass);
      notification.success("Sucesso!", "Email atualizado com sucesso.");
      loadUserData(); // Reload to get updated confirmation status
    } catch (error: any) {
      notification.error(
        "Erro",
        error?.response?.data?.message || "Não foi possível atualizar o email."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!isEmailConfirmed) {
      notification.error("Erro", "Você precisa confirmar seu email antes de ativar notificações.");
      return;
    }

    setIsSaving(true);
    try {
      const applications = enabled ? ["automation"] : [];
      await configService.updateNotificationSettings(enabled, applications);
      setNotificationsEnabled(enabled);
      notification.success(
        "Sucesso!",
        enabled ? "Notificações ativadas!" : "Notificações desativadas."
      );
    } catch (error: any) {
      notification.error(
        "Erro",
        error?.response?.data?.message || "Não foi possível atualizar as notificações."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const statsCards = [
    {
      title: "Solicitados",
      value: stats.requested,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Aprovados",
      value: stats.approved,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Em Progresso",
      value: stats.inProgress,
      icon: PlayCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Pausados",
      value: stats.paused,
      icon: PauseCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
    },
    {
      title: "Concluídos",
      value: stats.completed,
      icon: FileCheck,
      color: "text-teal-600",
      bgColor: "bg-teal-100 dark:bg-teal-900/20",
    },
    {
      title: "Rejeitados",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <SettingsIcon className="h-8 w-8" />
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e visualize suas estatísticas
        </p>
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Informações do Usuário</CardTitle>
            <CardDescription>Seus dados cadastrados no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Nome</Label>
                <p className="font-medium">{user?.nome || "Não disponível"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Usuário</Label>
                <p className="font-medium">{user?.usuario || "Não disponível"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Matrícula</Label>
                <p className="font-medium">{user?.matricula || "Não disponível"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Setor</Label>
                <p className="font-medium">{user?.setor || "Não disponível"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Função</Label>
                <p className="font-medium">{user?.funcao || "Não disponível"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Unidade</Label>
                <p className="font-medium">{user?.unidade || "Não disponível"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Configurações de Email
            </CardTitle>
            <CardDescription>
              Configure seu email para receber notificações sobre seus projetos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSaving}
                />
                <Button onClick={handleSaveEmail} disabled={isSaving || !email}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar
                    </>
                  )}
                </Button>
              </div>
              {isEmailConfirmed && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Email confirmado
                </p>
              )}
             
            </div>

            {/* Notification Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                {notificationsEnabled ? (
                  <Bell className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <BellOff className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <div className="space-y-1">
                  <Label htmlFor="notifications" className="cursor-pointer">
                    Notificações de Automação
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações sobre aprovações, início, pausa e conclusão de projetos
                  </p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
                disabled={isSaving || !isEmailConfirmed}
              />
            </div>

            {!isEmailConfirmed && (
              <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  <strong>Atenção:</strong> Você precisa confirmar seu email antes de ativar as
                  notificações.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Automation Team Settings */}
      {canManageTeam && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Equipe de Automação
              </CardTitle>
              <CardDescription>
                Liste e gerencie usuários cadastrados na tabela de time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add member */}
              <div className="space-y-3">
                <Label className="text-muted-foreground">Adicionar membro</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    placeholder="Matrícula"
                    value={newMember.registration}
                    onChange={(e) => setNewMember((p) => ({ ...p, registration: e.target.value }))}
                    disabled={isSaving}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleCreateTeamMember} disabled={isSaving}>
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}
                  </Button>
                </div>
              </div>

              {/* List members */}
              <div className="space-y-3">
                <Label className="text-muted-foreground">Membros</Label>
                {teamError && (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-destructive">{teamError}</p>
                  </div>
                )}
                {isTeamLoading ? (
                  <div className="flex items-center justify-center min-h-[120px]">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="border rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">Nenhum membro cadastrado.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {teamMembers.map((member) => {
                      const isEditing = editingId === member.id;
                      return (
                        <div key={member.id} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <p className="font-medium">
                                {member.name} <span className="text-muted-foreground">({member.registration})</span>
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Usuário: {member.username} · Unidade DASS: {member.unidadeDass}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!isEditing ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startEdit(member)}
                                    disabled={isSaving}
                                  >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Editar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeMember(member.id)}
                                    disabled={isSaving}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Remover
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => saveEdit(member.id)}
                                    disabled={isSaving}
                                  >
                                    <Save className="h-4 w-4 mr-2" />
                                    Salvar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={cancelEdit}
                                    disabled={isSaving}
                                  >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancelar
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                              <Input
                                placeholder="Nome"
                                value={String(editDraft.name ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, name: e.target.value }))}
                                disabled={isSaving}
                              />
                              <Input
                                placeholder="Usuário"
                                value={String(editDraft.username ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, username: e.target.value }))}
                                disabled={isSaving}
                              />
                              <Input
                                placeholder="Unidade DASS"
                                value={String(editDraft.unidadeDass ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, unidadeDass: e.target.value }))}
                                disabled={isSaving}
                              />
                              <Input
                                placeholder="Role"
                                value={String(editDraft.role ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, role: e.target.value }))}
                                disabled={isSaving}
                              />
                              <Input
                                placeholder="Level"
                                value={String(editDraft.level ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, level: e.target.value }))}
                                disabled={isSaving}
                              />
                              <Input
                                placeholder="RFID"
                                value={String(editDraft.rfid ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, rfid: e.target.value }))}
                                disabled={isSaving}
                              />
                              <Input
                                placeholder="Código de barras"
                                value={String(editDraft.barcode ?? "")}
                                onChange={(e) => setEditDraft((p) => ({ ...p, barcode: e.target.value }))}
                                disabled={isSaving}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Project Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas de Projetos</CardTitle>
            <CardDescription>
              Total de projetos solicitados: <strong>{stats.total}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className={`${stat.bgColor} p-3 rounded-full mb-2`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground text-center">{stat.title}</p>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
