/**
 * ============================================================
 * ORQUESTRAÇÃO [GABARITO]
 * ============================================================
 */
import { listMedications, createMedication, getMedication, removeMedication } from "./api.js";
import {
  subscribe, getState, setMedications, setError, addMedication,
  selectMedication, clearSelection, setDetailError, removeMedicationFromState,
} from "./state.js";
import { renderMedicationList, renderCounter, renderLoading, renderError, renderDetail } from "./render.js";

const medicationListElement = document.querySelector("#medication-list");
const resultCounterElement = document.querySelector("#result-counter");
const detailPanelElement = document.querySelector("#detail-panel");

const patientNameInput = document.querySelector("#patient-name-input");
const medicationNameInput = document.querySelector("#medication-name-input");
const dosageInput = document.querySelector("#dosage-input");
const routeInput = document.querySelector("#route-input");
const scheduledAtInput = document.querySelector("#scheduled-at-input");
const notesInput = document.querySelector("#notes-input");
const saveButton = document.querySelector("#save-button");
const formFeedbackElement = document.querySelector("#form-feedback");

function renderApp(state) {
  if (state.errorMessage) {
    renderError(state.errorMessage, medicationListElement);
    resultCounterElement.textContent = "";
    return;
  }
  if (state.isLoading) {
    renderLoading(medicationListElement);
    resultCounterElement.textContent = "";
    return;
  }

  renderMedicationList(state.medications, medicationListElement);
  renderDetail(state, detailPanelElement);
  renderCounter(state.medications.length, resultCounterElement);
}

subscribe(renderApp);

async function start() {
  renderApp(getState());
  try {
    const medications = await listMedications();
    setMedications(medications);
  } catch (error) {
    setError(error.message);
  }
}
start();

function setFormFeedback(message, kind) {
  formFeedbackElement.textContent = message;
  formFeedbackElement.className = kind
    ? `med-form__feedback med-form__feedback--${kind}`
    : "med-form__feedback";
}

saveButton.addEventListener("click", async () => {
  saveButton.disabled = true;
  setFormFeedback("Enviando…", null);

  try {
    const created = await createMedication({
      patientName: patientNameInput.value,
      medicationName: medicationNameInput.value,
      dosage: dosageInput.value,
      route: routeInput.value,
      scheduledAt: scheduledAtInput.value,
      notes: notesInput.value,
    });

    addMedication(created);
    setFormFeedback(`Prescrição #${created.id} cadastrada.`, "success");
    patientNameInput.value = "";
    medicationNameInput.value = "";
    dosageInput.value = "";
    scheduledAtInput.value = "";
    notesInput.value = "";
  } catch (error) {
    setFormFeedback(error.message, "error");
  } finally {
    saveButton.disabled = false;
  }
});

/* Delegação: a lista inteira é redesenhada a cada render, então um único
   listener no <ul> pai evita registrar (e acumular) um por cartão. */
medicationListElement.addEventListener("click", (event) => {
  const card = event.target.closest("[data-medication-id]");
  if (card) openDetail(Number(card.dataset.medicationId));
});

medicationListElement.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-medication-id]");
  if (card) {
    event.preventDefault();
    openDetail(Number(card.dataset.medicationId));
  }
});

async function openDetail(id) {
  selectMedication(id);
  try {
    await getMedication(id); // o dado já está no estado; a chamada real pratica o path param + 404
  } catch (error) {
    setDetailError(error.message);
  }
}

/* O painel de detalhe também é redesenhado inteiro — delegação de novo. */
detailPanelElement.addEventListener("click", async (event) => {
  if (event.target.id === "close-detail-button") {
    clearSelection();
    return;
  }
  if (event.target.id === "remove-button") {
    const state = getState();
    try {
      await removeMedication(state.selectedId);
      removeMedicationFromState(state.selectedId);
    } catch (error) {
      setDetailError(error.message);
    }
  }
});
