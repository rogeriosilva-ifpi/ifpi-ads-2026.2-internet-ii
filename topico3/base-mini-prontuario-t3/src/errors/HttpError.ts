/**
 * ============================================================
 * A hierarquia de erros da API  (construída no Tópico 2)
 * ------------------------------------------------------------
 * Um erro HTTP carrega três informações:
 *   - statusCode: a semântica para a MÁQUINA (o cliente decide o
 *     que fazer olhando só o número);
 *   - message: a explicação para o HUMANO;
 *   - details: dados estruturados opcionais (ex.: lista de campos
 *     inválidos vinda do Zod).
 *
 * Quem LANÇA o erro (service) não sabe formatar HTTP.
 * Quem FORMATA (errorHandler) não sabe a regra de negócio.
 * Essa é a separação inteira, em duas frases.
 * ============================================================
 */
export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details: unknown = null,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details: unknown = null) {
    super(400, message, details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string, details: unknown = null) {
    super(422, message, details);
  }
}

export class PayloadTooLargeError extends HttpError {
  constructor(message: string) {
    super(413, message);
  }
}

/* ------------------------------------------------------------
   TODO AUTH-1 — Os dois erros da identidade
   ------------------------------------------------------------
   A trilha AUTH precisa de dois status novos — e eles NÃO são
   sinônimos:

     401 Unauthorized  -> "não sei QUEM você é"
                          (sem token, token inválido, token expirado)
     403 Forbidden     -> "sei quem você é, e você NÃO PODE"
                          (papel sem permissão para esta porta)

   Crie aqui `UnauthorizedError` (401) e `ForbiddenError` (403),
   seguindo exatamente o padrão das classes acima.
   ------------------------------------------------------------ */
