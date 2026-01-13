import axios from "axios"
import { config } from "../config/env"
import { NotificationPayload } from "../types/notification"
import { AppDataSource } from "../config/data-source";
import { NotificationEmail } from "../models/NotificationEmail"
import { AppError } from "../utils/AppError";

const notificationRepository = AppDataSource.getRepository(NotificationEmail)
export const NotificationService = {
  async sendNotification(payload: NotificationPayload) {
    try {
      await axios.post(`${config.notification_api}/notification/`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.notification_api_key,
        }
      })
    } catch (error: any) {
      console.error("Error sending notification:", error);
      return
    }
  },

  async isNotificationEnabled(registration: string, dassOffice: string) {
    try {
      const userEmail = await notificationRepository.findOne({
        where: {
          userEmail: {
            matricula: registration,
          },
          unidadeDass: dassOffice
        },
      })

      if (!userEmail) {
        console.log("Notificações desabilitadas para este usuário.");
        return;
      }

      const authorizedApps = userEmail.authorizedNotificationsApps
      const isNotificationEnabled = authorizedApps?.includes("automation")

      return isNotificationEnabled;
    } catch (error: any) {
      const errorMessage = error instanceof AppError ? error.message : "Erro Interno no servidor!";
      console.error("Error checking notification enabled:", errorMessage);
      throw error;
    }
  },

  async getUserEmail(registration: string, dassOffice: string) {
    try {
      const userEmail = await notificationRepository.findOne({
        where:{
          userEmail: {
            matricula: registration,
          },
          unidadeDass: dassOffice
        
        }
      })

      return userEmail?.email;
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }

      throw new AppError("Erro ao buscar email do usuario", 500)
    }
  }
}