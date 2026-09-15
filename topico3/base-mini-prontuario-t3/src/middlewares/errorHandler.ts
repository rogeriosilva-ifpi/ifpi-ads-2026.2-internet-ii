/**
 * ============================================================
 * O ÚNICO lugar que transforma erro em resposta HTTP.
 * ------------------------------------------------------------
 * Contrato de erro da API (o frontend depende dele — errors.js):
 *
 *   { "error": { "message": "...", "statusCode": 404, "details": null } }
 *
 * Express 5: um `throw` dentro de handler async chega aqui
 * sozinho — não precisamos mais de try/catch + next(err) em
 * cada rota. É por isso que os controllers podem só "lançar".
 * ============================================================
 */
import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../errors/HttpError";

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  // Express identifica um middleware de ERRO pela aridade 4.
  // Remover este parâmetro "inútil" quebra tudo silenciosamente.
  _next: NextFunction,
) {
  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: {
        message: error.message,
        statusCode: error.statusCode,
        details: error.details ?? null,
      },
    });
    return;
  }

  // O multer sinaliza arquivo grande demais com um código próprio.
  // Traduzimos para a NOSSA semântica (413) em vez de vazar a dele.
  if (isMulterFileSizeError(error)) {
    response.status(413).json({
      error: {
        message: "Arquivo excede o limite de 2MB.",
        statusCode: 413,
        details: null,
      },
    });
    return;
  }

  // Erro que não conhecemos = bug nosso. O cliente recebe um 500
  // genérico; o DETALHE fica no log do servidor, nunca na resposta
  // (mensagem de stack para fora é presente para atacante).
  console.error("[erro não tratado]", error);
  response.status(500).json({
    error: { message: "Erro interno do servidor.", statusCode: 500, details: null },
  });
}

function isMulterFileSizeError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: unknown }).code === "LIMIT_FILE_SIZE"
  );
}
