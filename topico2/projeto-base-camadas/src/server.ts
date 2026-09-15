/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP
 * ============================================================
 * Este arquivo AINDA esta como veio da rodada 1 do Topico 2:
 * tudo em um unico arquivo, sem camadas. Ele FUNCIONA -- rode
 * `npm run dev` agora mesmo e confirme.
 *
 * O trabalho desta etapa e mover este codigo para:
 *   src/routes/       (so roteamento)
 *   src/controllers/  (traducao HTTP <-> dominio)
 *   src/services/     (regra de negocio)
 *
 * Siga os TODOs NUMERADOS em routes/, controllers/ e services/
 * primeiro (TODO 1 a TODO 7). So volte a este arquivo no TODO 7,
 * para trocar as rotas abaixo pelos routers novos.
 *
 * NAO APAGUE nada abaixo antes de ter a camada nova funcionando --
 * use este código como a fonte da verdade de "o que o endpoint
 * precisa continuar fazendo".
 * ============================================================
 */
import express from "express";
import { db } from "./db/database.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads")); // fotos de pacientes (a partir do Encontro 2)

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

/* ============================================================
   PATIENTS -- implementacao atual (flat, sem camadas)
   ============================================================ */

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  active: number;
  photo_path: string | null;
};

function toPatientJson(row: PatientRow) {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    active: row.active === 1,
    photoUrl: row.photo_path,
  };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function validatePatientInput(body: any): string | null {
  if (isBlank(body?.name)) {
    return "O campo 'name' e obrigatorio e nao pode ser vazio.";
  }
  if (isBlank(body?.birthDate) || !ISO_DATE.test(body.birthDate)) {
    return "O campo 'birthDate' e obrigatorio e deve estar no formato AAAA-MM-DD.";
  }
  if (isBlank(body?.nationalId)) {
    return "O campo 'nationalId' e obrigatorio.";
  }
  return null;
}

/** Lista todos os pacientes. */
app.get("/api/patients", (_request, response) => {
  const rows = db
    .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients ORDER BY name")
    .all() as PatientRow[];

  response.status(200).json(rows.map(toPatientJson));
});

/** Busca um paciente pelo id. */
app.get("/api/patients/:id", (request, response) => {
  const row = db
    .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
    .get(request.params.id) as PatientRow | undefined;

  if (!row) {
    response.status(404).json({ error: "Paciente nao encontrado." });
    return;
  }

  response.status(200).json(toPatientJson(row));
});

/** Cria um paciente. */
app.post("/api/patients", (request, response) => {
  const problem = validatePatientInput(request.body);

  if (problem) {
    response.status(400).json({ error: problem });
    return;
  }

  const { name, birthDate, nationalId } = request.body;

  // 409 Conflict diz exatamente isso: "seu pedido faz sentido,
  // mas conflita com o estado atual do recurso".
  const duplicate = db
    .prepare("SELECT id FROM patients WHERE national_id = ?")
    .get(nationalId.trim());

  if (duplicate) {
    response.status(409).json({ error: "Ja existe um paciente com este CNS." });
    return;
  }

  const result = db
    .prepare(
      `INSERT INTO patients (name, birth_date, national_id, active)
       VALUES (?, ?, ?, 1)`
    )
    .run(name.trim(), birthDate, nationalId.trim());

  const created = db
    .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
    .get(result.lastInsertRowid) as PatientRow;

  response.status(201).json(toPatientJson(created));
});

/* ============================================================
   ENCOUNTERS -- implementacao atual (flat, sem camadas)
   ============================================================ */

type EncounterRow = {
  id: number;
  patient_id: number;
  started_at: string;
  chief_complaint: string;
  notes: string | null;
};

function toEncounterJson(row: EncounterRow) {
  return {
    id: row.id,
    patientId: row.patient_id,
    startedAt: row.started_at,
    chiefComplaint: row.chief_complaint,
    notes: row.notes,
  };
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function patientExists(id: string): boolean {
  return db.prepare("SELECT 1 FROM patients WHERE id = ?").get(id) !== undefined;
}

/** Lista os atendimentos de um paciente, do mais recente para o mais antigo. */
app.get("/api/patients/:id/encounters", (request, response) => {
  if (!patientExists(request.params.id)) {
    response.status(404).json({ error: "Paciente nao encontrado." });
    return;
  }

  const rows = db
    .prepare(
      `SELECT id, patient_id, started_at, chief_complaint, notes
         FROM encounters
        WHERE patient_id = ?
        ORDER BY started_at DESC`
    )
    .all(request.params.id) as EncounterRow[];

  response.status(200).json(rows.map(toEncounterJson));
});

/** Registra um atendimento. */
app.post("/api/patients/:id/encounters", (request, response) => {
  if (!patientExists(request.params.id)) {
    response.status(404).json({ error: "Paciente nao encontrado." });
    return;
  }

  const { startedAt, chiefComplaint, notes } = request.body ?? {};

  if (isBlank(chiefComplaint)) {
    response.status(400).json({ error: "O campo 'chiefComplaint' e obrigatorio." });
    return;
  }
  if (isBlank(startedAt) || !ISO_DATE_TIME.test(startedAt)) {
    response
      .status(400)
      .json({ error: "O campo 'startedAt' e obrigatorio no formato AAAA-MM-DDTHH:MM." });
    return;
  }

  const result = db
    .prepare(
      `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
       VALUES (?, ?, ?, ?)`
    )
    .run(request.params.id, startedAt, chiefComplaint.trim(), isBlank(notes) ? null : notes.trim());

  const created = db
    .prepare(
      `SELECT id, patient_id, started_at, chief_complaint, notes
         FROM encounters WHERE id = ?`
    )
    .get(result.lastInsertRowid) as EncounterRow;

  response.status(201).json(toEncounterJson(created));
});

/* ============================================================
   TODO 7 (depois de TODO 1-6 prontos em routes/controllers/services)
   ------------------------------------------------------------
   Troque TUDO acima (a partir de "PATIENTS -- implementacao
   atual") por:

     import { patientsRouter } from "./routes/patients.routes.ts";
     import { encountersRouter } from "./routes/encounters.routes.ts";

     app.use("/api/patients", patientsRouter);
     app.use("/api/patients/:id/encounters", encountersRouter);

   Teste com requests.http antes e depois: toda resposta -- status
   code, corpo, headers -- precisa continuar identica.

   ------------------------------------------------------------
   TODO 9 (Encontro 2, depois de errors/ e middlewares/errorHandler.ts prontos)
   ------------------------------------------------------------
   Registre o error handler POR ULTIMO, depois de todas as rotas:

     import { errorHandler } from "./middlewares/errorHandler.ts";
     app.use(errorHandler);
   ============================================================ */

app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});
