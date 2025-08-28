import { Request, Response, NextFunction } from "express";

// TODO: Fazer configuração geral -> Marcenaria, Serralheria e Automação
// TODO: Tranferir armazenamento de usuarios liberados para tabela propria
type RolePermissionMap = {
  [action: string]: {
    allowedRoles: string[],
    allowedUsers?: string[],
    allowedSectors?: string[],
  };
};

const permissionMap: RolePermissionMap = {
  approveProject: {
    allowedRoles: ["GERENTE"],
    allowedUsers: ["SERGIO.GONCALVES", "EDUARDO.BISOL", "HENDRIUS.SANTANA", "MARCOS.SOARES"]
  },
  updateEstimatedTime: {
    allowedRoles: ["ANALISTA", "COORDENADOR", "TI", "MARCENEIRO", "SERRALHEIRO"],
    allowedSectors: ["AUTOMACAO", "MARCENARIA", "SERRALHERIA", "TI"]
  },
  attendProject: {
    allowedRoles: ["ANALISTA", "AUTOMACAO", "MECANICO", "TI", "MARCENEIRO", "SERRALHEIRO"],
    allowedSectors: ["AUTOMACAO", "TI", "MARCENARIA", "SERRALHERIA"]
  },
};

// Verifica o ususario, funcao e permissões
// Se o usuario não tiver permissão, retorna 403
// Se o usuario tiver permissão, chama o next
export const CheckPermission = (action: keyof typeof permissionMap, role: string = "") => {
  return (req: Request, res: Response, next: NextFunction) => {
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

    const roleAllowed = permission.allowedRoles.includes(user.funcao?.toUpperCase?.() ?? "");
    const userAllowed = permission.allowedUsers ? permission.allowedUsers.includes(user?.usuario as string) : true;
    const sectorAllowed = permission.allowedSectors ? permission.allowedSectors.includes(user?.setor?.toUpperCase?.() ?? "") : true;

    if ((roleAllowed && sectorAllowed) || (roleAllowed && userAllowed) || user.funcao.toUpperCase() === role.toUpperCase()) {
      next();
      return
    }

    res.status(403).json({
      message: "Acesso negado! Você não possui acesso a essa funcionalidade. Entre em contato com o suporte."
    });
    return
  };
};
