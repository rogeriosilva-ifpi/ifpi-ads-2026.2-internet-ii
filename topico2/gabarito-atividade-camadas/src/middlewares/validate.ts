/**
 * Middleware generico de validacao: recebe qualquer schema Zod e
 * devolve um middleware que valida req.body contra ele.
 *
 * Payload invalido nunca chega ao Controller: o BadRequestError e
 * lancado aqui e capturado automaticamente pelo errorHandler
 * (Express 5 propaga excecoes sincronas de middlewares tambem).
 */
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { BadRequestError } from "../errors/HttpError.ts";

export function validate(schema: ZodSchema) {
  return (request: Request, _response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      throw new BadRequestError("Payload invalido", result.error.flatten().fieldErrors);
    }

    request.body = result.data;
    next();
  };
}

