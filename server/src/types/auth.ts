export interface TokenPayload {
  id: string;
  matricula: string;
  funcao: string;
  usuario?: string;
  setor?: string;
  iat?: number;
  exp?: number;
}
