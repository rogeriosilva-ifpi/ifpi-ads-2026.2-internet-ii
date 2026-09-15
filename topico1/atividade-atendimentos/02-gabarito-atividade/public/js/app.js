/**
 * ============================================================
 * ORQUESTRAÇÃO
 * ------------------------------------------------------------
 * Este arquivo é o maestro. Ele não guarda estado e não desenha
 * nada sozinho. Ele apenas:
 *
 *   1. liga eventos do usuário às AÇÕES do estado
 *   2. manda a tela ser redesenhada quando o estado muda
 *   3. dispara a carga inicial dos dados
 *
 * O fluxo é sempre o mesmo, e sempre em um sentido só:
 *
 *   evento  ->  ação  ->  estado  ->  render  ->  tela
 *
 * Nunca o contrário. A tela nunca é a fonte da verdade.
 * ============================================================
 */
import { listPatients, createPatient, listEncounters, createEncounter } from "./api.js";
import {
  subscribe, getState, setPatients, setSearchTerm, setOnlyActive, setError, addPatient,
  selectPatient, clearSelection, setEncounters, addEncounter, setEncounterError,
} from "./state.js";
import { renderPatientList, renderCounter, renderLoading, renderError, renderDetail } from "./render.js";

/* --- Os elementos que existem na página. Buscamos UMA vez. --- */
const searchInput = document.querySelector("#search-input");
const onlyActiveInput = document.querySelector("#only-active-input");
const patientListElement = document.querySelector("#patient-list");
const resultCounterElement = document.querySelector("#result-counter");
const nameInput = document.querySelector("#name-input");
const birthDateInput = document.querySelector("#birth-date-input");
const nationalIdInput = document.querySelector("#national-id-input");
const saveButton = document.querySelector("#save-button");
const formFeedbackElement = document.querySelector("#form-feedback");
const detailPanelElement = document.querySelector("#detail-panel");

/**
 * A ÚNICA função que desenha a tela inteira.
 * Ela é chamada toda vez que o estado muda — e apenas por isso.
 */
function renderApp(state) {
  if (state.errorMessage) {
    renderError(state.errorMessage, patientListElement);
    resultCounterElement.textContent = "";
    return;
  }

  if (state.isLoading) {
    renderLoading(patientListElement);
    resultCounterElement.textContent = "";
    return;
  }

  renderPatientList(state.visiblePatients, state.searchTerm, patientListElement);
  renderCounter(state.visiblePatients.length, state.patients.length, resultCounterElement);
  renderDetail(state, detailPanelElement);
}

/* --- Eventos do usuário viram AÇÕES, nunca alterações de DOM --- */
searchInput.addEventListener("input", (event) => {
  setSearchTerm(event.target.value);
});

onlyActiveInput.addEventListener("change", (event) => {
  setOnlyActive(event.target.checked);
});

/**
 * Cadastro de paciente.
 *
 * A ordem importa e é sempre a mesma:
 *   1. desabilita o botão  (evita duplo clique — POST não é idempotente)
 *   2. chama a camada de comunicação
 *   3. em caso de sucesso, atualiza o ESTADO (nunca o DOM direto)
 *   4. em caso de erro, mostra a mensagem que veio do servidor
 *   5. reabilita o botão, deu certo ou não
 */
saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  setFeedback("Enviando…", null);

  try {
    const created = await createPatient({
      name: nameInput.value,
      birthDate: birthDateInput.value,
      nationalId: nationalIdInput.value,
    });

    addPatient(created);
    setFeedback(`Paciente #${created.id} cadastrado.`, "success");
    nameInput.value = "";
    birthDateInput.value = "";
    nationalIdInput.value = "";
  } catch (error) {
    setFeedback(error.message, "error");
  } finally {
    saveButton.disabled = false;
  }
});

function setFeedback(message, kind) {
  formFeedbackElement.textContent = message;
  formFeedbackElement.className = kind
    ? `patient-form__feedback patient-form__feedback--${kind}`
    : "patient-form__feedback";
}

/* ------------------------------------------------------------
   DETALHE DO PACIENTE
   ------------------------------------------------------------
   Um único listener na LISTA, e não um por cartão.
   Isso se chama delegação de evento: como os cartões são
   redesenhados a cada render, um listener por cartão seria
   registrado de novo toda vez — e os antigos virariam lixo.
   O <ul> não é redesenhado, então o listener dele sobrevive.
   ------------------------------------------------------------ */
patientListElement.addEventListener("click", (event) => {
  const card = event.target.closest("[data-patient-id]");
  if (card) {
    openPatientDetail(Number(card.dataset.patientId));
  }
});

patientListElement.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  const card = event.target.closest("[data-patient-id]");
  if (card) {
    event.preventDefault();
    openPatientDetail(Number(card.dataset.patientId));
  }
});

async function openPatientDetail(patientId) {
  selectPatient(patientId);

  try {
    const encounters = await listEncounters(patientId);
    setEncounters(encounters);
  } catch (error) {
    setEncounterError(error.message);
  }
}

/* O painel de detalhe é redesenhado inteiro a cada render, então
   seus botões também são novos a cada vez. Delegação de novo. */
detailPanelElement.addEventListener("click", async (event) => {
  if (event.target.id === "close-detail-button") {
    clearSelection();
    return;
  }

  if (event.target.id === "save-encounter-button") {
    await saveEncounter(event.target);
  }
});

async function saveEncounter(button) {
  const state = getState();
  const feedback = document.querySelector("#encounter-feedback");

  button.disabled = true;
  feedback.textContent = "Enviando…";
  feedback.className = "patient-form__feedback";

  try {
    const created = await createEncounter(state.selectedPatientId, {
      startedAt: document.querySelector("#encounter-date-input").value,
      chiefComplaint: document.querySelector("#encounter-complaint-input").value,
      notes: document.querySelector("#encounter-notes-input").value,
    });

    addEncounter(created);
  } catch (error) {
    // O painel foi redesenhado? Buscamos o elemento de novo.
    const current = document.querySelector("#encounter-feedback");
    current.textContent = error.message;
    current.className = "patient-form__feedback patient-form__feedback--error";
    button.disabled = false;
  }
}

/* --- Sempre que o estado mudar, a tela é redesenhada --- */
subscribe(renderApp);

/* --- Carga inicial --- */
async function start() {
  renderApp(getState());

  try {
    const patients = await listPatients();
    setPatients(patients);
  } catch (error) {
    setError(error.message);
  }
}

start();
