# Mini-Prontuário T3

Projeto-fio do **Tópico 3 — Arquiteturas em Camadas, ORM e Autenticação**
(TEC.1052 · Programação para Internet II · ADS/IFPI).

Ele chega **funcionando de ponta a ponta** no estado em que o Tópico 2
terminou — camadas Route/Controller/Service, hierarquia de erros,
validação Zod, upload de foto — e já **evoluído** com o recurso de
prescrições (MedicationRequest). O Tópico 3 o transforma três vezes:

| Trilha | O que muda | O que NÃO pode mudar |
|---|---|---|
| **ARQ** | Nasce a camada Repository (ports & adapters); as 2 violações plantadas da Regra da Dependência são corrigidas | O comportamento da API (os testes são a prova) |
| **ORM** | better-sqlite3 sai, Prisma entra — atrás da mesma interface | A interface dos repositories e o comportamento |
| **AUTH** | Identidade (argon2 + JWT), papéis e a matriz de permissões | Tudo que já passava continua passando — e os ataques passam a falhar |

## Suba em 3 comandos

```bash
npm install
npm run db:reset     # cria database/prontuario.db com dados de teste
npm run dev          # http://localhost:3000
```

A interface completa está em `http://localhost:3000` (ela é **fora do
escopo** de todas as tarefas — mas leia o código dela: é a revisão viva
do Tópico 1). Os testes manuais de API estão em `requests.http`.

## Os comandos que importam

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe o servidor com recarga automática |
| `npm run db:reset` | Recria o banco com o seed |
| `npm run check` | Tipos (`tsc --noEmit`) |
| `npm run arch` | Regras de arquitetura (dependency-cruiser) |
| `npm run test` | Testes de API (servidor real, porta efêmera) |
| `npm run gate` | **Tudo acima, na ordem. É o "Done when" de qualquer tarefa.** |

> **O gate chega com UMA luz vermelha — de propósito.**
> `npm run arch` acusa **2 violações plantadas** da Regra da
> Dependência. Encontrá-las é exercício do Encontro 1; corrigi-las é
> parte da trilha ARQ. Todas as outras checagens chegam verdes — e o
> seu trabalho é **mantê-las verdes** enquanto o vermelho vira verde.

## O mapa do território

```
mini-prontuario-t3/
├── AGENTS.md                ← regras do projeto (humanos E agentes leem)
├── CLAUDE.md                ← 2 linhas: aponta para AGENTS + INVARIANTES
├── INVARIANTES.md           ← o que nunca pode quebrar (com enforcement)
├── gate.sh                  ← o portão: tipos + arquitetura + testes + segredos
├── .dependency-cruiser.cjs  ← as regras de camada, executáveis
├── requests.http            ← testes manuais (inclui os ATAQUES da trilha AUTH)
├── database/                ← schema.sql + seed.sql (vira histórico na trilha ORM)
├── prisma/                  ← LEIA-ME da trilha ORM (o schema é tarefa sua)
├── docs/
│   ├── code_review.md       ← roteiro da revisão adversarial
│   └── adr/0000-template.md ← modelo de ADR (nível 3 da atividade)
├── src/
│   ├── app.ts               ← montagem (testável) · server.ts só liga
│   ├── routes/              ← só roteiam        ┐
│   ├── controllers/         ← só traduzem HTTP  │ A Regra da
│   ├── services/            ← decidem           │ Dependência
│   ├── repositories/        ← (trilha ARQ)      ┘ aponta p/ dentro
│   ├── errors/ · middlewares/ · validation/
│   └── database.ts          ← better-sqlite3 (aposentado na trilha ORM)
├── tests/
│   ├── api.smoke.test.ts    ← a definição executável de "sem quebrar"
│   └── auth.attacks.test.ts ← dormem até a trilha AUTH nascer
└── public/                  ← frontend pronto (fora do escopo das tarefas)
```

