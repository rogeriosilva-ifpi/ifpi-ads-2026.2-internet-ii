/**
 * Service de Encounter -- regra de negocio pura, agora lancando
 * HttpError em vez de devolver um resultado discriminado.
 */
import { db } from "../db/database.ts";
import { BadRequestError, NotFoundError } from "../errors/HttpError.ts";

type EncounterRow = {
  id: number;
  patient_id: number;
  started_at: string;
  chief_complaint: string;
  notes: string | null;
};

type EncounterJson = {
  id: number;
  patientId: number;
  startedAt: string;
  chiefComplaint: string;
  notes: string | null;
};

function toEncounterJson(row: EncounterRow): EncounterJson {
  return {
    id: row.id,
    patientId: row.patient_id,
    startedAt: row.started_at,
    chiefComplaint: row.chief_complaint,
    notes: row.notes,
  };
}

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

function isBlank(value: unknown): boolean {
  return typeof value !== "string" || value.trim() === "";
}

function assertPatientExists(id: string) {
  const exists = db.prepare("SELECT 1 FROM patients WHERE id = ?").get(id) !== undefined;
  if (!exists) throw new NotFoundError("Paciente nao encontrado.");
}

export const encountersService = {
  list(patientId: string): EncounterJson[] {
    assertPatientExists(patientId);

    const rows = db
      .prepare(
        `SELECT id, patient_id, started_at, chief_complaint, notes
           FROM encounters
          WHERE patient_id = ?
          ORDER BY started_at DESC`
      )
      .all(patientId) as EncounterRow[];

    return rows.map(toEncounterJson);
  },

  create(patientId: string, data: any): EncounterJson {
    assertPatientExists(patientId);

    if (isBlank(data?.chiefComplaint)) {
      throw new BadRequestError("O campo 'chiefComplaint' e obrigatorio.");
    }
    if (isBlank(data?.startedAt) || !ISO_DATE_TIME.test(data.startedAt)) {
      throw new BadRequestError("O campo 'startedAt' e obrigatorio no formato AAAA-MM-DDTHH:MM.");
    }

    const result = db
      .prepare(
        `INSERT INTO encounters (patient_id, started_at, chief_complaint, notes)
         VALUES (?, ?, ?, ?)`
      )
      .run(patientId, data.startedAt, data.chiefComplaint.trim(), isBlank(data.notes) ? null : data.notes.trim());

    const created = db
      .prepare(
        `SELECT id, patient_id, started_at, chief_complaint, notes
           FROM encounters WHERE id = ?`
      )
      .get(result.lastInsertRowid) as EncounterRow;

    return toEncounterJson(created);
  },
};
