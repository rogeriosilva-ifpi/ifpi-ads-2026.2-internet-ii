/**
 * ============================================================
 * ORQUESTRAÇÃO
 * ------------------------------------------------------------
 * evento -> ação -> estado -> render -> tela. Sempre nesse sentido.
 * ============================================================
 */
import {} from "./api.js";
import { subscribe, getState } from "./state.js";
import { renderCounter, renderLoading, renderError } from "./render.js";

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

/** A única função que desenha a tela inteira. */
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

  // PASSO 2: chame renderMedicationList aqui
  // PASSO 4: chame renderDetail(state, detailPanelElement) aqui

  renderCounter(state.medications.length, resultCounterElement);
}

subscribe(renderApp);

// ============================================================
// PASSO 2 — carga inicial
//   async function start() {
//     renderApp(getState());
//     try {
//       const medications = await listMedications();
//       setMedications(medications);
//     } catch (error) {
//       setError(error.message);
//     }
//   }
//   start();
// ============================================================


// ============================================================
// PASSO 3 — clique em "Cadastrar prescrição"
//   ler os inputs, chamar createMedication(), addMedication(),
//   limpar o formulário, mostrar feedback de sucesso/erro
// ============================================================


// ============================================================
// PASSO 4 — clique num cartão da lista (delegação de evento no <ul>)
//   event.target.closest('[data-medication-id]') -> selectMedication(id)
//   -> buscar o detalhe com getMedication(id) -> tratar 404
// ============================================================


// ============================================================
// PASSO 5 — clique em "Suspender" dentro do painel de detalhe
//   (delegação de evento no #detail-panel, já que ele é redesenhado)
//   removeMedication(id) -> removeMedicationFromState(id)
// ============================================================
