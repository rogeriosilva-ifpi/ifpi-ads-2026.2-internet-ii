/**
 * ============================================================
 * Painel de Medicacao - Servidor HTTP [GABARITO]
 * ============================================================
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

/* ------------------------------------------------------------
   Traducao entre banco (snake_case) e API (camelCase)
   ------------------------------------------------------------ */
type MedicationRow = {
  id: number;
  patient_name: string;
  medication_name: string;
  dosage: string;
  route: string;
  scheduled_at: string;
  notes: string | null;
};

function toMedicationJson(row: MedicationRow) {
  return {
    id: row.id,
    patientName: row.patient_name,
    medicationName: row.medication_name,
    dosage: row.dosage,
    route: row.route,
    scheduledAt: row.scheduled_at,
    notes: row.notes,
  };
}

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function validateMedicationInput(body: any): string | null {
  if (isBlank(body?.patientName)) return "O campo 'patientName' e obrigatorio.";
  if (isBlank(body?.medicationName)) return "O campo 'medicationName' e obrigatorio.";
  if (isBlank(body?.dosage)) return "O campo 'dosage' e obrigatorio.";
  if (isBlank(body?.route)) return "O campo 'route' e obrigatorio.";
  if (isBlank(body?.scheduledAt) || !ISO_DATE_TIME.test(body.scheduledAt)) {
    return "O campo 'scheduledAt' deve estar no formato AAAA-MM-DDTHH:MM.";
  }
  return null;
}

/* ------------------------------------------------------------
   PASSO 1 — Listar
   ------------------------------------------------------------ */
app.get("/api/medications", (_request, response) => {
  const rows = db
    .prepare(
      `SELECT id, patient_name, medication_name, dosage, route, scheduled_at, notes
         FROM medication_orders
        ORDER BY scheduled_at ASC`
    )
    .all() as MedicationRow[];

  response.status(200).json(rows.map(toMedicationJson));
});

/* ------------------------------------------------------------
   PASSO 3 — Criar
   ------------------------------------------------------------ */
app.post("/api/medications", (request, response) => {
  const problem = validateMedicationInput(request.body);
  if (problem) {
    response.status(400).json({ error: problem });
    return;
  }

  const { patientName, medicationName, dosage, route, scheduledAt, notes } = request.body;

  const result = db
    .prepare(
      `INSERT INTO medication_orders
         (patient_name, medication_name, dosage, route, scheduled_at, notes)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(
      patientName.trim(),
      medicationName.trim(),
      dosage.trim(),
      route.trim(),
      scheduledAt,
      isBlank(notes) ? null : notes.trim()
    );

  const created = db
    .prepare(
      `SELECT id, patient_name, medication_name, dosage, route, scheduled_at, notes
         FROM medication_orders WHERE id = ?`
    )
    .get(result.lastInsertRowid) as MedicationRow;

  response.status(201).json(toMedicationJson(created));
});

/* ------------------------------------------------------------
   PASSO 4 — Obter um
   ------------------------------------------------------------ */
app.get("/api/medications/:id", (request, response) => {
  const row = db
    .prepare(
      `SELECT id, patient_name, medication_name, dosage, route, scheduled_at, notes
         FROM medication_orders WHERE id = ?`
    )
    .get(request.params.id) as MedicationRow | undefined;

  if (!row) {
    response.status(404).json({ error: "Prescricao nao encontrada." });
    return;
  }

  response.status(200).json(toMedicationJson(row));
});

/* ------------------------------------------------------------
   PASSO 5 — Remover
   ------------------------------------------------------------ */
app.delete("/api/medications/:id", (request, response) => {
  const existing = db
    .prepare("SELECT id FROM medication_orders WHERE id = ?")
    .get(request.params.id);

  if (!existing) {
    response.status(404).json({ error: "Prescricao nao encontrada." });
    return;
  }

  db.prepare("DELETE FROM medication_orders WHERE id = ?").run(request.params.id);

  response.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Painel de Medicacao no ar em http://localhost:${PORT}`);
});
