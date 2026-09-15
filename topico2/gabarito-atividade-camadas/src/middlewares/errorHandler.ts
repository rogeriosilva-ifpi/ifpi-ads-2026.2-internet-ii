/**
 * Middleware central de erro -- o unico lugar do projeto que
 * monta um JSON de erro. Precisa dos 4 argumentos (err, req, res,
 * next) para o Express reconhecer como error handler.
 *
 * Registrado em server.ts com app.use(errorHandler), por ultimo,
 * depois de todas as rotas.
 */
import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { HttpError, PayloadTooLargeError } from "../errors/HttpError.ts";

export function errorHandler(err: unknown, _request: Request, response: Response, _next: NextFunction) {
  // O multer lanca o proprio tipo de erro (nao um HttpError) quando
  // o limite de tamanho e excedido. Traduzimos para o nosso contrato.
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    err = new PayloadTooLargeError();
  }

  if (err instanceof HttpError) {
    response.status(err.statusCode).json({
      error: {
        message: err.message,
        statusCode: err.statusCode,
        details: err.details ?? null,
      },
    });
    return;
  }

  // Erro inesperado: logamos o detalhe completo so no servidor.
  // O cliente nunca ve stack trace nem mensagem interna.
  console.error(err);
  response.status(500).json({
    error: { message: "Erro interno", statusCode: 500, details: null },
  });
}
