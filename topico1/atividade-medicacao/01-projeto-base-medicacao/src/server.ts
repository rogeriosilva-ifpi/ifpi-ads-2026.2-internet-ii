/**
 * ============================================================
 * Painel de Medicacao - Servidor HTTP
 * ============================================================
 * Isto e um "Hello World": so a rota de saude e o servidor
 * estatico. As quatro rotas da atividade (listar, criar, obter
 * um, remover) ainda nao existem — sao o que voce vai construir.
 */
import express from "express";
import { db } from "./database";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

// ============================================================
// PASSO 1 — GET /api/medications
//   db.prepare("SELECT ... FROM medication_orders").all()
//   Nao esqueca de traduzir snake_case -> camelCase antes de responder.
// ============================================================

// ============================================================
// PASSO 3 — POST /api/medications
//   valide patientName, medicationName, dosage, route, scheduledAt
//   INSERT parametrizado -> responda 201 com o registro criado
// ============================================================

// ============================================================
// PASSO 4 — GET /api/medications/:id
//   db.prepare("SELECT ... WHERE id = ?").get(id)
//   undefined -> 404
// ============================================================

// ============================================================
// PASSO 5 — DELETE /api/medications/:id
//   db.prepare("DELETE FROM medication_orders WHERE id = ?").run(id)
//   responda 204, sem corpo
// ============================================================

app.listen(PORT, () => {
  console.log(`Painel de Medicacao no ar em http://localhost:${PORT}`);
});
