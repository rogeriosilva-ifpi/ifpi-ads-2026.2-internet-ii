/**
 * ============================================================
 * TODO 10 (Encontro 2) -- Schema Zod de Patient
 * ============================================================
 * export const createPatientSchema = z.object({ ... });
 *
 * Campos: name (string, min 1), birthDate (string, formato
 * AAAA-MM-DD), nationalId (string).
 *
 * Depois de escrever o schema, use-o no TODO 11 (middleware
 * validate) e monte na rota de criar paciente:
 *   patientsRouter.post("/", validate(createPatientSchema), patientsController.create);
 * ============================================================
 */
