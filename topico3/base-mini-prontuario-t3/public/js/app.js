/**
 * ============================================================
 * ORQUESTRAÇÃO — o maestro.
 * ------------------------------------------------------------
 * Não guarda estado, não desenha nada sozinho. Apenas:
 *   1. liga eventos do usuário às AÇÕES do estado
 *   2. manda a tela ser redesenhada quando o estado muda
 *   3. dispara as cargas de dados
 *
 * O fluxo é sempre num sentido só:
 *   evento -> ação -> estado -> render -> tela
 * A tela nunca é a fonte da verdade.
 * ============================================================
 */
import {
  listPatients, createPatient, uploadPatientPhoto,
  listEncounters, createEncounter,
  listMedications, createMedication,
  login, fetchSession, saveToken, clearToken,
} from "./api.js";
import {
  subscribe, getState,
  setSession, setLoggingIn, setLoginError,
  setPatients, setSearchTerm, setOnlyActive, setError, addPatient, replacePatient,
  selectPatient, clearSelection, setEncounters, addEncounter, setEncounterError,
  selectEncounter, clearEncounterSelection, setMedications, addMedication, setMedicationError,
} from "./state.js";
import {
  renderSessionBar, renderLoginView,
  renderPatientList, renderCounter, renderLoading, renderError, renderDetail,
} from "./render.js";
import { renderApiError } from "./errors.js";

/* --- Elementos fixos da página. Buscados UMA vez. --- */
const loginView = document.querySelector("#login-view");
const appView = document.querySelector("#app-view");
const sessionBarElement = document.querySelector("#session-bar");
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
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const loginButton = document.querySelector("#login-button");

/** A ÚNICA função que desenha a tela inteira. */
function renderApp(state) {
  renderSessionBar(state.session, sessionBarElement);
  renderLoginView(state, loginView, appView);

  if (state.session.status === "anonymous" || state.session.status === "unknown") {
    return; // sem sessão não há app para desenhar
  }

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

function setFeedback(element, message, tone) {
  element.textContent = message ?? "";
  element.dataset.tone = tone ?? "";
}

/* ============================================================
   IDENTIDADE
   ============================================================ */
async function bootstrap() {
  const session = await fetchSession();
  setSession(session);
  if (session.status !== "anonymous") {
    await loadPatients();
  }
}

loginButton.addEventListener("click", async () => {
  setLoggingIn();
  try {
    const { token } = await login(emailInput.value.trim(), passwordInput.value);
    saveToken(token);
    passwordInput.value = "";
    setSession(await fetchSession());
    await loadPatients();
  } catch (error) {
    setLoginError(error.message);
  }
});

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginButton.click();
});

// O botão "Sair" nasce dentro da session bar (render), então o
// listener vai no PAI fixo — event delegation, de novo.
sessionBarElement.addEventListener("click", (event) => {
  if (event.target.closest("#logout-button")) {
    clearToken();
    clearSelection();
    setSession({ status: "anonymous", user: null });
  }
});

/* ============================================================
   PACIENTES
   ============================================================ */
async function loadPatients() {
  try {
    setPatients(await listPatients());
  } catch (error) {
    if (error.status === 401) {
      // Token caducou no meio do uso: volta ao login, sem drama.
      clearToken();
      setSession({ status: "anonymous", user: null });
      return;
    }
    setError(error.message);
  }
}

searchInput.addEventListener("input", (event) => setSearchTerm(event.target.value));
onlyActiveInput.addEventListener("change", (event) => setOnlyActive(event.target.checked));

/**
 * Cadastro. A ordem é sempre a mesma:
 * desabilita o botão (POST não é idempotente) -> chama a API ->
 * sucesso atualiza o ESTADO (nunca o DOM direto) -> erro mostra a
 * mensagem DO SERVIDOR via contrato de erro -> reabilita.
 */
saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  setFeedback(formFeedbackElement, "Enviando…");

  try {
    const created = await createPatient({
      name: nameInput.value,
      birthDate: birthDateInput.value,
      nationalId: nationalIdInput.value,
    });
    addPatient(created);
    setFeedback(formFeedbackElement, `Paciente #${created.id} cadastrado.`, "success");
    nameInput.value = "";
    birthDateInput.value = "";
    nationalIdInput.value = "";
  } catch (error) {
    // error.message já veio formatada pelo contrato (errors.js).
    setFeedback(formFeedbackElement, error.message, "error");
  } finally {
    saveButton.disabled = false;
  }
});

