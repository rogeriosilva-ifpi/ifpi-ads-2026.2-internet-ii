/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO
 * ------------------------------------------------------------
 * Este é o ÚNICO arquivo do frontend autorizado a chamar `fetch`.
 *
 * Por quê? Porque no dia em que a URL mudar, o servidor exigir
 * um cabeçalho de autenticação, ou o formato do erro mudar, você
 * quer abrir UM arquivo — não caçar `fetch` espalhado em cinco.
 *
 * Ninguém aqui fora precisa saber que existe HTTP. Quem chama
 * `listPatients()` recebe uma lista de pacientes. Ponto.
 * ============================================================
 */

/**
 * A fonte dos dados.
 *
 * ENCONTRO 1: "./mock/patients.json" — um arquivo estático.
 * ENCONTRO 2: "/api/patients" — o servidor de verdade.
 *
 * UMA LINHA. Foi só isso que mudou no frontend inteiro quando
 * trocamos o arquivo falso por uma API real com banco de dados.
 * Nem state.js, nem render.js, nem app.js souberam da troca.
 *
 * Isso tem nome: acoplamento baixo. E é a razão pela qual todo
 * `fetch` mora aqui dentro.
 */
const PATIENTS_URL = "/api/patients";

/**
 * Busca a lista de pacientes.
 * @returns {Promise<Array<{id:number,name:string,birthDate:string,nationalId:string,active:boolean}>>}
 */
export async function listPatients() {
  const response = await fetch(PATIENTS_URL);

  // ATENÇÃO: `fetch` NÃO lança erro em 404 ou 500.
  // Ele só lança quando a rede falha (sem conexão, DNS, CORS).
  // Um 404 chega aqui como uma resposta perfeitamente "bem-sucedida".
  // Por isso a checagem de `response.ok` é obrigatória.
  if (!response.ok) {
    throw new Error(`Não foi possível carregar os pacientes (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Busca um paciente específico.
 * @param {number} id
 */
export async function getPatient(id) {
  const response = await fetch(`/api/patients/${id}`);

  if (response.status === 404) {
    throw new Error("Paciente não encontrado.");
  }
  if (!response.ok) {
    throw new Error(`Falha ao buscar o paciente (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Cria um paciente.
 *
 * Três coisas que o GET não precisava:
 *   1. `method: "POST"`         — o verbo diz a intenção
 *   2. `Content-Type`           — o servidor precisa saber que é JSON
 *   3. `body: JSON.stringify()` — o corpo viaja como TEXTO
 *
 * `JSON.stringify` não é decoração: pela rede não trafega objeto
 * JavaScript, trafega texto. O `express.json()` do outro lado faz
 * o caminho inverso.
 *
 * @param {{name:string, birthDate:string, nationalId:string}} patient
 */
export async function createPatient(patient) {
  const response = await fetch(PATIENTS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patient),
  });

  // O servidor já nos deu uma mensagem boa quando recusou (400).
  // Repassar essa mensagem é melhor que inventar um texto genérico.
  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.error ?? `Falha ao cadastrar (HTTP ${response.status})`);
  }

  return response.json();
}

/* ============================================================
   ENCOUNTERS
   ============================================================ */

/** Lista os atendimentos de um paciente. */
export async function listEncounters(patientId) {
  const response = await fetch(`/api/patients/${patientId}/encounters`);

  if (response.status === 404) {
    throw new Error("Paciente não encontrado.");
  }
  if (!response.ok) {
    throw new Error(`Falha ao carregar os atendimentos (HTTP ${response.status})`);
  }

  return response.json();
}

/** Registra um atendimento. */
export async function createEncounter(patientId, encounter) {
  const response = await fetch(`/api/patients/${patientId}/encounters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(encounter),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.error ?? `Falha ao registrar o atendimento (HTTP ${response.status})`);
  }

  return response.json();
}
