import { authApi } from "../services/httpClient";

class AuthService {
  private storageKey = "user";

  async login(usuario: string, senha: string) {
    const response = await authApi.post("/auth/login", {
      usuario,
      senha
    },
      { withCredentials: true });

    const now = new Date();
    const tokenExpiration = response.data?.tokenExpirationTime || "";
    if (!tokenExpiration) {
      throw new Error("Token de autenticação não recebido.");
    }
    localStorage.setItem("tokenExpiration", now.getTime() + tokenExpiration);

    const decodedUser = JSON.parse(atob(response.data?.userData));
    localStorage.setItem(this.storageKey, JSON.stringify(decodedUser));

    return decodedUser;
  }
}


export const authService = new AuthService();