import { authApi } from "../services/httpClient";

class AuthService {
  private storageKey = "user";

  async login(usuario: string, senha: string) {
    console.log("logging...");

    const response = await authApi.post("/auth/login", {
      usuario,
      senha
    });

    console.log(response.data)
    const decodedUser = JSON.parse(atob(response.data?.userData)); // decodifica de base64
    localStorage.setItem(this.storageKey, JSON.stringify(decodedUser));

    return decodedUser;
  }
}


export const authService = new AuthService();