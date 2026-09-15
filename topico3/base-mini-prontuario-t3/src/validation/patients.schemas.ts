/**
 * Schemas de Patient (Zod) — construídos no Tópico 2.
 * O schema é a fonte única da verdade sobre "o que é uma entrada
 * válida". Dele derivamos até o TIPO TypeScript (z.infer).
 */
import { z } from "zod";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const createPatientSchema = z.object({
  name: z
    .string({ error: "O campo 'name' é obrigatório." })
    .trim()
    .min(1, "O campo 'name' não pode ser vazio."),
  birthDate: z
    .string({ error: "O campo 'birthDate' é obrigatório." })
    .regex(ISO_DATE, "Use o formato AAAA-MM-DD."),
  nationalId: z
    .string({ error: "O campo 'nationalId' é obrigatório." })
    .trim()
    .min(1, "O campo 'nationalId' não pode ser vazio."),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
