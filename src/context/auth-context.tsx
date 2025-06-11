import { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { users } from "../data/mockData";
import { authApi } from "../services/httpClient";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      console.log(JSON.parse(savedUser).usuario);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.post("/auth/login", {
        usuario: email,
        senha: password,
      });

      const decodedUser = JSON.parse(atob(response.data?.userData)); // decodifica de base64
      
      setUser(decodedUser);
      localStorage.setItem("user", JSON.stringify(decodedUser));
      setUser(user);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Credenciais inválidas");
      } else {
        setError("Erro no servidor. Tente novamente.");
      }

      // Re-propagar o erro para que o componente possa capturá-lo
      throw error;
    } finally {
      setIsLoading(false);
    }

    // return new Promise((resolve) => {
    //   // Simulate API call
    //   setTimeout(() => {
    //     // Simple authentication logic
    //     const foundUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    //     if (foundUser && password === "password") {
    //       setUser(foundUser);
    //       localStorage.setItem("user", JSON.stringify(foundUser));
    //       setIsLoading(false);
    //       resolve(true);
    //     } else {
    //       setError("Invalid email or password");
    //       setIsLoading(false);
    //       resolve(false);
    //     }
    //   }, 1000);
    // });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
