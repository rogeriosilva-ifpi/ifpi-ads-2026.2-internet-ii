/**
 * Hierarquia de erros HTTP -- cada subclasse ja sabe o proprio
 * status code, entao quem lanca o erro nao precisa lembrar o numero.
 */
export class HttpError extends Error {
  constructor(public statusCode: number, message: string, public details?: unknown) {
    super(message);
  }
}

export class BadRequestError extends HttpError {
  constructor(message = "Requisicao invalida", details?: unknown) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Recurso nao encontrado") {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message = "Conflito com o estado atual do recurso") {
    super(409, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message = "Nao foi possivel processar a entidade", details?: unknown) {
    super(422, message, details);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message = "Arquivo excede o tamanho permitido") {
    super(413, message);
  }
}
