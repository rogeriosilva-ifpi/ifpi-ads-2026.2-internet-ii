/**
 * ============================================================
 * COMUNICAÇÃO — o ÚNICO arquivo que fala com a rede.
 * ------------------------------------------------------------
 * Nenhum outro módulo escreve `fetch`. Toda a política de
 * comunicação (headers, token, contrato de erro) mora aqui —
 * é o "adapter de saída" do frontend.
 * ============================================================
 */
import { apiErrorToMessage } from "./errors.js";

/* ------------------------------------------------------------
   TOKEN
   ------------------------------------------------------------
   Guardamos o JWT no localStorage para sobreviver ao F5.
   Honestidade técnica: localStorage é legível por qualquer
   script da página — se um XSS entrar, o token vaza. É por isso
   que o escape de HTML no render.js não é "detalhe": ele é a
   muralha que protege ESTE token. (Cookie httpOnly seria a
   alternativa — nomeada em aula, fora do escopo do tópico.)
   ------------------------------------------------------------ */
const TOKEN_KEY = "mini-prontuario.token";

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function currentToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * O portão único de requisições.
 * - anexa Content-Type e Authorization quando fizer sentido;
 * - resposta não-ok vira um Error com a mensagem do CONTRATO
 *   de erro da API (errors.js) + o status para quem quiser decidir.
 */
async function request(path, options = {}) {
  const headers = { ...(options.headers ?? {}) };

  // FormData define o próprio Content-Type (com boundary).
  // Definir na mão QUEBRA o upload — por isso o `if`.
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const token = currentToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(path, { ...options, headers });

  if (!response.ok) {
    let body = null;
    try {
      body = await response.json();
    } catch {
      /* corpo não-JSON: seguimos com a mensagem genérica */
    }
    const error = new Error(apiErrorToMessage(body));
    error.status = response.status;
    throw error;
  }

  // 204 e afins não têm corpo.
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

/* ------------------- Pacientes ------------------- */
export function listPatients() {
  return request("/api/patients");
}

export function createPatient(payload) {
  return request("/api/patients", { method: "POST", body: JSON.stringify(payload) });
}

export function uploadPatientPhoto(patientId, file) {
  const formData = new FormData();
  formData.append("photo", file);
  return request(`/api/patients/${patientId}/photo`, { method: "POST", body: formData });
}

/* ------------------- Atendimentos ------------------- */
export function listEncounters(patientId) {
  return request(`/api/patients/${patientId}/encounters`);
}

export function createEncounter(patientId, payload) {
  return request(`/api/patients/${patientId}/encounters`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ------------------- Prescrições ------------------- */
export function listMedications(encounterId) {
  return request(`/api/encounters/${encounterId}/medications`);
}

export function createMedication(encounterId, payload) {
  return request(`/api/encounters/${encounterId}/medications`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/* ------------------- Identidade ------------------- */
/**
 * Estes três endpoints são construídos na trilha AUTH.
 * O frontend já os consome: enquanto /api/auth/me responder 404,
 * o app roda em "modo aberto" (sem login) — e acende sozinho
 * quando o backend de identidade nascer.
 */
export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchSession() {
  try {
    const user = await request("/api/auth/me");
    return { status: "authenticated", user };
  } catch (error) {
    if (error.status === 404) {
      return { status: "disabled", user: null }; // trilha AUTH ainda não existe
    }
    clearToken(); // token ausente/velho/inválido: volta ao login
    return { status: "anonymous", user: null };
  }
}
