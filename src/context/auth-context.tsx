import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { User } from "../types";
import { authService } from "../services/AuthService";
import notification from "../components/Notification";

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
    const tokenExpiration = localStorage.getItem("tokenExpiration");
     if (!tokenExpiration) {
        return;
      }
    
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await authService.login(email, password);

      notification.success('Sucesso!', "Login realizado com sucesso!", 2000);
      setUser(user);
    } catch (e: unknown) {
      const error = e as { response?: { status?: number, data?: string } };
      const errorMessage = error?.response?.status === 401 ? error?.response?.data : "Erro ao efetuar login, tente novamente em alguns instantes.";

      notification.error('Falha no Login', errorMessage || 'Erro interno no servidor de autenticação.', 5000);
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logout realizado com sucesso!");
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
