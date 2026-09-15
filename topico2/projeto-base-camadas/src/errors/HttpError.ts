/**
 * ============================================================
 * TODO 8 (Encontro 2) -- Hierarquia de HttpError
 * ============================================================
 * Esta pasta esta vazia de proposito -- ela e do Encontro 1,
 * mas o conteudo e do Encontro 2. Nao implemente antes da aula.
 *
 * Quando chegar a hora, crie aqui:
 *   class HttpError extends Error { statusCode, message, details? }
 *   class BadRequestError extends HttpError          -> 400
 *   class NotFoundError extends HttpError            -> 404
 *   class ConflictError extends HttpError            -> 409
 *   class UnprocessableEntityError extends HttpError -> 422
 *   class PayloadTooLargeError extends HttpError     -> 413
 *
 * Depois disso, volte aos Services (TODO 3 e TODO 6) e troque
 * os retornos especiais de erro por `throw new AlgumHttpError()`.
 * ============================================================
 */
