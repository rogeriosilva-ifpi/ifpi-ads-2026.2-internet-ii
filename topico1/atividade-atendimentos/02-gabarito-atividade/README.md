# Mini-Prontuário

Projeto-fio da **Semana 01** de Programação para Internet II (TEC.1052) — IFPI, Campus Teresina Central.

Um prontuário eletrônico deliberadamente pequeno: **pacientes** e, ao final da semana, **atendimentos**. O vocabulário (`Patient`, `Encounter`) é inspirado no padrão HL7 FHIR — não vamos implementar FHIR, apenas nomear como o mercado nomeia.

---

## Antes da primeira aula

```bash
node -v          # precisa ser 22 ou maior
npm install
npm run db:reset # cria database/prontuario.db com 8 pacientes fictícios
npm run dev      # sobe em http://localhost:3000
```

Abra <http://localhost:3000>. Você deve ver o cabeçalho do Mini-Prontuário, o campo de busca e **uma lista vazia** — isso é esperado: as lacunas de código ainda não foram preenchidas.

Teste também <http://localhost:3000/api/health> — deve responder `{"status":"ok"}`.

### Extensões recomendadas do VS Code

| Extensão | Para quê |
|---|---|
| REST Client (`humao.rest-client`) | Executar o `requests.http` sem sair do editor |
| SQLite Viewer (`qwtel.sqlite-viewer`) | Abrir `database/prontuario.db` e ver as tabelas |
| Error Lens (`usernamehw.errorlens`) | Ver o erro do TypeScript na própria linha |

---

## Mapa do projeto

```
mini-prontuario/
├── database/
│   ├── schema.sql        estrutura das tabelas
│   ├── seed.sql          dados fictícios
│   └── prontuario.db     gerado por `npm run db:reset` (não versionado)
├── public/               tudo que o navegador recebe
│   ├── index.html        estrutura da página
│   ├── css/
│   │   ├── tokens.css    design tokens — as decisões de design com nome
│   │   ├── base.css      reset, tipografia, esqueleto
│   │   └── components.css componentes de domínio em BEM
│   ├── js/
│   │   ├── api.js        ÚNICO arquivo que fala com a rede
│   │   ├── state.js      o estado e as ações — não conhece o DOM
│   │   ├── render.js     desenha o estado — não decide nada
│   │   └── app.js        orquestra: evento → ação → estado → render
│   └── mock/patients.json  usado no Encontro 1
├── scripts/reset-db.ts
├── src/
│   ├── database.ts       conexão SQLite
│   └── server.ts         rotas HTTP (um arquivo só, sem camadas — por enquanto)
└── requests.http         casos de teste da API
```

## O fluxo do frontend

```
  usuário digita
        │
        ▼
  app.js  ──chama──►  state.js       (a ação muda o estado)
                          │
                          │ notify()
                          ▼
                      render.js      (a tela é redesenhada)
                          │
                          ▼
                         DOM
```

**O estado muda. A tela é consequência.**

## As lacunas

Procure por `TODO` no projeto. Elas estão numeradas na ordem em que serão resolvidas:

| Marca | Arquivo | Quando |
|---|---|---|
| `TODO STATE-1` | `public/js/state.js` | Encontro 1 — Prática 1 |
| `TODO RENDER-1` | `public/js/render.js` | Encontro 1 — Prática 1 |
| `TODO STATE-2` | `public/js/state.js` | Encontro 1 — Prática 2 |
| `TODO CSS-1` e `CSS-2` | `public/css/components.css` | Encontro 1 — Prática 3 |
| `TODO 1` | `src/server.ts` | Encontro 2 — Prática 1 |
| `TODO 2` / `TODO API-1` | `src/server.ts`, `public/js/api.js` | Encontro 2 — Prática 2 |
| `TODO 3` | `src/server.ts` | Encontro 2 — Prática 3 |
| `TODO ATIVIDADE 1` | `database/schema.sql` | Atividade extraclasse |

## Regra de escopo da semana

Nenhuma biblioteca além destas: `express`, `better-sqlite3`, `tsx`, `typescript` e o Bootstrap por CDN.

Isso vale para você **e para a IA**. Se o assistente sugerir Prisma, Zod, React, `body-parser`, `dotenv` ou `cors`, ele respondeu a uma pergunta que não é a nossa.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| `req.body` é `undefined` | Falta `app.use(express.json())`, ou o cliente não mandou `Content-Type: application/json` |
| `SQLITE_ERROR: no such table` | Rode `npm run db:reset` |
| `npm install` falha em `better-sqlite3` | Node desatualizado ou faltam ferramentas de build. Veja a seção de plano B no guia do professor |
| A página carrega mas a lista fica vazia | Esperado antes de resolver `TODO RENDER-1` |
| `Cannot use import statement outside a module` | Faltou `type="module"` na tag `<script>` |
