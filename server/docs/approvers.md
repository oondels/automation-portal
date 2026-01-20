# Approvers (política e fonte de verdade)

Este projeto usa a tabela `automacao.approvers` como **única fonte de verdade** para:

- Quem pode **aprovar/rejeitar** projetos
- Quem pode **administrar** a lista de aprovadores
- Quem pode receber **notificações** (respeitando as preferências do email)

## Fonte de verdade

- **Tabela**: `automacao.approvers` (entidade `Approver`)
- **Chave estável de identidade**: `matricula`
- **Status**: `active=true` significa que o usuário está habilitado.

## Serviço central

- Serviço: `ApproverPolicyService` (src/services/approver-policy.service.ts)

Responsabilidades:

- `canApproveProjectsByMatricula(matricula)`: aprovar/rejeitar projetos (somente `active=true`)
- `canManageApproversByMatricula(matricula)`: administrar aprovadores (role/permission)

## Middlewares

- `RequireActiveApprover` (src/middlewares/approverPermission.middleware.ts)
  - Usado em rotas de aprovação de projeto.
  - Regra: usuário autenticado + `matricula` presente + aprovador ativo na tabela.

- `ApproverAdminMiddleware` (src/middlewares/approverAdmin.middleware.ts)
  - Usado nas rotas `/approvers/*` para CRUD.
  - Regra: usuário autenticado + `canManageApproversByMatricula`.

## Notificações

A entidade `NotificationEmail` usa `authorizedNotificationsApps` como `string[]` (jsonb).

- Um email só entra na lista de notificação se:
  - `confirmed=true`
  - `authorizedNotificationsApps` inclui o nome do app (ex.: `"automation"`)

## Observações de migração

Se existirem dados antigos em `authorized_notifications_apps` no formato objeto/mapa, é necessário convertê-los para array (`string[]`).