## As trilhas de TODOs

Cada `TODO` no código diz **o que** fazer e **por quê** — nunca o código
pronto. A ordem importa: **ARQ → ORM → AUTH**.

### Trilha ARQ — Arquitetura (camada Repository)
| TODO | Onde | Tarefa |
|---|---|---|
| ARQ-1 | `services/patients.service.ts` | Interface `PatientsRepository` + adapter SQLite; o SQL sai do service |
| ARQ-2 | `services/encounters.service.ts` | Mesmo movimento para Encounter |
| ARQ-3 | `services/medications.service.ts` | Mesmo movimento para MedicationRequest |
| ARQ-4 e ARQ-5 | *(encontre-as)* | Corrigir as **2 violações plantadas** que o `npm run arch` acusa |
| ARQ-6 | `.dependency-cruiser.cjs` | Promover a régua: criar a regra "só repositories importam o driver" (a regra nasce DEPOIS da camada, senão é só ruído) |

### Trilha ORM — Prisma atrás da interface
O passo a passo mora em **`prisma/LEIA-ME.md`** (ORM-1 a ORM-5:
init → `db pull` → `@map`/`@@map` → repositories Prisma → baseline de
migrations). A partir daí vale o invariante **OP-1**: esquema só muda
por migration.

### Trilha AUTH — identidade e permissão
| TODO | Onde | Tarefa |
|---|---|---|
| AUTH-1 | `errors/HttpError.ts` | `UnauthorizedError` (401) e `ForbiddenError` (403) |
| AUTH-2 | *(migration Prisma)* | Tabela `users` (name, email único, password_hash, role) |
| AUTH-3 | `routes/auth.routes.ts` | `register` · `login` · `me` (+ controller + service) |
| AUTH-4 | `validation/auth.schemas.ts` | Schemas de registro e login |
| AUTH-5 | `middlewares/auth.ts` | `requireAuth` — verificação do JWT |
| AUTH-6/7/8 | *(não guiados)* | A Apresentação de Condução **para antes daqui**. Você tem a matriz de permissões e os testes de ataque — descubra o que falta e onde |

**Matriz de permissões** (o contrato da parte não guiada):

| Ação | admin | profissional | recepcao | sem token |
|---|---|---|---|---|
| Ver pacientes/atendimentos | ✅ | ✅ | ✅ | 401 |
| Criar paciente / foto | ✅ | ✅ | ✅ | 401 |
| Registrar atendimento | ✅ | ✅ | ❌ 403 | 401 |
| Ver prescrições | ✅ | ✅ | ❌ 403 | 401 |
| **Prescrever** | ❌ 403 | ✅ *só no atendimento que registrou* | ❌ 403 | 401 |

> A última linha é o coração da atividade: prescrever não é questão de
> **papel**, é questão de **domínio** — nem admin prescreve, e um
> profissional não prescreve no atendimento de outro. Middleware nenhum
> resolve isso sozinho. (`tests/auth.attacks.test.ts`, ATAQUE 6.)

## Escopo fechado de bibliotecas

`express` · `better-sqlite3` · `zod` · `multer` · `prisma`/`@prisma/client`
· `argon2` · `jsonwebtoken` · `dotenv` — **e nada além disso**, para você
e para qualquer agente que trabalhe aqui (está no `AGENTS.md`).

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `npm run test` falha em tudo | Esqueceu `npm run db:reset` antes |
| Upload responde 500 em vez de 413 | O tradutor do `LIMIT_FILE_SIZE` no errorHandler foi tocado |
| `mergeParams` — `req.params.id` undefined | Router aninhado sem `{ mergeParams: true }` |
| `arch` verde "do nada" | Alguém editou `.dependency-cruiser.cjs` — isso reprova a entrega (AGENTS.md § Do-not) |
| 401 em tudo depois da trilha AUTH | Falta `JWT_SECRET` no `.env` (copie de `.env.example`) |
