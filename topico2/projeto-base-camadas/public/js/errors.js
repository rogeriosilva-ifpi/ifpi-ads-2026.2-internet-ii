/**
 * ============================================================
 * TODO 14 (Encontro 2) -- renderApiError
 * ============================================================
 * O contrato de erro da API (a partir do Encontro 2) e sempre:
 *   { error: { message, statusCode, details } }
 *
 * import { setFormError } from "./state.js";
 * import { render } from "./render.js";
 *
 * export function renderApiError(body) {
 *   const { message, details } = body.error;
 *   setFormError(message, details ?? {});
 *   render();
 * }
 *
 * Use isso em todo catch de chamada a api.js -- inclusive na
 * criacao de paciente que ja existe hoje.
 * ============================================================
 */
