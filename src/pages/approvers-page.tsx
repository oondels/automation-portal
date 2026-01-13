import { useState, useEffect } from "react";
import { approverService } from "../services/ApproverService";
import { Approver, CreateApproverPayload, UpdateApproverPayload } from "../types";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Plus, Pencil, Trash2, RefreshCw, UserCheck, UserX } from "lucide-react";
import notification from "../components/Notification";

export function ApproversPage() {
  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingApprover, setEditingApprover] = useState<Approver | null>(null);
  const [formData, setFormData] = useState<CreateApproverPayload>({
    matricula: "",
    usuario: "",
    unidadeDass: "",
    role: "",
    permission: "",
    active: true,
  });

  useEffect(() => {
    loadApprovers();
  }, []);

  const loadApprovers = async () => {
    try {
      setLoading(true);
      const response = await approverService.listApprovers();
      setApprovers(response.data);
    } catch (error: any) {
      notification.error("Erro ao carregar", error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (approver?: Approver) => {
    if (approver) {
      setEditingApprover(approver);
      setFormData({
        matricula: approver.matricula,
        usuario: approver.usuario,
        unidadeDass: approver.unidadeDass,
        role: approver.role,
        permission: approver.permission || "",
        active: approver.active,
      });
    } else {
      setEditingApprover(null);
      setFormData({
        matricula: "",
        usuario: "",
        unidadeDass: "",
        role: "",
        permission: "",
        active: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingApprover(null);
    setFormData({
      matricula: "",
      usuario: "",
      unidadeDass: "",
      role: "",
      permission: "",
      active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingApprover) {
        // Atualizar (não pode mudar matrícula)
        const updatePayload: UpdateApproverPayload = {
          usuario: formData.usuario,
          unidadeDass: formData.unidadeDass,
          role: formData.role,
          permission: formData.permission || null,
          active: formData.active,
        };
        await approverService.updateApprover(editingApprover.id, updatePayload);
        notification.success("Sucesso", "Aprovador atualizado com sucesso!");
      } else {
        // Criar novo
        await approverService.createApprover(formData);
        notification.success("Sucesso", "Aprovador criado com sucesso!");
      }
      handleCloseDialog();
      loadApprovers();
    } catch (error: any) {
      notification.error(
        "Erro ao salvar",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleToggleStatus = async (approver: Approver) => {
    try {
      await approverService.toggleApproverStatus(approver.id);
      notification.success(
        "Sucesso",
        `Aprovador ${!approver.active ? "ativado" : "desativado"} com sucesso!`
      );
      loadApprovers();
    } catch (error: any) {
      notification.error(
        "Erro ao alterar status",
        error?.response?.data?.message || error.message
      );
    }
  };

  const handleDelete = async (approver: Approver) => {
    if (!window.confirm(`Tem certeza que deseja desativar o aprovador ${approver.usuario}?`)) {
      return;
    }

    try {
      await approverService.deleteApprover(approver.id);
      notification.success("Sucesso", "Aprovador desativado com sucesso!");
      loadApprovers();
    } catch (error: any) {
      notification.error(
        "Erro ao desativar",
        error?.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Aprovadores</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os usuários com permissão para aprovar projetos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={loadApprovers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Aprovador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingApprover ? "Editar Aprovador" : "Novo Aprovador"}
                </DialogTitle>
                <DialogDescription>
                  {editingApprover
                    ? "Atualize as informações do aprovador"
                    : "Adicione um novo aprovador ao sistema"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="matricula">Matrícula *</Label>
                  <Input
                    id="matricula"
                    value={formData.matricula}
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    disabled={!!editingApprover}
                    required
                  />
                  {editingApprover && (
                    <p className="text-xs text-muted-foreground">
                      A matrícula não pode ser alterada
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuario">Usuário *</Label>
                  <Input
                    id="usuario"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    minLength={3}
                    maxLength={100}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unidadeDass">Unidade DASS *</Label>
                  <Input
                    id="unidadeDass"
                    value={formData.unidadeDass}
                    onChange={(e) => setFormData({ ...formData, unidadeDass: e.target.value })}
                    minLength={2}
                    maxLength={20}
                    placeholder="Ex: UPA, UPB"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    minLength={3}
                    maxLength={30}
                    placeholder="Ex: GERENTE, COORDENADOR"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permission">Permissão</Label>
                  <Input
                    id="permission"
                    value={formData.permission || ""}
                    onChange={(e) => setFormData({ ...formData, permission: e.target.value })}
                    maxLength={30}
                    placeholder="Ex: approveProject"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                  <Label htmlFor="active">Ativo</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingApprover ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approvers.map((approver) => (
            <Card key={approver.id} className={!approver.active ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {approver.usuario}
                      {approver.active ? (
                        <Badge variant="default" className="bg-green-500">
                          <UserCheck className="h-3 w-3 mr-1" />
                          Ativo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <UserX className="h-3 w-3 mr-1" />
                          Inativo
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Matrícula: {approver.matricula}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Unidade DASS:</span> {approver.unidadeDass}
                  </div>
                  <div>
                    <span className="font-semibold">Role:</span>{" "}
                    <Badge variant="outline">{approver.role}</Badge>
                  </div>
                  {approver.permission && (
                    <div>
                      <span className="font-semibold">Permissão:</span>{" "}
                      <Badge variant="secondary">{approver.permission}</Badge>
                    </div>
                  )}
                  {approver.user?.email && (
                    <div>
                      <span className="font-semibold">Email:</span> {approver.user.email.email}
                      {approver.user.email.confirmed && (
                        <Badge variant="outline" className="ml-2 text-xs">
                          Confirmado
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(approver)}
                    className="flex-1"
                  >
                    <Pencil className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant={approver.active ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(approver)}
                  >
                    {approver.active ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(approver)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && approvers.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UserX className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold">Nenhum aprovador cadastrado</p>
            <p className="text-muted-foreground mb-4">
              Adicione um novo aprovador para começar
            </p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Aprovador
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
