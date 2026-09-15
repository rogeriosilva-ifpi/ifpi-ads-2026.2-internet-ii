/**
 * ============================================================
 * ESTADO — a única fonte da verdade da tela.
 * ------------------------------------------------------------
 * REGRA DE OURO: este arquivo NÃO conhece o DOM.
 * Se você escrever `document` aqui, algo saiu do lugar.
 *
 * Repare no que NÃO está aqui: a lista filtrada. Ela é
 * CONSEQUÊNCIA de `patients` + `searchTerm` — guardar
 * consequência é criar duas verdades que um dia discordam.
 * ============================================================
 */

const state = {
  /* --- identidade (trilha AUTH; "disabled" = modo aberto) --- */
  session: { status: "unknown", user: null }, // unknown|disabled|anonymous|authenticated
  loginError: null,
  isLoggingIn: false,

  /* --- lista de pacientes --- */
  patients: [],
  searchTerm: "",
  onlyActive: false,
  isLoading: true,
  errorMessage: null,

  /* --- detalhe do paciente --- */
  selectedPatientId: null,
  encounters: [],
  isLoadingEncounters: false,
  encounterError: null,

  /* --- prescrições do atendimento aberto --- */
  selectedEncounterId: null,
  medications: [],
  isLoadingMedications: false,
  medicationError: null,
};

/** Quem quer ser avisado quando o estado mudar. */
const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}

/**
 * Uma FOTOGRAFIA do estado, já com os dados derivados.
 * Cópia, para ninguém de fora alterar o estado por acidente.
 */
export function getState() {
  return {
    ...state,
    visiblePatients: getVisiblePatients(),
    selectedPatient: getSelectedPatient(),
  };
}

/* ------------------------------------------------------------
   DADOS DERIVADOS — funções puras: mesma entrada, mesma saída
   ------------------------------------------------------------ */

export function getVisiblePatients() {
  const term = state.searchTerm.trim().toLowerCase();

  return state.patients.filter((patient) => {
    const matchesTerm = patient.name.toLowerCase().includes(term);
    const matchesStatus = state.onlyActive ? patient.active : true;
    return matchesTerm && matchesStatus;
  });
}

export function getSelectedPatient() {
  if (state.selectedPatientId === null) {
    return null;
  }
  return state.patients.find((patient) => patient.id === state.selectedPatientId) ?? null;
}

/* ------------------------------------------------------------
   AÇÕES — as únicas autorizadas a mudar o estado
   ------------------------------------------------------------ */

/* --- identidade --- */
export function setSession(session) {
  state.session = session;
  state.loginError = null;
  state.isLoggingIn = false;
  notify();
}

export function setLoggingIn() {
  state.isLoggingIn = true;
  state.loginError = null;
  notify();
}

export function setLoginError(message) {
  state.loginError = message;
  state.isLoggingIn = false;
  notify();
}

/* --- pacientes --- */
export function setPatients(patients) {
  state.patients = patients;
  state.isLoading = false;
  state.errorMessage = null;
  notify();
}

export function setSearchTerm(term) {
  state.searchTerm = term;
  notify();
}

export function setOnlyActive(onlyActive) {
  state.onlyActive = onlyActive;
  notify();
}

export function addPatient(patient) {
  // O servidor devolveu o recurso criado com o id gerado —
  // basta acrescentar. Uma requisição a menos.
  state.patients = [...state.patients, patient];
  notify();
}

export function replacePatient(patient) {
  state.patients = state.patients.map((existing) =>
    existing.id === patient.id ? patient : existing,
  );
  notify();
}

export function setError(message) {
  state.errorMessage = message;
  state.isLoading = false;
  notify();
}

/* --- detalhe / atendimentos --- */
export function selectPatient(patientId) {
  state.selectedPatientId = patientId;
  state.encounters = [];
  state.isLoadingEncounters = true;
  state.encounterError = null;
  clearEncounterSelection(false);
  notify();
}

export function clearSelection() {
  state.selectedPatientId = null;
  state.encounters = [];
  state.encounterError = null;
  clearEncounterSelection(false);
  notify();
}

export function setEncounters(encounters) {
  state.encounters = encounters;
  state.isLoadingEncounters = false;
  state.encounterError = null;
  notify();
}

export function addEncounter(encounter) {
  state.encounters = [encounter, ...state.encounters];
  notify();
}

export function setEncounterError(message) {
  state.encounterError = message;
  state.isLoadingEncounters = false;
  notify();
}

/* --- prescrições --- */
export function selectEncounter(encounterId) {
  state.selectedEncounterId = encounterId;
  state.medications = [];
  state.isLoadingMedications = true;
  state.medicationError = null;
  notify();
}

export function clearEncounterSelection(shouldNotify = true) {
  state.selectedEncounterId = null;
  state.medications = [];
  state.isLoadingMedications = false;
  state.medicationError = null;
  if (shouldNotify) notify();
}

export function setMedications(medications) {
  state.medications = medications;
  state.isLoadingMedications = false;
  state.medicationError = null;
  notify();
}

export function addMedication(medication) {
  state.medications = [...state.medications, medication];
  notify();
}

export function setMedicationError(message) {
  state.medicationError = message;
  state.isLoadingMedications = false;
  notify();
}
