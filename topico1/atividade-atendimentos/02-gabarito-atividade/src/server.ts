/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP  [SOLUCAO DO ENCONTRO 2]
 * ============================================================
 * Um arquivo so, sem camadas, sem arquitetura. E proposital.
 * O objetivo desta semana e enxergar o HTTP acontecendo.
 * A separacao em camadas chega na Semana 03.
 */
import express from "express";
import { db } from "./database";

const app = express();
const PORT = 3000;

/* ------------------------------------------------------------
   MIDDLEWARES - rodam antes das rotas, na ordem em que aparecem
   ------------------------------------------------------------ */

// Sem esta linha, req.body vem `undefined`.
app.use(express.json());

// Frontend e API na MESMA origem -> nao precisamos falar de CORS ainda.
app.use(express.static("public"));

/* ------------------------------------------------------------
   TIPOS E TRADUCAO ENTRE BANCO E JSON
   ------------------------------------------------------------
   O banco fala snake_case e nao tem boolean.
   A API fala camelCase e tem boolean.
   Alguem precisa traduzir. Por enquanto, esta funcao.
   ------------------------------------------------------------ */
type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  active: number;
};

function toPatientJson(row: PatientRow) {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    active: row.active === 1,
  };
}

/* ------------------------------------------------------------
   VALIDACAO
   ------------------------------------------------------------
   Validar e responder a uma pergunta: "da para confiar nisso?"
   Devolvemos a PRIMEIRA falha encontrada, com mensagem util.
   Mensagem util e a que diz o que fazer, nao so o que houve.
   ------------------------------------------------------------ */
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

/* ------------------------------------------------------------
   ROTAS
   ------------------------------------------------------------ */

/** Saude do servico. */
app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

/** Lista todos os pacientes. */
app.get("/api/patients", (_request, response) => {
  const rows = db
    .prepare("SELECT id, name, birth_date, national_id, active FROM patients ORDER BY name")
    .all() as PatientRow[];

  // 200 e o padrao do Express quando ha corpo. Explicitamos para
  // deixar o contrato visivel no codigo.
  response.status(200).json(rows.map(toPatientJson));
});

/** Busca um paciente pelo id. */
app.get("/api/patients/:id", (request, response) => {
  const row = db
    .prepare("SELECT id, name, birth_date, national_id, active FROM patients WHERE id = ?")
    .get(request.params.id) as PatientRow | undefined;

  // "Nao encontrei" nao e erro do servidor: e 404, nao 500.
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
    // 400 = a culpa e do pedido. O cliente precisa corrigir e tentar de novo.
    response.status(400).json({ error: problem });
    return;
  }

  const { name, birthDate, nationalId } = request.body;

  // O CNS e unico no banco. Se deixarmos o INSERT estourar, o
  // Express devolve 500 - e 500 seria MENTIRA: o servidor esta
  // otimo, quem mandou dado repetido foi o cliente.
  // 409 Conflict diz exatamente isso: "seu pedido faz sentido,
  // mas conflita com o estado atual do recurso".
  const duplicate = db
    .prepare("SELECT id FROM patients WHERE national_id = ?")
    .get(nationalId.trim());

  if (duplicate) {
    response.status(409).json({ error: "Ja existe um paciente com este CNS." });
    return;
  }

  // Os `?` sao a diferenca entre dado e codigo.
  // O driver envia o SQL e os valores por caminhos separados:
  // o conteudo de `name` NUNCA sera interpretado como comando.
  const result = db
    .prepare(
      `INSERT INTO patients (name, birth_date, national_id, active)
       VALUES (?, ?, ?, 1)`
    )
    .run(name.trim(), birthDate, nationalId.trim());

  const created = db
    .prepare("SELECT id, name, birth_date, national_id, active FROM patients WHERE id = ?")
    .get(result.lastInsertRowid) as PatientRow;

  // 201 = criado. E devolvemos o recurso criado, com o id que o
  // banco gerou: o cliente nao tem como adivinhar esse numero.
  response.status(201).json(toPatientJson(created));
});

/* ============================================================
   ENCOUNTERS - atendimentos de um paciente
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

/** O paciente existe? Consulta usada por duas rotas. */
function patientExists(id: string): boolean {
  return db.prepare("SELECT 1 FROM patients WHERE id = ?").get(id) !== undefined;
}

/** Lista os atendimentos de um paciente, do mais recente para o mais antigo. */
app.get("/api/patients/:id/encounters", (request, response) => {
  // Se o paciente nao existe, a resposta certa e 404 - e nao uma
  // lista vazia. Lista vazia significa "existe e nao tem nada".
  // Sao fatos diferentes e o cliente precisa distingui-los.
  if (!patientExists(request.params.id)) {
    response.status(404).json({ error: "Paciente nao encontrado." });
    return;
  }

  // Ordenamos no SQL, nao em JavaScript. O banco ja sabe ordenar,
  // tem indice para isso, e assim o dado chega pronto na rede.
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

/* ------------------------------------------------------------ */
app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});
