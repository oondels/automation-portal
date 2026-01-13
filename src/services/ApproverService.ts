import { api } from "./httpClient";
import { Approver, CreateApproverPayload, UpdateApproverPayload } from "../types";

class ApproverService {
  /**
   * Lista todos os aprovadores
   */
  async listApprovers(): Promise<{ message: string; data: Approver[] }> {
    try {
      const response = await api.get("/api/approvers");
      return response.data;
    } catch (error) {
      console.error("Error listing approvers:", error);
      throw error;
    }
  }

  /**
   * Busca um aprovador por ID
   */
  async getApprover(id: string): Promise<{ message: string; data: Approver }> {
    try {
      const response = await api.get(`/api/approvers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error getting approver:", error);
      throw error;
    }
  }

  /**
   * Cria um novo aprovador
   */
  async createApprover(payload: CreateApproverPayload): Promise<{ message: string; data: Approver }> {
    try {
      const response = await api.post("/api/approvers", payload);
      return response.data;
    } catch (error) {
      console.error("Error creating approver:", error);
      throw error;
    }
  }

  /**
   * Atualiza um aprovador existente
   */
  async updateApprover(id: string, payload: UpdateApproverPayload): Promise<{ message: string; data: Approver }> {
    try {
      const response = await api.patch(`/api/approvers/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error("Error updating approver:", error);
      throw error;
    }
  }

  /**
   * Desativa um aprovador (soft delete)
   */
  async deleteApprover(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete(`/api/approvers/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting approver:", error);
      throw error;
    }
  }

  /**
   * Alterna o status ativo/inativo de um aprovador
   */
  async toggleApproverStatus(id: string): Promise<{ message: string; data: Approver }> {
    try {
      const response = await api.patch(`/api/approvers/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.error("Error toggling approver status:", error);
      throw error;
    }
  }
}

export const approverService = new ApproverService();
