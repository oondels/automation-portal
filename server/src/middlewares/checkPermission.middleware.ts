import { Request, Response, NextFunction } from "express";

// TODO: Fazer configuração geral -> Marcenaria, Serralheria e Automação
// TODO: Tranferir armazenamento de usuarios liberados para tabela propria
export type RolePermissionMap = {
  [action: string]: {
    allowedRoles: string[],
    allowedUsers?: string[],
    allowedSectors?: string[],
  };
};

// TODO: Fazer gerenciamento das outras permissoes com mapeamento e armazenamento em banco de dados, retirar o hardcode atual
export const permissionMap: RolePermissionMap = {
  updateEstimatedTime: {
    allowedRoles: ["ANALISTA", "COORDENADOR", "TI", "MARCENEIRO", "SERRALHEIRO"],
    allowedSectors: ["AUTOMACAO", "MARCENARIA", "SERRALHERIA", "TI"]
  },
  attendProject: {
    allowedRoles: ["ANALISTA", "AUTOMACAO", "MECANICO", "TI", "MARCENEIRO", "SERRALHEIRO"],
    allowedSectors: ["AUTOMACAO", "TI", "MARCENARIA", "SERRALHERIA"]
  }
};

// Verifica o ususario, funcao e permissões
// Se o usuario não tiver permissão, retorna 403
// Se o usuario tiver permissão, chama o next
export const CheckPermission = (action: keyof typeof permissionMap, role: string = "") => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const permission = permissionMap[action];

    if (!user || !permission) {
      res.status(403).json({ message: "Acesso negado. Permissão não definida." });
      return
    }
    if (!permission.allowedRoles || permission.allowedRoles.length === 0) {
      res.status(403).json({ message: "Acesso negado. Nenhuma função permitida." });
      return
    }

    const userRole = String(user.funcao ?? "").trim().toUpperCase();
    const userSector = String(user.setor ?? "").trim().toUpperCase();
    const userLogin = String((user as any)?.usuario ?? "").trim();

    const roleAllowed = permission.allowedRoles.includes(userRole);

    const userAllowed = permission.allowedUsers === undefined
      ? true
      : (permission.allowedUsers.length > 0 && permission.allowedUsers.includes(userLogin));

    const sectorAllowed = permission.allowedSectors === undefined
      ? true
      : (permission.allowedSectors.length > 0 && permission.allowedSectors.includes(userSector));

    const overrideRole = String(role ?? "").trim().toUpperCase();

    if ((roleAllowed && sectorAllowed && userAllowed) || (overrideRole && userRole === overrideRole)) {
      next();
      return
    }

    res.status(403).json({
      message: "Acesso negado! Você não possui acesso a essa funcionalidade. Entre em contato com o suporte."
    });
    return
  };
};
