/** Schemas de Encounter (Zod). */
import { z } from "zod";

const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;

export const createEncounterSchema = z.object({
  startedAt: z
    .string({ error: "O campo 'startedAt' é obrigatório." })
    .regex(ISO_DATE_TIME, "Use o formato AAAA-MM-DDTHH:MM."),
  chiefComplaint: z
    .string({ error: "O campo 'chiefComplaint' é obrigatório." })
    .trim()
    .min(1, "O campo 'chiefComplaint' não pode ser vazio."),
  notes: z.string().trim().min(1).optional(),
});

export type CreateEncounterInput = z.infer<typeof createEncounterSchema>;
