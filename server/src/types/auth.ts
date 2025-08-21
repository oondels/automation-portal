export interface TokenPayload {
  id: string;
  matricula: number;
  funcao: string;
  usuario?: string;
  setor?: string;
  iat?: number;
  exp?: number;
}
