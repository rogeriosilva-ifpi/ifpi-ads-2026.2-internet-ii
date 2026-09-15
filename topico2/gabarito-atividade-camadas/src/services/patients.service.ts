/**
 * Service de Patient -- regra de negocio pura.
 *
 * A partir do Encontro 2, erros sao sinalizados com `throw new
 * AlgumHttpError()` -- o Controller nao precisa mais checar um
 * resultado discriminado, e o errorHandler central cuida do resto.
 * A validacao de formato tambem saiu daqui: agora e o middleware
 * validate(createPatientSchema) que barra payload invalido antes
 * de chegar ao Controller.
 */
import { db } from "../db/database.ts";
import { ConflictError, NotFoundError } from "../errors/HttpError.ts";
import type { CreatePatientInput } from "../validation/patients.schemas.ts";

type PatientRow = {
  id: number;
  name: string;
  birth_date: string;
  national_id: string;
  active: number;
  photo_path: string | null;
};

type PatientJson = {
  id: number;
  name: string;
  birthDate: string;
  nationalId: string;
  active: boolean;
  photoUrl: string | null;
};

function toPatientJson(row: PatientRow): PatientJson {
  return {
    id: row.id,
    name: row.name,
    birthDate: row.birth_date,
    nationalId: row.national_id,
    active: row.active === 1,
    photoUrl: row.photo_path,
  };
}

function findRowById(id: string): PatientRow | undefined {
  return db
    .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients WHERE id = ?")
    .get(id) as PatientRow | undefined;
}

export const patientsService = {
  list(): PatientJson[] {
    const rows = db
      .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients ORDER BY name")
      .all() as PatientRow[];
    return rows.map(toPatientJson);
  },

  getById(id: string): PatientJson {
    const row = findRowById(id);
    if (!row) throw new NotFoundError("Paciente nao encontrado.");
    return toPatientJson(row);
  },

  create(data: CreatePatientInput): PatientJson {
    const duplicate = db
      .prepare("SELECT id FROM patients WHERE national_id = ?")
      .get(data.nationalId.trim());

    if (duplicate) {
      throw new ConflictError("Ja existe um paciente com este CNS.");
    }

    const result = db
      .prepare(
        `INSERT INTO patients (name, birth_date, national_id, active)
         VALUES (?, ?, ?, 1)`
      )
      .run(data.name.trim(), data.birthDate, data.nationalId.trim());

    const created = findRowById(String(result.lastInsertRowid))!;
    return toPatientJson(created);
  },

  /** TODO 13: salva o caminho da foto e devolve o paciente atualizado. */
  setPhoto(id: string, filename: string): PatientJson {
    const row = findRowById(id);
    if (!row) throw new NotFoundError("Paciente nao encontrado.");

    db.prepare("UPDATE patients SET photo_path = ? WHERE id = ?").run(`/uploads/${filename}`, id);

    const updated = findRowById(id)!;
    return toPatientJson(updated);
  },
};
