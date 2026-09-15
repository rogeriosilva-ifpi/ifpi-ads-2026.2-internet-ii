/**
 * Service de Encounter.
 *
 * TODO ARQ-2 — mesmo movimento do ARQ-1: extrair
 * `repositories/encounters.repository.ts` (interface + adapter
 * SQLite) e remover o `import { db }` daqui.
 *
 * TODO AUTH-8 — (parte NÃO guiada) quando `professional_id`
 * existir em encounters, `createEncounter` passa a registrar
 * QUEM registrou — e nasce aqui a regra de domínio da matriz
 * de permissões que middleware nenhum resolve sozinho.
 */
import { db } from "../database";
import { NotFoundError } from "../errors/HttpError";
import { getPatientById } from "./patients.service";
import type { CreateEncounterInput } from "../validation/encounters.schemas";

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

const SELECT = "SELECT id, patient_id, started_at, chief_complaint, notes FROM encounters";

export function listEncountersByPatient(patientId: number) {
  getPatientById(patientId); // 404 se o paciente não existe

  // Ordenamos no SQL: o banco tem índice e o dado chega pronto.
  const rows = db
    .prepare(`${SELECT} WHERE patient_id = ? ORDER BY started_at DESC`)
    .all(patientId) as EncounterRow[];

  return rows.map(toEncounterJson);
}

export function getEncounterById(id: number) {
  const row = db.prepare(`${SELECT} WHERE id = ?`).get(id) as EncounterRow | undefined;
  if (!row) {
    throw new NotFoundError("Atendimento não encontrado.");
  }
  return toEncounterJson(row);
}

export function createEncounter(patientId: number, input: CreateEncounterInput) {
  getPatientById(patientId);

  const result = db
    .prepare(
      `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
       VALUES (?, ?, ?, ?)`,
    )
    .run(patientId, input.startedAt, input.chiefComplaint, input.notes ?? null);

  return getEncounterById(Number(result.lastInsertRowid));
}
