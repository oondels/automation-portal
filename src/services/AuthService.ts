import { authApi } from "../services/httpClient";

class AuthService {
  private storageKey = "user";

  async login(usuario: string, senha: string) {
    const response = await authApi.post("/auth/login", {
      usuario,
      senha
    },
      { withCredentials: true });

    const decodedUser = JSON.parse(atob(response.data?.userData));
    localStorage.setItem(this.storageKey, JSON.stringify(decodedUser));

    return decodedUser;
  }
}


export const authService = new AuthService();