import Router from "express"
import { ConfigController } from "../controllers/config.controller"
import { AuthMiddleware } from "../middlewares/auth.middleware"
import { validateRequest } from "../middlewares/validateRequest.middleware"
import { updateEmailSchema } from "../dtos/update-email.dto"
import { updateNotificationSettingsSchema } from "../dtos/update-notification-settings.dto"

export const configRoute = Router()
const configController = new ConfigController()

configRoute.get("/stats", AuthMiddleware, configController.getUserStats.bind(configController))

configRoute.get(
	"/notifications",
	AuthMiddleware,
	configController.getNotificationSettings.bind(configController)
)

configRoute.post(
	"/email",
	AuthMiddleware,
	validateRequest(updateEmailSchema),
	configController.updateEmail.bind(configController)
)

configRoute.patch(
	"/notifications",
	AuthMiddleware,
	validateRequest(updateNotificationSettingsSchema),
	configController.updateNotificationSettings.bind(configController)
)