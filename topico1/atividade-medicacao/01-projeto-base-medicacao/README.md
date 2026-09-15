# Painel de Medicação

Atividade de laboratório — 90 minutos, em dupla, com apoio de IA em **modo chat apenas**.

## Antes de começar

```bash
node -v          # precisa ser 22 ou maior
npm install
npm run db:reset # cria database/prontuario.db com 3 prescrições fictícias
npm run dev      # sobe em http://localhost:3000
```

Abra <http://localhost:3000>. Você deve ver o formulário e a lista **vazia** — isso é esperado, a API de prescrições ainda não existe.

Teste também <http://localhost:3000/api/health> — deve responder `{"status":"ok"}`.

## O que já vem pronto

- `database/schema.sql`, `database/seed.sql`, `src/database.ts` — banco pronto, não mexa aqui
- `public/index.html`, `public/css/*` — estrutura visual pronta
- `src/server.ts` — só a rota de saúde
- `public/js/*.js` — esqueletos com `PASSO N` marcando onde você escreve

## O que você vai construir

Siga os slides da atividade. Cada `PASSO N` no código corresponde a um passo do roteiro.

| Passo | Onde |
|---|---|
| 1 — Listar (backend) | `src/server.ts` |
| 2 — Listar (frontend) | `public/js/api.js`, `state.js`, `render.js`, `app.js` |
| 3 — Criar | `src/server.ts` + `public/js/*` |
| 4 — Obter um | `src/server.ts` + `public/js/*` |
| 5 — Remover | `src/server.ts` + `public/js/*` |

## Regra de escopo

Nenhuma biblioteca além de `express`, `better-sqlite3`, `tsx`, `typescript` e Bootstrap por CDN — vale para você e para a IA.

## IA nesta atividade

**Chat apenas** (ChatGPT, Gemini, Claude). Nada de modo agente, Copilot autônomo, Cursor Agent ou "vibe coding". Você lê, digita e entende cada linha antes de seguir.
