# Automation Portal – Server

API em Node.js/TypeScript para gestão de projetos/solicitações das equipes (Automação, Marcenaria, Serralheria). Inclui autenticação via JWT (cookie), validação com Joi, WebSockets para notificações e persistência em PostgreSQL usando TypeORM.

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Variáveis de Ambiente
Crie um arquivo `.env` na raiz deste diretório (em dev, o loader usa `.env`):

```
NODE_ENV=development
PORT=3001

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=mydb

JWT_SECRET=uma_chave_segura
```

Em desenvolvimento, o TypeORM roda com `synchronize: true` (gera/atualiza as tabelas). Em produção, use migrações.

## Instalação
```
npm install
```

## Executando em desenvolvimento
```
npm run dev
```
- Health check: `GET /` retorna `Automation Service is running!`
- API base: `http://localhost:3001/api/projects`

## Endpoints principais
- `GET /api/projects/` — Lista projetos com filtros e paginação.
- `POST /api/projects/` — Cria projeto (requer JWT em cookie `token`).
- `PATCH /api/projects/:id/approval` — Aprova/Reprova + define urgência (permissão).
- `PATCH /api/projects/:id/estimated-time` — Define tempo estimado (permissão).
- `PUT /api/projects/:id/attend/:service` — Inicia atendimento (automation|carpentry|metalwork).
- `PUT /api/projects/:id/pause/:service` — Pausa com motivo.
- `PUT /api/projects/:id/resume/:service` — Retoma atendimento.

## Autenticação
- JWT é lido do cookie `token`.
- Payload esperado (ex.): `{ id, matricula, funcao, usuario }`.

## WebSockets
- Servidor WS embutido no mesmo HTTP server.
- Mantém clientes vivos com ping/pong; broadcast global habilitado.
- Eventos emitidos automaticamente ao registrar timeline de projetos (`type: "project.timeline"`).

### Payload de evento
```
{
  "type": "project.timeline",
  "data": {
    "id": "<uuid do timeline>",
    "projectId": "<uuid do projeto>",
    "user": { "matricula": 123, "usuario": "JOAO.SILVA", "nome": "João Silva" },
    "eventType": "criado|aprovado|tempo_estimado_atualizado|atendido|pausado|retomado",
    "eventDescription": "Texto em PT-BR explicando o evento",
    "oldStatus": "requested|approved|in_progress|paused|completed|rejected|null",
    "newStatus": "requested|approved|in_progress|paused|completed|rejected",
    "payload": { "...": "dados adicionais do evento" },
    "createdAt": "2024-07-21T12:34:56.000Z"
  }
}
```

### Tipos de eventos (PT-BR)
- `criado` — projeto foi criado.
- `aprovado` — status atualizado para aprovado/reprovado (inclui urgência).
- `tempo_estimado_atualizado` — mudança do tempo estimado.
- `atendido` — atendimento iniciado por um colaborador.
- `pausado` — atendimento pausado (inclui motivo).
- `retomado` — atendimento retomado.

## Estrutura
- `src/index.ts` — bootstrap do servidor e WebSocket.
- `src/routes` — rotas Express.
- `src/controllers` — orquestra serviços e respostas.
- `src/services` — regras de negócio (TypeORM repositories).
- `src/models` — entidades TypeORM (`Project`, `User`, `Team`).
- `src/dtos` — validações Joi.
- `src/middlewares` — auth, permissões e validação.

## Desenvolvimento
- TypeScript configurado com `emitDecoratorMetadata` e `experimentalDecorators`.
- Import do `reflect-metadata` configurado em `src/index.ts`.

## Observações/TODOs
- DTO de criação de projeto adicionado e já aplicado na rota `POST /api/projects`.
- Ajustar regras de permissão conforme papéis/usuários reais.
- Considerar migrações em produção (`synchronize: false`).
