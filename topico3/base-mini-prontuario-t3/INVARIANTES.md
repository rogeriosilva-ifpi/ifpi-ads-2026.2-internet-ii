# INVARIANTES.md — o que nunca pode quebrar

Anatomia de cada entrada: **invariante** (a regra) · **caminho
seguro** (como fazer certo) · **enforcement** (o que a torna
executável — porque *invariante que não é executável é decoração*).

Escada de enforcement: `advisório (texto) → teste → hook/CI`.
Regra de promoção: violou 1× → reescreva a entrada mais clara;
2× → vire teste; 3× → vire hook.

---

## A1 — Direção de dependência
- **Invariante:** dependências apontam para dentro. Rotas → controllers → services → repositories. Services não conhecem a web (express); só repositories conhecem o driver do banco.
- **Caminho seguro:** precisa de algo de outra camada? Receba pela interface (port), nunca importando a implementação de fora para dentro.
- **Enforcement:** `npm run arch` (dependency-cruiser) — **camada 2 (teste)**, rodando dentro do `gate.sh`. *Estado atual: VERMELHO de propósito — 2 violações plantadas; a trilha ARQ zera.*

## N1 — CNS único
- **Invariante:** dois pacientes jamais compartilham `national_id`. Tentativa de duplicar responde `409`, nunca `500`.
- **Caminho seguro:** a checagem mora no service/repository de Patient (e no `UNIQUE` do banco como última linha de defesa). Honestidade técnica: entre o SELECT e o INSERT existe uma janela de corrida — o `UNIQUE` é quem fecha a porta de verdade.
- **Enforcement:** teste `tests/api.smoke.test.ts` ("CNS duplicado → 409") — **camada 2**, dentro do gate.

## N2 — Prescrição exige papel autorizado
- **Invariante:** `POST /api/encounters/:id/medications` só com papel `profissional` (e a regra fina de domínio da trilha AUTH: só quem registrou o atendimento prescreve nele). `recepcao` recebe `403`; sem token, `401`.
- **Caminho seguro:** o *quem é você* fica no middleware (adapter de entrada); a regra fina fica no service — jamais espalhada em rotas.
- **Enforcement:** hoje **camada 1 (advisório)** — sobe para camada 2 quando a trilha AUTH existir: `tests/auth.attacks.test.ts` liga sozinho e o gate passa a cobrar os 401/403.

## OP1 — Esquema só muda por migration
- **Invariante:** a partir da trilha ORM, nenhuma mudança de esquema fora de `prisma migrate`. `schema.sql` vira histórico; editar o `.db` na mão é corromper a linha do tempo.
- **Caminho seguro:** `npx prisma migrate dev --name descreva-a-mudanca`; migration aplicada nunca é editada — cria-se outra.
- **Enforcement:** **camada 1 (advisório)** + revisão de PR (qualquer diff em `prisma/migrations/` exige aprovação humana explícita — ver AGENTS.md § Do-not).

## OP2 — Segredo nunca encosta no repositório
- **Invariante:** `JWT_SECRET` e afins vivem só no `.env` (gitignorado). Nenhum token, senha ou chave em código, teste, requests.http commitado ou log.
- **Caminho seguro:** `.env.example` documenta as chaves sem os valores; `process.env` é o único acesso.
- **Enforcement:** `gitleaks` no `gate.sh` — **camada 2**, promovível a hook de pre-commit (camada 3) na primeira violação real.
