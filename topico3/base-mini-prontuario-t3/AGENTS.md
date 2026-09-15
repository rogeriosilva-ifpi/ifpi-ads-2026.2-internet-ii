# AGENTS.md — mini-prontuario-t3

Leia isto antes de qualquer tarefa. Cada linha daqui é paga em
toda mensagem da sessão — por isso o arquivo é curto de propósito.

## Stack
Node 22 · Express 5 · TypeScript strict · better-sqlite3 (sendo
substituído por Prisma na trilha ORM) · Zod 4 · Multer.
Frontend vanilla em `public/` — **fora do escopo de qualquer tarefa**.

## Comandos
- `npm run dev` — sobe em http://localhost:3000
- `npm run db:reset` — recria o SQLite com seed
- `npm run check` — `tsc --noEmit`
- `npm run arch` — dependency-cruiser (regras de camada)
- `npm run test` — testes de API (porta efêmera)
- `npm run gate` — tudo acima na ordem. **É o "Done when" padrão.**
- Teste manual: `requests.http` (extensão REST Client)

## Layout e a Regra da Dependência
- `src/routes/` só roteia → importa apenas controllers/middlewares
- `src/controllers/` traduz HTTP↔domínio → importa apenas services
- `src/services/` decide → **ZERO imports de express e de rotas/controllers/middlewares**
- `src/repositories/` (trilha ARQ) → único lugar que importa `src/database`/Prisma
- `src/errors/`, `src/validation/`, `src/middlewares/` — utilitários de borda
As regras acima são EXECUTÁVEIS: `.dependency-cruiser.cjs`.

## Convenções que divergem do padrão
- Banco fala `snake_case`; API fala `camelCase`. A tradução mora
  no repository/service — formato interno nunca vaza na resposta.
- Todo erro sai por `middlewares/errorHandler.ts` no contrato
  `{ error: { message, statusCode, details } }`. Nenhum
  `res.status().json({ error })` manual fora dele.
- SQL sempre parametrizado (`?`). Concatenação de string em query
  é defeito, não estilo.
- Validação de corpo: Zod via `validate(schema)` na rota — nunca
  dentro do controller.

## Escopo fechado de bibliotecas (vale para você também)
Permitidas nesta etapa: `express`, `better-sqlite3`, `zod`,
`multer`, `prisma`/`@prisma/client`, `argon2`, `jsonwebtoken`,
`dotenv`. **Não instale nada além disso.** Se a solução "precisa"
de outra lib, pare e pergunte ao humano.

## Do-not
- Não tocar em `public/`, `database/schema.sql` (histórico) nem
  em migrations já aplicadas.
- Não editar `gate.sh` ou `.dependency-cruiser.cjs` para "passar".
  Gate desabilitado = entrega reprovada.
- Não criar camadas/abstrações fora das trilhas TODO sem discutir
  (`INVARIANTES.md` explica o porquê).
- Segredos só via `.env` (nunca hardcode, nunca commit).
- Alterações em migration, contrato de API ou auth exigem
  aprovação explícita do humano antes de aplicar.

## Invariantes
Estão em `INVARIANTES.md` — leia antes de tarefas que toquem
CNS, papéis de usuário, migrations ou dependências entre camadas.
