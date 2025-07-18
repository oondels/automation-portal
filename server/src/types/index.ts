import { WebSocket } from 'ws';
import { Project } from '../models/Project';

export interface WsClient extends WebSocket {
  id: string;
  isAlive: boolean;
  matricula?: number;
}

// Project
export type CreateProjectDTO = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'isArchived'>;
