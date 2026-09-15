/**
 * Service de MedicationRequest (a prescrição de um atendimento).
 *
 * TODO ARQ-3 — extrair `repositories/medications.repository.ts`
 * (interface + adapter SQLite), como nos ARQ-1 e ARQ-2.
 */
import type { Request } from "express";
import { db } from "../database";
import { getEncounterById } from "./encounters.service";
import type { CreateMedicationInput } from "../validation/medications.schemas";

type MedicationRow = {
  id: number;
  encounter_id: number;
  medication: string;
  dosage: string;
};

function toMedicationJson(row: MedicationRow) {
  return {
    id: row.id,
    encounterId: row.encounter_id,
    medication: row.medication,
    dosage: row.dosage,
  };
}

const SELECT = "SELECT id, encounter_id, medication, dosage FROM medication_requests";

export function listMedicationsByEncounter(request: Request) {
  const encounterId = Number(request.params.encounterId);
  getEncounterById(encounterId); // 404 se o atendimento não existe

  const rows = db
    .prepare(`${SELECT} WHERE encounter_id = ? ORDER BY id`)
    .all(encounterId) as MedicationRow[];

  return rows.map(toMedicationJson);
}

export function createMedication(encounterId: number, input: CreateMedicationInput) {
  getEncounterById(encounterId);

  const result = db
    .prepare(
      `INSERT INTO medication_requests (encounter_id, medication, dosage)
       VALUES (?, ?, ?)`,
    )
    .run(encounterId, input.medication, input.dosage);

  const row = db.prepare(`${SELECT} WHERE id = ?`).get(result.lastInsertRowid) as MedicationRow;
  return toMedicationJson(row);
}
