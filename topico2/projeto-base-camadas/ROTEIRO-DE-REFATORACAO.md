# Roteiro de Refatoração — Tópico 2, Etapa Avançada

Este projeto **já funciona**. Rode `npm install && npm run db:reset && npm run dev`
e confirme antes de tocar em qualquer TODO.

O trabalho das próximas semanas é migrar o código de `src/server.ts` para as
camadas novas, seguindo os **TODOs numerados**, na ordem abaixo. Depois de
cada TODO, rode `requests.http` de novo — a resposta (status, corpo,
headers) precisa continuar **idêntica**.

## Encontro 1 — Arquitetura em Camadas

| TODO | Arquivo | O que fazer |
|---|---|---|
| 1 | `src/routes/patients.routes.ts` | Rotas de Patient (list, getById, create) |
| 2 | `src/controllers/patients.controller.ts` | Controller de Patient |
| 3 | `src/services/patients.service.ts` | Service de Patient (SQL + regra de negócio) |
| 4 | `src/routes/encounters.routes.ts` | Rotas de Encounter |
| 5 | `src/controllers/encounters.controller.ts` | Controller de Encounter |
| 6 | `src/services/encounters.service.ts` | Service de Encounter |
| 7 | `src/server.ts` | Trocar as rotas flat pelos routers novos |

**Critério de pronto:** os endpoints de Patient e Encounter respondem
exatamente igual — mas `server.ts` não tem mais `db.prepare` nem lógica de
negócio, só monta o app e os routers.

## Encontro 2 — Erros, Validação e Upload

| TODO | Arquivo | O que fazer |
|---|---|---|
| 8 | `src/errors/HttpError.ts` | Hierarquia de erros (`BadRequestError`, `NotFoundError`, `ConflictError`, `UnprocessableEntityError`, `PayloadTooLargeError`) |
| 9 | `src/middlewares/errorHandler.ts` | Middleware central de erro |
| 10 | `src/validation/patients.schemas.ts` | Schema Zod de criação de paciente |
| 11 | `src/middlewares/validate.ts` | Middleware genérico de validação |
| 12 | `src/middlewares/upload.ts` | Configuração do multer |
| 13 | rotas/controller/service de `patients` | Endpoint `POST /:id/photo` |
| 14 | `public/js/api.js`, `render.js`, `errors.js` | Preview de foto, `FormData`, `renderApiError` |

**Critério de pronto:** todo erro no projeto passa pelo `errorHandler` (nenhum
`res.status().json({ error })` manual sobrevive fora dele), a criação de
paciente rejeita payload inválido com `400` + `details`, e o upload de foto
aceita `image/jpeg`/`image/png` até 2MB, rejeitando o resto com o status
certo.

## Se travar

- `no such table` → rodou `npm run db:reset`?
- Erro de tipo em `req.params.id` dentro do Service → o Service não deveria
  saber que existe `req` — passe só o `id` como parâmetro.
- `mergeParams` esquecido no router de encounters → `req.params.id` chega
  `undefined` dentro do controller de encounters.
