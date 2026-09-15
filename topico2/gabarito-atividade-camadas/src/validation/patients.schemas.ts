import { z } from "zod";

export const createPatientSchema = z.object({
  name: z.string().min(1, "nome obrigatorio").max(120, "nome muito longo"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "formato esperado: AAAA-MM-DD"),
  nationalId: z.string().min(1, "cns obrigatorio"),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
