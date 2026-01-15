import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Trash2, UserCheck, UserX } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import notification from "./Notification";
import { useAuth } from "../context/auth-context";
import { approverService } from "../services/ApproverService";
import { Approver, CreateApproverPayload, UpdateApproverPayload } from "../types";

export function ApproverSettingsCard() {
  const { user } = useAuth();

  // Apenas para funcao = analista || gerente || coordenador
  const localEligible = useMemo(() => {
    const funcao = String(user?.funcao ?? "").trim().toUpperCase();
    return ["ANALISTA", "GERENTE", "COORDENADOR"].includes(funcao);
  }, [user?.funcao]);

  const [canManageApprovers, setCanManageApprovers] = useState(false);
  const [isAccessLoading, setIsAccessLoading] = useState(false);

  const [approvers, setApprovers] = useState<Approver[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newApprover, setNewApprover] = useState<CreateApproverPayload>({
    matricula: "",
    usuario: "",
    unidadeDass: "SEST",
    role: "",
    permission: "",
    active: true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<UpdateApproverPayload>({});

  useEffect(() => {
    if (!localEligible) {
      setCanManageApprovers(false);
      return;
    }

    setIsAccessLoading(true);
    approverService
      .getAccess()
      .then((r) => setCanManageApprovers(Boolean(r?.canManageApprovers)))
      .catch(() => setCanManageApprovers(false))
      .finally(() => setIsAccessLoading(false));
  }, [localEligible]);

  const loadApprovers = useCallback(async () => {
    if (!canManageApprovers) {
      setApprovers([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await approverService.listApprovers();
      setApprovers(response.data ?? []);
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Não foi possível carregar os aprovadores.";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [canManageApprovers]);

  useEffect(() => {
    loadApprovers();
  }, [loadApprovers]);

  const startEdit = (approver: Approver) => {
    setEditingId(approver.id);
    setEditDraft({
      usuario: approver.usuario,
      unidadeDass: approver.unidadeDass,
      role: approver.role,
      permission: approver.permission ?? null,
      active: approver.active,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditDraft({});
  };

  const saveEdit = async (id: string) => {
    setIsSaving(true);
    try {
      const payload: UpdateApproverPayload = {
        ...editDraft,
        permission:
          editDraft.permission === "" ? null : (editDraft.permission ?? null),
      };
      await approverService.updateApprover(id, payload);
      notification.success("Sucesso!", "Aprovador atualizado.");
      cancelEdit();
      await loadApprovers();
    } catch (e: any) {
      notification.error("Erro", e?.response?.data?.message || "Não foi possível atualizar o aprovador.");
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    setIsSaving(true);
    try {
      await approverService.toggleApproverStatus(id);
      notification.success("Sucesso!", currentActive ? "Aprovador desativado." : "Aprovador ativado.");
      await loadApprovers();
    } catch (e: any) {
      notification.error("Erro", e?.response?.data?.message || "Não foi possível alterar o status.");
    } finally {
      setIsSaving(false);
    }
  };

  const removeApprover = async (id: string, usuario: string) => {
    const ok = window.confirm(`Desativar (remover) o aprovador ${usuario}?`);
    if (!ok) return;

    setIsSaving(true);
    try {
      await approverService.deleteApprover(id);
      notification.success("Sucesso!", "Aprovador desativado.");
      if (editingId === id) cancelEdit();
      await loadApprovers();
    } catch (e: any) {
      notification.error("Erro", e?.response?.data?.message || "Não foi possível desativar o aprovador.");
    } finally {
      setIsSaving(false);
    }
  };

  const createApprover = async () => {
    if (!newApprover.matricula || !newApprover.usuario || !newApprover.unidadeDass || !newApprover.role) {
      notification.error("Erro", "Preencha Matrícula, Usuário, Unidade DASS e Role.");
      return;
    }

    setIsSaving(true);
    try {
      await approverService.createApprover({
        ...newApprover,
        permission: newApprover.permission ? newApprover.permission : null,
        active: true,
      });
      notification.success("Sucesso!", "Aprovador adicionado.");
      setNewApprover({
        matricula: "",
        usuario: "",
        unidadeDass: "SEST",
        role: "",
        permission: "",
        active: true,
      });
      await loadApprovers();
    } catch (e: any) {
      notification.error("Erro", e?.response?.data?.message || "Não foi possível adicionar o aprovador.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!localEligible) return null;

  if (isAccessLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Aprovadores
          </CardTitle>
          <CardDescription>Carregando permissões…</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[80px]">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  // Além da regra do front (funcao), respeita a regra do backend (/approvers/access)
  if (!canManageApprovers) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="h-5 w-5" />
          Aprovadores
        </CardTitle>
        <CardDescription>Listar, editar, adicionar e remover aprovadores</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Add approver */}
        <div className="space-y-3">
          <Label className="text-muted-foreground">Adicionar aprovador</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              placeholder="Matrícula"
              value={newApprover.matricula}
              onChange={(e) => setNewApprover((p) => ({ ...p, matricula: e.target.value }))}
              disabled={isSaving}
            />
            <Input
              placeholder="Usuário"
              value={newApprover.usuario}
              onChange={(e) => setNewApprover((p) => ({ ...p, usuario: e.target.value }))}
              disabled={isSaving}
            />
            <Input
              placeholder="Unidade DASS"
              value={newApprover.unidadeDass}
              onChange={(e) => setNewApprover((p) => ({ ...p, unidadeDass: e.target.value }))}
              disabled={isSaving}
            />
            <Input
              placeholder="Role"
              value={newApprover.role}
              onChange={(e) => setNewApprover((p) => ({ ...p, role: e.target.value }))}
              disabled={isSaving}
            />
            <Input
              placeholder="Permission (opcional)"
              value={String(newApprover.permission ?? "")}
              onChange={(e) => setNewApprover((p) => ({ ...p, permission: e.target.value }))}
              disabled={isSaving}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={loadApprovers} disabled={isSaving || isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Recarregar"}
            </Button>
            <Button onClick={createApprover} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Adicionar"}
            </Button>
          </div>
        </div>

        {/* List approvers */}
        <div className="space-y-3">
          <Label className="text-muted-foreground">Aprovadores cadastrados</Label>

          {error && (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center min-h-[120px]">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : approvers.length === 0 ? (
            <div className="border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Nenhum aprovador cadastrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvers.map((a) => {
                const isEditing = editingId === a.id;
                return (
                  <div key={a.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {a.usuario}{" "}
                          <span className="text-muted-foreground">({a.matricula})</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Role: {a.role} · Unidade DASS: {a.unidadeDass}
                        </p>
                        <p className="text-sm">
                          Status:{" "}
                          <span className={a.active ? "text-green-600" : "text-muted-foreground"}>
                            {a.active ? "Ativo" : "Inativo"}
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isEditing ? (
                          <>
                            <Button variant="outline" size="sm" onClick={() => startEdit(a)} disabled={isSaving}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleActive(a.id, a.active)}
                              disabled={isSaving}
                            >
                              {a.active ? <UserX className="h-4 w-4 mr-2" /> : <UserCheck className="h-4 w-4 mr-2" />}
                              {a.active ? "Desativar" : "Ativar"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeApprover(a.id, a.usuario)}
                              disabled={isSaving}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="outline" size="sm" onClick={cancelEdit} disabled={isSaving}>
                              Cancelar
                            </Button>
                            <Button size="sm" onClick={() => saveEdit(a.id)} disabled={isSaving}>
                              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {isEditing && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Input
                          placeholder="Usuário"
                          value={String(editDraft.usuario ?? "")}
                          onChange={(e) => setEditDraft((p) => ({ ...p, usuario: e.target.value }))}
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
                          placeholder="Permission"
                          value={String(editDraft.permission ?? "")}
                          onChange={(e) => setEditDraft((p) => ({ ...p, permission: e.target.value }))}
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
  );
}
