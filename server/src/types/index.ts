import { WebSocket } from 'ws';

export interface WsClient extends WebSocket {
  id: string;
  isAlive: boolean;
  matricula?: number;
}