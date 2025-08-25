import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bot,
  Brain,
  ChevronRight,
  Factory,
  Fingerprint,
  Gauge,
  BrainCircuit,
  Rocket,
  Timer,
  Workflow,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
// import { Badge } from "../components/ui/badge";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
          style={{
            backgroundImage: "url(/images/bg.png)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-8 flex justify-center"
            >
              <div className="rounded-2xl bg-primary/10 p-3">
                {/* TODO: Alterar ícone dinâmicamente de acordo com o tipo de slicitação, exemplo: Automação, Marcenaria, Serralheria, etc */}
                <BrainCircuit className="h-12 w-12 text-primary" />
              </div>
            </motion.div>
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Bem Vindo ao Portal de Solicitações
              {/* TODO: Fazer reconhecimento de Unidade de forma dinâmica */}
              <span className="block text-primary">Dass Santo Estêvão</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text">
              Onde a inovação encontra a eficiência Industrial. Transformando processos e impulsionando a produtividade
              através da automação inteligente.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/projects">
                <Button size="lg" className="gap-2">
                  Explore Projetos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/new-request">
                <Button size="lg" variant="outline" className="gap-2">
                  Solicite um Novo Projeto
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Sobre o Portal</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Workflow className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Gestão Simplificada</h3>
                  <p className="text-center text-muted-foreground">
                    Acompanhe e gerencie projetos de automação de forma eficiente e transparente.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Timer className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Agilidade</h3>
                  <p className="text-center text-muted-foreground">
                    Processo otimizado para solicitação e aprovação de novos projetos.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <Gauge className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">Monitoramento</h3>
                  <p className="text-center text-muted-foreground">
                    Acompanhamento em tempo real do progresso e status dos projetos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Conheça Nossa Equipe
            </h2>
            <div className="grid gap-8 sm:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                      <img
                        src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Marcos Menezes"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Marcos Menezes</h3>
                      <p className="text-primary">Coordenador de TI e Automação</p>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Responsável pela estratégia e coordenação dos projetos de automação, garantindo alinhamento com os
                    objetivos do negócio.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 overflow-hidden rounded-full bg-muted">
                      <img
                        src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100"
                        alt="Hendrius Félix"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Hendrius Félix</h3>
                      <p className="text-primary">Engenheiro de Software</p>
                      <div className="mt-1 flex gap-2">
                        <Badge variant="secondary">Programmer</Badge>
                        <Badge variant="secondary">DevOps</Badge>
                        <Badge variant="secondary">IoT</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground">
                    Desenvolvedor fullstack especializado em automação industrial e IoT, responsável pela implementação
                    técnica das soluções.
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Por que Automação na Dass?
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Rocket className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Processos Mais Rápidos</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Otimização e aceleração dos processos produtivos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Fingerprint className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Melhor Rastreabilidade</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Controle e monitoramento preciso da produção
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Bot className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Integração IoT</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Conectividade e automação inteligente dos equipamentos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col items-center p-6">
                  <Brain className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 text-lg font-semibold">Inovação Digital</h3>
                  <p className="text-center text-sm text-muted-foreground">
                    Liderança em transformação digital no setor
                  </p>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <Factory className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Dass Santo Estêvão</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <p className="text-sm text-muted-foreground">Contato: TI e Automação - Ramal 4702</p>
              <span className="hidden sm:inline text-muted-foreground">•</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
