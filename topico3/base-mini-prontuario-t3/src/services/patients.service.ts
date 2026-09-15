/**
 * ============================================================
 * Service de Patient — a camada que DECIDE.
 * ------------------------------------------------------------
 * Aqui moram: regra de negócio, acesso a dados e a tradução
 * snake_case (banco) -> camelCase (API). Nada de req/res.
 *
 * TODO ARQ-1 — Extrair o Repository de Patient
 * ------------------------------------------------------------
 * Este service DECIDE e também BUSCA — duas responsabilidades.
 * Sua tarefa na trilha ARQ:
 *   1. Criar `repositories/patients.repository.ts` com a
 *      INTERFACE `PatientsRepository` (o "port": findAll,
 *      findById, findByNationalId, create, updatePhoto) e a
 *      implementação `SqlitePatientsRepository` (o "adapter"),
 *      levando TODO o SQL deste arquivo para lá.
 *   2. Este service passa a receber o repository e a conhecer
 *      apenas a interface. O `import { db }` abaixo DESAPARECE.
 * Prova de pronto: `npm run gate` verde E, fechando a trilha,
 * o TODO ARQ-6 (.dependency-cruiser.cjs): a regra que proíbe
 * services de importarem `database` passa a existir — a régua
 * sobe a escada de enforcement junto com o código.
 * ============================================================
 */
import { db } from "../database";
import { ConflictError, NotFoundError } from "../errors/HttpError";
import type { CreatePatientInput } from "../validation/patients.schemas";

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  photo_url: string | null;
  active: number;
};

/** Tradução banco -> API. O formato interno NUNCA vaza na resposta. */
function toPatientJson(row: PatientRow) {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    photoUrl: row.photo_url,
    active: row.active === 1,
  };
}

const SELECT = "SELECT id, name, birth_date, national_id, photo_url, active FROM patients";

export function listPatients() {
  const rows = db.prepare(`${SELECT} ORDER BY name`).all() as PatientRow[];
  return rows.map(toPatientJson);
}

export function getPatientById(id: number) {
  const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as PatientRow | undefined;

  if (!row) {
    // "Não encontrei" não é problema do servidor: é 404, não 500.
    throw new NotFoundError("Paciente não encontrado.");
  }
  return toPatientJson(row);
}

export function createPatient(input: CreatePatientInput) {
  // Invariante N1: CNS único. Deixar o INSERT estourar viraria um
  // 500 mentiroso — o servidor está ótimo; o dado é que repetiu.
  const duplicate = db
    .prepare("SELECT id FROM patients WHERE national_id = ?")
    .get(input.nationalId);

  if (duplicate) {
    throw new ConflictError("Já existe um paciente com este CNS.");
  }

  // Os `?` são a diferença entre dado e código: o conteúdo de
  // `name` JAMAIS será interpretado como comando SQL.
  const result = db
    .prepare(
      `INSERT INTO patients (name, birth_date, national_id, active)
       VALUES (?, ?, ?, 1)`,
    )
    .run(input.name, input.birthDate, input.nationalId);

  return getPatientById(Number(result.lastInsertRowid));
}

export function setPatientPhoto(id: number, photoUrl: string) {
  getPatientById(id); // garante o 404 antes de gravar
  db.prepare("UPDATE patients SET photo_url = ? WHERE id = ?").run(photoUrl, id);
  return getPatientById(id);
}
