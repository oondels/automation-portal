import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";
import { TokenPayload } from "../types/auth"

const PRIVATE_KEY = config.secret_key

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;  
  if (!token) {
    res.status(401).json({ message: "Acesso negado! Token de acesso não fornecido!" });
    return;
  }

  jsonwebtoken.verify(token, PRIVATE_KEY, (error: any, decoded: any) => {
    if (error) {
      if (error.name === "TokenExpiredError") {
        res.status(401).json({ message: "Acesso expirado! Por favor, faça login novamente." });
      } else {
        res.status(401).json({ message: "Acesso negado! Token de acesso inválido ou expirado!" });
      }
      return;
    }

    if (!decoded) {
      res.status(401).json({ message: "Acesso negado! Token de acesso inválido ou expirado!" });
      return;
    }

    req.user = decoded as TokenPayload;
    next();
  });
};