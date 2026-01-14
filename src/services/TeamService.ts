import { api } from "./httpClient";

export type TeamMember = {
  id: string;
  name: string;
  registration: string;
  rfid: string;
  barcode: string;
  username: string;
  unidadeDass: string;
  role: string;
  level: string;
  createdAt: string;
  updatedAt: string;
  user: {
    matricula: string;
    nome: string | null;
    usuario: string | null;
    setor: string | null;
    funcao: string | null;
    nivel: string | null;
    unidade: string | null;
  };
};

export type CreateTeamMemberPayload = {
  registration: string;
};

export type UpdateTeamMemberPayload = Partial<
  Pick<TeamMember, "name" | "username" | "unidadeDass" | "role" | "level"> & {
    rfid: string;
    barcode: string;
  }
>;

class TeamService {
  async getAccess(): Promise<{ canManage: boolean }> {
    const response = await api.get("/api/team/access");
    return response.data;
  }

  async listMembers(): Promise<TeamMember[]> {
    const response = await api.get("/api/team/");
    return response.data;
  }

  async createMember(payload: CreateTeamMemberPayload): Promise<TeamMember> {
    const response = await api.post("/api/team/", payload);
    return response.data;
  }

  async updateMember(id: string, payload: UpdateTeamMemberPayload): Promise<TeamMember> {
    const response = await api.patch(`/api/team/${id}`, payload);
    return response.data;
  }

  async removeMember(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/api/team/${id}`);
    return response.data;
  }
}

export const teamService = new TeamService();
