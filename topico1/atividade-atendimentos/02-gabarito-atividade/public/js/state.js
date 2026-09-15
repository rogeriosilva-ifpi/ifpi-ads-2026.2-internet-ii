/**
 * ============================================================
 * ESTADO
 * ------------------------------------------------------------
 * Este arquivo guarda a resposta para: "o que a tela precisa
 * mostrar agora?"
 *
 * REGRA DE OURO: este arquivo NÃO conhece o DOM.
 * Se você escrever `document` aqui, algo saiu do lugar.
 * Teste mental: se eu apagasse o index.html inteiro, este
 * arquivo ainda faria sentido? Tem que fazer.
 * ============================================================
 */

/**
 * O estado. Uma única fonte da verdade.
 *
 * Repare no que NÃO está aqui: a lista filtrada.
 * A lista filtrada é CONSEQUÊNCIA de `patients` + `searchTerm`.
 * Guardar consequência no estado é criar duas verdades que
 * um dia vão discordar entre si.
 */
const state = {
  patients: [],
  searchTerm: "",
  onlyActive: false,
  isLoading: true,
  errorMessage: null,

  // --- detalhe do paciente ---
  selectedPatientId: null,
  encounters: [],
  isLoadingEncounters: false,
  encounterError: null,
};

/** Quem quer ser avisado quando o estado mudar. */
const listeners = [];

/**
 * Registra um interessado nas mudanças de estado.
 * @param {(state: object) => void} listener
 */
export function subscribe(listener) {
  listeners.push(listener);
}

/** Avisa todo mundo que o estado mudou. */
function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}

/**
 * Devolve uma FOTOGRAFIA do estado, já com os dados derivados.
 * Devolvemos uma cópia para que ninguém de fora consiga alterar
 * o estado por acidente.
 */
export function getState() {
  return {
    ...state,
    visiblePatients: getVisiblePatients(),
    selectedPatient: getSelectedPatient(),
    encounterCountByPatient: getEncounterCountByPatient(),
  };
}

/* ------------------------------------------------------------
   DADOS DERIVADOS
   ------------------------------------------------------------ */

/**
 * Calcula quais pacientes devem aparecer, combinando os filtros.
 * Isto é uma função pura: mesma entrada, mesma saída, sem efeito
 * colateral. Fácil de testar, fácil de confiar.
 */
export function getVisiblePatients() {
  const term = state.searchTerm.trim().toLowerCase();

  return state.patients.filter((patient) => {
    const matchesTerm = patient.name.toLowerCase().includes(term);
    const matchesStatus = state.onlyActive ? patient.active : true;
    return matchesTerm && matchesStatus;
  });
}

/**
 * O paciente aberto no momento.
 * Derivado: guardamos só o ID no estado, nunca o objeto inteiro.
 * Se guardássemos o objeto e o paciente fosse editado, teríamos
 * duas cópias — e uma delas ficaria desatualizada.
 */
export function getSelectedPatient() {
  if (state.selectedPatientId === null) {
    return null;
  }
  return state.patients.find((patient) => patient.id === state.selectedPatientId) ?? null;
}

/** Quantos atendimentos por paciente — só do paciente carregado. */
export function getEncounterCountByPatient() {
  if (state.selectedPatientId === null) {
    return {};
  }
  return { [state.selectedPatientId]: state.encounters.length };
}

/* ------------------------------------------------------------
   AÇÕES - as únicas autorizadas a mudar o estado
   ------------------------------------------------------------ */

/** Guarda a lista vinda do servidor. */
export function setPatients(patients) {
  state.patients = patients;
  state.isLoading = false;
  state.errorMessage = null;
  notify();
}

/**
 * Guarda o termo de busca.
 *
 * Repare no que esta função NÃO faz: ela não mexe na tela, não
 * esconde elemento nenhum, não sabe que existe uma lista. Ela
 * só registra um fato novo e avisa. Quem desenha é outro.
 */
export function setSearchTerm(term) {
  state.searchTerm = term;
  notify();
}

/** Liga/desliga o filtro de pacientes ativos. */
export function setOnlyActive(onlyActive) {
  state.onlyActive = onlyActive;
  notify();
}

/**
 * Acrescenta um paciente recém-criado à lista.
 *
 * Repare: não recarregamos tudo do servidor. O servidor já nos
 * devolveu o recurso criado (com o id que ele gerou), então
 * basta acrescentá-lo. Uma requisição a menos.
 */
export function addPatient(patient) {
  state.patients = [...state.patients, patient];
  notify();
}

/** Registra uma falha para a tela poder mostrar. */
export function setError(message) {
  state.errorMessage = message;
  state.isLoading = false;
  notify();
}

/* ------------------------------------------------------------
   AÇÕES DO DETALHE
   ------------------------------------------------------------ */

/** Abre o detalhe de um paciente e zera o que era do anterior. */
export function selectPatient(patientId) {
  state.selectedPatientId = patientId;
  state.encounters = [];
  state.isLoadingEncounters = true;
  state.encounterError = null;
  notify();
}

/** Fecha o detalhe. */
export function clearSelection() {
  state.selectedPatientId = null;
  state.encounters = [];
  state.isLoadingEncounters = false;
  state.encounterError = null;
  notify();
}

/** Guarda os atendimentos recebidos. */
export function setEncounters(encounters) {
  state.encounters = encounters;
  state.isLoadingEncounters = false;
  state.encounterError = null;
  notify();
}

/** Acrescenta um atendimento recém-criado, mantendo a ordem decrescente. */
export function addEncounter(encounter) {
  state.encounters = [encounter, ...state.encounters].sort((a, b) =>
    b.startedAt.localeCompare(a.startedAt)
  );
  notify();
}

/** Registra uma falha na área de atendimentos. */
export function setEncounterError(message) {
  state.encounterError = message;
  state.isLoadingEncounters = false;
  notify();
}
