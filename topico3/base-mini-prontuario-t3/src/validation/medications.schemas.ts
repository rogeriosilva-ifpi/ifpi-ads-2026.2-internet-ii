/** Schemas de MedicationRequest (Zod). */
import { z } from "zod";

export const createMedicationSchema = z.object({
  medication: z
    .string({ error: "O campo 'medication' é obrigatório." })
    .trim()
    .min(1, "O campo 'medication' não pode ser vazio."),
  dosage: z
    .string({ error: "O campo 'dosage' é obrigatório." })
    .trim()
    .min(1, "O campo 'dosage' não pode ser vazio."),
});

export type CreateMedicationInput = z.infer<typeof createMedicationSchema>;
