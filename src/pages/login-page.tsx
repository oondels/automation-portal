import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/auth-context";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { BrainCircuit } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      
      setTimeout(() => {
        navigate("/dashboard");
      }, 1300);
    } catch (err) {
      console.error("Erro ao efetuar login: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <div className="hidden lg:relative lg:flex lg:w-1/2 lg:flex-col">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20" />
        <div className="relative flex h-full items-center justify-center p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto max-w-2xl text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mb-8 flex justify-center"
            >
              <div className="rounded-full bg-primary p-3 text-white">
                <BrainCircuit size={40} />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Dass Automação
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Simplificando a gestão da automação de processos industriais para maior eficiência
            </p>
          </motion.div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-foreground">
              Faça login na sua conta
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Insira suas credenciais para acessar o painel
            </p>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <div className="space-y-2">
                <Label htmlFor="email">Usuário Dass</Label>
                <Input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Button variant="link" type="button" className="h-auto p-0 text-xs">
                    Esqueceu a senha?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
                onSubmit={handleSubmit}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"
                  />
                ) : null}
                {isSubmitting ? "Fazendo login..." : "Entrar"}
              </Button>
            </div>
          </motion.form>
        </motion.div>

      </div>
    </div>
  );
}