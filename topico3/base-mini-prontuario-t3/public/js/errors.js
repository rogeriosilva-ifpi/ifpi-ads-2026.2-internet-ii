/**
 * ============================================================
 * LEITURA DO CONTRATO DE ERRO DA API (Tópico 2)
 * ------------------------------------------------------------
 * O backend promete que TODO erro chega no formato:
 *   { error: { message, statusCode, details } }
 * Este arquivo é o único que conhece esse formato do lado de cá.
 * Se o contrato mudar, muda-se AQUI — e em nenhum outro lugar.
 * ============================================================
 */

/** Transforma o corpo de erro da API em um texto amigável. */
export function apiErrorToMessage(body) {
  const error = body?.error;
  if (!error) {
    return "O servidor respondeu de um jeito que não reconheço.";
  }

  // `details` estruturado (validação Zod): listamos campo a campo.
  if (Array.isArray(error.details) && error.details.length > 0) {
    const fields = error.details
      .map((detail) => `${detail.field}: ${detail.problem}`)
      .join(" · ");
    return `${error.message} ${fields}`;
  }

  return error.message;
}

/** Escreve a mensagem de erro num elemento de feedback. */
export function renderApiError(body, container) {
  container.textContent = apiErrorToMessage(body);
  container.dataset.tone = "error";
}
