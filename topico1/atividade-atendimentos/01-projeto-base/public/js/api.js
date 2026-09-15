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
 * ENCONTRO 1: apontamos para um arquivo JSON estático.
 * ENCONTRO 2: trocaremos por "/api/patients" — e nada mais no
 * frontend vai precisar mudar. Guarde essa promessa.
 */
const PATIENTS_URL = "./mock/patients.json";

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

/* ============================================================
   TODO API-1 (Encontro 2, Prática 2)
   Implemente `createPatient(patient)`.

   Precisa de três coisas que o GET não precisava:
     1. method: "POST"
     2. headers: { "Content-Type": "application/json" }
     3. body: JSON.stringify(patient)

   E o tratamento de erro é diferente: quando o servidor devolve
   400, ele manda junto uma mensagem útil no corpo. Leia essa
   mensagem e repasse para quem chamou, em vez de inventar um
   texto genérico.
   ============================================================ */
