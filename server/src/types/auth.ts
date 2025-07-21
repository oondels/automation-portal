export interface TokenPayload {
  id: string;
  matricula: number;
  funcao: string;
  usuario?: string;
  iat?: number;
  exp?: number;
}