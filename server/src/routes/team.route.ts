import Router from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { validateRequest } from "../middlewares/validateRequest.middleware";
import { AutomationTeamAdminMiddleware } from "../middlewares/automationTeamAdmin.middleware";
import { createTeamSchema } from "../dtos/create-team.dto";
import { updateTeamSchema } from "../dtos/update-team.dto";
import { TeamController } from "../controllers/team.controller";

export const teamRoute = Router();
const teamController = new TeamController();

teamRoute.get("/access", AuthMiddleware, teamController.getAccess.bind(teamController));

teamRoute.get(
	"/",
	AuthMiddleware,
	AutomationTeamAdminMiddleware,
	teamController.list.bind(teamController)
);

teamRoute.post(
	"/",
	AuthMiddleware,
	AutomationTeamAdminMiddleware,
	validateRequest(createTeamSchema),
	teamController.create.bind(teamController)
);

teamRoute.patch(
	"/:id",
	AuthMiddleware,
	AutomationTeamAdminMiddleware,
	validateRequest(updateTeamSchema),
	teamController.update.bind(teamController)
);

teamRoute.delete(
	"/:id",
	AuthMiddleware,
	AutomationTeamAdminMiddleware,
	teamController.remove.bind(teamController)
);
