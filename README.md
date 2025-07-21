# Plataforma de Solicitação de Serviços

## 🔍 Visão Geral

A **Plataforma de Solicitação de Serviços** é uma solução unificada para gerenciar e centralizar pedidos de três tipos distintos de serviços internos:

- **Automção**: Criação de aplicativos, automação de processos e desenvolvimento de soluções tecnológicas.
- **Marcenaria**: Produção, reforma e manutenção de móveis de madeira.
- **Serralheria**: Fabricação e manutenção de estruturas metálicas, componentes personalizados, entre outros.

O principal objetivo da plataforma é otimizar o fluxo de solicitações, permitindo maior rastreabilidade, priorização e controle de execução de tarefas.

---

## Fluxo Funcional

```mermaid
flowchart TD
    A[Usuário cria solicitação] --> B[Justificativa e prioridade temporária]
    B --> C[Avaliação do gerente (define prioridade real)]
    C --> D[Equipe define prazo estimado de execução]
    D --> E[Atribuição a colaborador(es)]
    E --> F[Status do chamado]
    F --> G[Controle de tempo e pausas]
    G --> H[Notificação por e-mail]
```

---

## Componentes e Regras de Negócio

### 1. Criação da Solicitação

- Formulário preenchido pelo solicitante contendo:
  - Descrição da demanda
  - Justificativa (impacto e ganhos esperados)
  - Prioridade temporária (livre)

### 2. Avaliação Gerencial

- O gerente analisa a solicitação e define a prioridade real:
  - `Baixa`
  - `Média`
  - `Alta`

### 3. Estimativa de Execução

- A equipe do setor define o tempo de execução com base no esforço técnico, considerando que a tarefa começa imediatamente.

### 4. Atribuição da Equipe

- Um ou mais colaboradores são vinculados à execução da solicitação.

### 5. Status do Chamado

Cada chamado pode assumir um dos seguintes status:

- `Solicitado`
- `Em atendimento`
- `Pausado`
- `Parado`
- `Concluído`
- `Reprovado`

Cada mudança de status exige motivação, especialmente nos casos de pausa, parada ou reprovação.

### 6. Controle de Tempo

- O tempo é contabilizado a partir do momento em que o chamado entra em atendimento.
- Pausas e paradas devem ser justificadas por quem executa.
- Esses dados são armazenados para análise futura de desempenho e planejamento.

### 7. Sistema de Notificações

- O solicitante recebe e-mails automáticos sempre que:
  - A solicitação é aprovada ou reprovada
  - O status é alterado
  - A conclusão é registrada

---

## Futuras Melhorias

- Implementar visualização Kanban por setor
- Adicionar "comentários internos" nos chamados
- Incluir métrica de tempo real de execução vs estimativa
- Integrar com API externa de autenticação para login corporativo
- Criar painel analítico com médias de atendimento por setor/status

---

## Conclusão

Esta plataforma visa não apenas centralizar as demandas, mas transformar o gerenciamento de solicitações em um processo transparente, rastreável e baseado em dados. Ela pode ser adaptada e expandida conforme a evolução das necessidades da empresa e maturidade dos setores operacionais.