/* ============================================================
   DETALHE — cliques na lista e dentro do painel (delegation)
   ============================================================ */
patientListElement.addEventListener("click", (event) => {
  const card = event.target.closest("[data-patient-id]");
  if (card) openPatient(Number(card.dataset.patientId));
});

patientListElement.addEventListener("keydown", (event) => {
  const card = event.target.closest("[data-patient-id]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openPatient(Number(card.dataset.patientId));
  }
});

async function openPatient(patientId) {
  selectPatient(patientId);
  try {
    setEncounters(await listEncounters(patientId));
  } catch (error) {
    setEncounterError(error.message);
  }
}

detailPanelElement.addEventListener("click", async (event) => {
  if (event.target.closest("#close-detail-button")) {
    clearSelection();
    return;
  }

  /* --- registrar atendimento --- */
  if (event.target.closest("#save-encounter-button")) {
    const button = event.target.closest("#save-encounter-button");
    const feedback = detailPanelElement.querySelector("#encounter-feedback");
    button.disabled = true;
    setFeedback(feedback, "Enviando…");
    try {
      const created = await createEncounter(getState().selectedPatientId, {
        startedAt: detailPanelElement.querySelector("#encounter-date-input").value,
        chiefComplaint: detailPanelElement.querySelector("#encounter-complaint-input").value,
        notes: detailPanelElement.querySelector("#encounter-notes-input").value || undefined,
      });
      addEncounter(created);
    } catch (error) {
      setFeedback(detailPanelElement.querySelector("#encounter-feedback"), error.message, "error");
      button.disabled = false;
    }
    return;
  }

  /* --- abrir/fechar prescrições de um atendimento --- */
  const openMedications = event.target.closest("[data-open-medications]");
  if (openMedications) {
    const encounterId = Number(openMedications.dataset.openMedications);
    selectEncounter(encounterId);
    try {
      setMedications(await listMedications(encounterId));
    } catch (error) {
      setMedicationError(error.message);
    }
    return;
  }

  if (event.target.closest("[data-close-medications]")) {
    clearEncounterSelection();
    return;
  }

  /* --- prescrever --- */
  if (event.target.closest("#save-medication-button")) {
    const button = event.target.closest("#save-medication-button");
    const feedback = detailPanelElement.querySelector("#medication-feedback");
    button.disabled = true;
    setFeedback(feedback, "Enviando…");
    try {
      const created = await createMedication(Number(button.dataset.encounterId), {
        medication: detailPanelElement.querySelector("#medication-name-input").value,
        dosage: detailPanelElement.querySelector("#medication-dosage-input").value,
      });
      addMedication(created);
    } catch (error) {
      setFeedback(detailPanelElement.querySelector("#medication-feedback"), error.message, "error");
      button.disabled = false;
    }
    return;
  }

  /* --- upload de foto: habilitar botão + preview local --- */
  if (event.target.closest("#upload-photo-button")) {
    const button = event.target.closest("#upload-photo-button");
    const input = detailPanelElement.querySelector("#photo-input");
    const feedback = detailPanelElement.querySelector("#photo-feedback");
    const file = input.files?.[0];
    if (!file) return;

    button.disabled = true;
    setFeedback(feedback, "Enviando foto…");
    try {
      const updated = await uploadPatientPhoto(getState().selectedPatientId, file);
      replacePatient(updated); // photoUrl novo -> lista e detalhe redesenham
      setFeedback(detailPanelElement.querySelector("#photo-feedback"), "Foto atualizada.", "success");
    } catch (error) {
      setFeedback(detailPanelElement.querySelector("#photo-feedback"), error.message, "error");
      button.disabled = false;
    }
  }
});

/** Preview local ANTES de qualquer envio: URL.createObjectURL. */
detailPanelElement.addEventListener("change", (event) => {
  if (event.target.id !== "photo-input") return;

  const file = event.target.files?.[0];
  const button = detailPanelElement.querySelector("#upload-photo-button");
  button.disabled = !file;
  if (!file) return;

  const slot = detailPanelElement.querySelector("#photo-preview-slot, .detail-panel__photo");
  if (slot) {
    const previewUrl = URL.createObjectURL(file);
    const img = document.createElement("img");
    img.className = "detail-panel__photo";
    img.alt = "Prévia da foto selecionada";
    img.src = previewUrl;
    img.onload = () => URL.revokeObjectURL(previewUrl); // libera a memória
    slot.replaceWith(img);
  }
});

/* ============================================================
   PARTIDA
   ============================================================ */
subscribe(renderApp);
renderApp(getState());
bootstrap();
