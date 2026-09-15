/**
 * ------------------------------------------------------------
 * TODO AUTH-4 — Schemas de registro e login
 * ------------------------------------------------------------
 * Crie e exporte:
 *   registerSchema: { name, email (z.email()), password (min 8),
 *                     role: z.enum(["admin","profissional","recepcao"]) }
 *   loginSchema:    { email, password }
 *
 * Pergunta de projeto (responda no README): por que o schema de
 * REGISTRO valida o tamanho mínimo da senha, mas o de LOGIN não
 * deve rejeitar senha curta com 400? (Dica: o que um atacante
 * aprende com cada resposta diferente?)
 * ------------------------------------------------------------ */
import { z } from "zod";

// (escreva os schemas aqui)
