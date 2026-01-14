import { api } from "./httpClient";

export interface UserStats {
  requested: number;
  approved: number;
  inProgress: number;
  paused: number;
  completed: number;
  rejected: number;
  total: number;
}

export interface NotificationSettings {
  email: string;
  confirmed: boolean;
  unidadeDass: string;
  authorizedNotificationsApps: string[];
}

class ConfigService {
  /**
   * Busca estatísticas de projetos do usuário
   */
  async getUserStats(): Promise<UserStats> {
    try {
      const response = await api.get('/config/stats');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      throw error;
    }
  }

  /**
   * Busca configurações de notificação do usuário
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await api.get('/config/notifications');
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar configurações de notificação:", error);
      throw error;
    }
  }

  /**
   * Atualiza email do usuário
   */
  async updateEmail(email: string, unidadeDass: string): Promise<{ message: string }> {
    try {
      const response = await api.post('/config/email', { email, unidadeDass });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar email:", error);
      throw error;
    }
  }

  /**
   * Atualiza configurações de notificação
   */
  async updateNotificationSettings(
    enabled: boolean,
    applications: string[]
  ): Promise<{ message: string }> {
    try {
      const response = await api.patch('/config/notifications', {
        enabled,
        applications
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar configurações de notificação:", error);
      throw error;
    }
  }
}

export const configService = new ConfigService();
