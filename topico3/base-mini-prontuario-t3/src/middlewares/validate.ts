/**
 * Middleware genérico de validação com Zod (Tópico 2).
 *
 * Recebe um schema e devolve UM middleware — por isso a função
 * dentro de função. O schema valida; em caso de falha, lançamos
 * BadRequestError com `details` estruturado, e o errorHandler
 * cuida do resto. Validação NÃO responde HTTP: ela só decide.
 */
import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { BadRequestError } from "../errors/HttpError";

export function validate(schema: ZodType) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(corpo)",
        problem: issue.message,
      }));
      throw new BadRequestError("Dados inválidos no corpo da requisição.", details);
    }

    // O controller passa a receber o corpo já validado E transformado
    // (trim, coerções). Substituímos de propósito.
    request.body = result.data;
    next();
  };
}
