/**
 * ============================================================
 * Testes de ATAQUE da trilha AUTH — eles ligam sozinhos.
 * ------------------------------------------------------------
 * Enquanto POST /api/auth/login responder 404 (trilha AUTH ainda
 * não construída), a suíte inteira é PULADA e o gate segue verde.
 * No momento em que o login nascer, estes testes acordam — e o
 * seu "Done when" da trilha AUTH é: TODOS verdes.
 *
 * Cada teste aqui é um item do OWASP aplicado:
 *   A07 (Identification and Authentication Failures) -> 401s
 *   A01 (Broken Access Control, o nº 1 da lista)     -> 403s
 * ============================================================
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import { startServer, jsonRequest, randomCns } from "./helpers";

let base = "";
let server: Server;
let api: ReturnType<typeof jsonRequest>;
let authPronta = false;

// Credenciais de TESTE (criadas aqui mesmo, via register).
// Nada disso é segredo real — segredo real vive no .env (OP-2).
const suffix = Math.floor(Math.random() * 1e9);
const PROFISSIONAL = {
  name: "Dra. Teste",
  email: `profissional.${suffix}@teste.local`,
  password: "senha-forte-de-teste",
  role: "profissional",
};
const RECEPCAO = {
  name: "Recepção Teste",
  email: `recepcao.${suffix}@teste.local`,
  password: "senha-forte-de-teste",
  role: "recepcao",
};

before(async () => {
  ({ base, server } = await startServer());
  api = jsonRequest(base);
  const probe = await api("/api/auth/login", { method: "POST", body: "{}" });
  authPronta = probe.status !== 404;
});

after(() => server.close());

function quandoAuthExistir(name: string, fn: () => Promise<void>) {
  test(name, { skip: !authPronta ? "trilha AUTH ainda não implementada" : false }, fn);
}

async function login(credentials: { email: string; password: string }): Promise<string> {
  const res = await api("/api/auth/login", { method: "POST", body: JSON.stringify(credentials) });
  assert.equal(res.status, 200, "login de usuário válido deveria responder 200");
  const body = (await res.json()) as { token: string };
  assert.ok(body.token, "resposta do login deve conter { token }");
  return body.token;
}

quandoAuthExistir("setup: register dos dois papéis funciona (201 ou 409 se já existem)", async () => {
  for (const user of [PROFISSIONAL, RECEPCAO]) {
    const res = await api("/api/auth/register", { method: "POST", body: JSON.stringify(user) });
    assert.ok([201, 409].includes(res.status), `register respondeu ${res.status}`);
  }
});

quandoAuthExistir("ATAQUE 1 — sem token: POST encounter -> 401", async () => {
  const res = await api("/api/patients/1/encounters", {
    method: "POST",
    body: JSON.stringify({ startedAt: "2026-09-02T09:00", chiefComplaint: "Sem crachá" }),
  });
  assert.equal(res.status, 401);
});

quandoAuthExistir("ATAQUE 2 — token ADULTERADO: assinatura invalida -> 401", async () => {
  const token = await login(PROFISSIONAL);
  // Trocar 1 caractere do payload quebra a assinatura. É toda a mágica do JWT.
  const [h, p, s] = token.split(".");
  const adulterado = `${h}.${p!.slice(0, -2)}AA.${s}`;
  const res = await api("/api/patients/1/encounters", {
    method: "POST",
    headers: { Authorization: `Bearer ${adulterado}` },
    body: JSON.stringify({ startedAt: "2026-09-02T09:00", chiefComplaint: "Crachá falsificado" }),
  });
  assert.equal(res.status, 401);
});

quandoAuthExistir("ATAQUE 3 — papel errado: recepcao tenta prescrever -> 403 (invariante N2)", async () => {
  const token = await login(RECEPCAO);
  const res = await api("/api/encounters/1/medications", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ medication: "Não deveria", dosage: "passar" }),
  });
  assert.equal(res.status, 403, "401 = não sei quem é; 403 = sei quem é e NÃO PODE. Aqui é 403.");
});

quandoAuthExistir("ATAQUE 4 — recepcao consegue o que a matriz permite: criar paciente -> 201", async () => {
  const token = await login(RECEPCAO);
  const res = await api("/api/patients", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name: "Criado Pela Recepção", birthDate: "1999-09-09", nationalId: randomCns() }),
  });
  assert.equal(res.status, 201, "403 aqui = matriz aplicada com mão pesada demais");
});

quandoAuthExistir("ATAQUE 5 — login com senha errada -> 401 SEM revelar qual campo errou", async () => {
  const res = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: PROFISSIONAL.email, password: "senha-errada" }),
  });
  assert.equal(res.status, 401);
  const body = (await res.json()) as { error: { message: string } };
  assert.ok(
    !/senha|password/i.test(body.error.message) || !/e-?mail|usu[aá]rio/i.test(body.error.message),
    "mensagem não deve dizer se o erro foi no e-mail OU na senha (enumeração de usuários)",
  );
});

quandoAuthExistir("ATAQUE 6 — regra de domínio: profissional B não prescreve no atendimento do profissional A", async () => {
  // Este é o teste da parte NÃO guiada. Middleware de papel deixa
  // passar (os dois são "profissional") — quem barra é o DOMÍNIO.
  const tokenA = await login(PROFISSIONAL);
  const novoEncounter = await api("/api/patients/1/encounters", {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ startedAt: "2026-09-03T08:00", chiefComplaint: "Caso do profissional A" }),
  });
  assert.equal(novoEncounter.status, 201);
  const { id } = (await novoEncounter.json()) as { id: number };

  const B = { name: "Dr. B", email: `profissional.b.${suffix}@teste.local`, password: "senha-forte-de-teste", role: "profissional" };
  await api("/api/auth/register", { method: "POST", body: JSON.stringify(B) });
  const tokenB = await login(B);

  const res = await api(`/api/encounters/${id}/medications`, {
    method: "POST",
    headers: { Authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({ medication: "Prescrição alheia", dosage: "não deve passar" }),
  });
  assert.equal(res.status, 403, "a regra 'só quem registrou prescreve' mora no service, não no middleware");
});
