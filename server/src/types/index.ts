import { WebSocket } from 'ws';
import { Project } from '../models/Project';
import { Request } from "express";
import { TokenPayload } from "./auth"

export interface WsClient extends WebSocket {
  id: string;
  isAlive: boolean;
  matricula?: number;
}

// Project
export type CreateProjectDTO = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>;

declare global {
  namespace Express {
    interface User extends TokenPayload { }

    interface Request {
      user?: User;
    }
  }
}