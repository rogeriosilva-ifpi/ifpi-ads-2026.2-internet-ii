/**
 * ============================================================
 * Testes de fumaça da API — o coração do gate.
 * ------------------------------------------------------------
 * "Refatorar sem quebrar" só é verificável se o comportamento
 * estiver escrito em algum lugar que uma máquina avalia. É aqui.
 * Estes testes NÃO podem mudar durante as trilhas ARQ e ORM:
 * eles são a definição executável de "o mesmo comportamento".
 *
 * Pré-condição: `npm run db:reset` (o gate não reseta por você
 * de propósito — saber o estado do seu banco é parte do ofício).
 * ============================================================
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import type { Server } from "node:http";
import { startServer, jsonRequest, randomCns } from "./helpers";

let base = "";
let server: Server;
let api: ReturnType<typeof jsonRequest>;

before(async () => {
  ({ base, server } = await startServer());
  api = jsonRequest(base);
});

after(() => server.close());

test("GET /api/health responde 200 ok", async () => {
  const res = await api("/api/health");
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { status: "ok" });
});

test("GET /api/patients devolve lista em camelCase (formato do banco não vaza)", async () => {
  const res = await api("/api/patients");
  assert.equal(res.status, 200);
  const list = (await res.json()) as Record<string, unknown>[];
  assert.ok(list.length >= 1, "seed deveria ter pacientes — rode npm run db:reset");
  const first = list[0]!;
  assert.ok("birthDate" in first && "nationalId" in first);
  assert.ok(!("birth_date" in first), "snake_case vazou na resposta");
  assert.equal(typeof first.active, "boolean", "active deve ser boolean, não 0/1");
});

test("GET /api/patients/:id inexistente -> 404 no contrato de erro", async () => {
  const res = await api("/api/patients/999999");
  assert.equal(res.status, 404);
  const body = (await res.json()) as { error: { statusCode: number; message: string } };
  assert.equal(body.error.statusCode, 404);
});

test("POST /api/patients válido -> 201 com id gerado", async () => {
  const res = await api("/api/patients", {
    method: "POST",
    body: JSON.stringify({ name: "Paciente Teste", birthDate: "1990-01-01", nationalId: randomCns() }),
  });
  assert.equal(res.status, 201);
  const created = (await res.json()) as { id: number; active: boolean };
  assert.ok(created.id > 0);
  assert.equal(created.active, true);
});

test("POST /api/patients inválido -> 400 com details por campo (Zod)", async () => {
  const res = await api("/api/patients", {
    method: "POST",
    body: JSON.stringify({ name: "   ", birthDate: "12/04/1990" }),
  });
  assert.equal(res.status, 400);
  const body = (await res.json()) as { error: { details: { field: string }[] } };
  const fields = body.error.details.map((d) => d.field);
  assert.ok(fields.includes("name"));
  assert.ok(fields.includes("birthDate"));
  assert.ok(fields.includes("nationalId"));
});

test("POST /api/patients com CNS duplicado -> 409 (invariante N1)", async () => {
  const cns = randomCns();
  const payload = { name: "Duplicado Um", birthDate: "1980-01-01", nationalId: cns };
  const first = await api("/api/patients", { method: "POST", body: JSON.stringify(payload) });
  assert.equal(first.status, 201);
  const second = await api("/api/patients", { method: "POST", body: JSON.stringify(payload) });
  assert.equal(second.status, 409);
});

test("Encounters: lista do seed e criação -> 200/201; paciente fantasma -> 404", async () => {
  const list = await api("/api/patients/1/encounters");
  assert.equal(list.status, 200);
  assert.ok(((await list.json()) as unknown[]).length >= 1);

  const created = await api("/api/patients/1/encounters", {
    method: "POST",
    body: JSON.stringify({ startedAt: "2026-09-01T10:00", chiefComplaint: "Teste automatizado" }),
  });
  assert.equal(created.status, 201);

  const ghost = await api("/api/patients/999999/encounters");
  assert.equal(ghost.status, 404);
});

test("Medications: lista e criação aninhadas no encounter -> 200/201; encounter fantasma -> 404", async () => {
  const list = await api("/api/encounters/1/medications");
  assert.equal(list.status, 200);

  const created = await api("/api/encounters/1/medications", {
    method: "POST",
    body: JSON.stringify({ medication: "Paracetamol 750mg", dosage: "1 comprimido de 8/8h por 2 dias" }),
  });
  assert.equal(created.status, 201);
  const med = (await created.json()) as { encounterId: number };
  assert.equal(med.encounterId, 1);

  const ghost = await api("/api/encounters/999999/medications");
  assert.equal(ghost.status, 404);

  const invalid = await api("/api/encounters/1/medications", {
    method: "POST",
    body: JSON.stringify({ medication: "" }),
  });
  assert.equal(invalid.status, 400);
});

test("Upload: PNG pequeno -> 200 com photoUrl; sem arquivo -> 422", async () => {
  // Um PNG de 1x1 pixel, gerado em memória — teste sem depender de arquivo externo.
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    "base64",
  );
  const form = new FormData();
  form.append("photo", new Blob([png], { type: "image/png" }), "pixel.png");

  const ok = await fetch(`${base}/api/patients/2/photo`, { method: "POST", body: form });
  assert.equal(ok.status, 200);
  const patient = (await ok.json()) as { photoUrl: string };
  assert.match(patient.photoUrl, /^\/uploads\/.+\.png$/);
  assert.ok(!patient.photoUrl.includes("pixel"), "nome do cliente não pode ser reaproveitado");

  const empty = await fetch(`${base}/api/patients/2/photo`, { method: "POST", body: new FormData() });
  assert.equal(empty.status, 422);
});

test("Upload: mimetype proibido -> 422 mesmo com extensão .jpg (filtro por conteúdo declarado)", async () => {
  const form = new FormData();
  form.append("photo", new Blob(["não sou uma imagem"], { type: "text/plain" }), "disfarce.jpg");
  const res = await fetch(`${base}/api/patients/2/photo`, { method: "POST", body: form });
  assert.equal(res.status, 422);
});
