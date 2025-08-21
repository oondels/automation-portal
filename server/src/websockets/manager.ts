import { WebSocketServer } from "ws";
import http from "http"
import { v4 as uuid } from "uuid"
import { WsClient } from "../types";



export class WsManager {
  private clients = new Map<string, WsClient>();

  constructor(server: http.Server) {
    const wss = new WebSocketServer({ server })

    wss.on("connection", (ws: WsClient) => {
      const id = uuid()
      ws.id = id
      ws.isAlive = true
      this.clients.set(id, ws)

      ws.on("pong", () => ws.isAlive = true)

      ws.on('message', (data) => {
        console.log(`MSG[${ws.id}]:`, data.toString())
      });

      ws.on('close', () => this.clients.delete(ws.id));
    })

    // Single heartbeat interval for all clients
    setInterval(() => {
      this.clients.forEach(client => {
        if (!client.isAlive) {
          client.terminate()
          this.clients.delete(client.id)
          return
        }
        client.isAlive = false
        try { client.ping() } catch (_) { /* no-op */ }
      })
    }, 15000)
  }

  broadcast(msg: unknown) {
    const payload = typeof msg === "string" ? msg : JSON.stringify(msg)
    this.clients.forEach(client => {
      client.send(payload)
    })
  }
}
