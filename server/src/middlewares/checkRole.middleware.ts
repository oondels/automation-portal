import { Request, Response, NextFunction } from "express";

// TODO: Tranferir armazenamento de usuarios liberados para tabela propria
// TODO: Fazer configuração geral -> Marcenaria, Serralheria e Automação
const approvalUsers: string[] = ["SERGIO.GONCALVES", "EDUARDO.BISOL", "HENDRIUS.SANTANA"]

// Verifica o ususario e funcao
export const CheckRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      if (req.user.funcao === role.toLocaleUpperCase() && req.user.usuario && approvalUsers.includes(req.user.usuario)) {
        next();
        return;
      }
    }

    res.status(403).json({ message: 'Acesso negado! Você não possui acesso a essa funcionalidade! Entre em contato com o suporte!' });
    return;
  };
}