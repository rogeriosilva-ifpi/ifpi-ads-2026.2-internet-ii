/**
 * ============================================================
 * ESTADO [GABARITO]
 * ============================================================
 */

const state = {
  medications: [],
  isLoading: true,
  errorMessage: null,

  selectedId: null,
  isLoadingDetail: false,
  detailErrorMessage: null,
};

const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
}

function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}

export function getState() {
  return {
    ...state,
    selectedMedication: getSelectedMedication(),
  };
}

export function getSelectedMedication() {
  if (state.selectedId === null) return null;
  return state.medications.find((m) => m.id === state.selectedId) ?? null;
}

export function setMedications(medications) {
  state.medications = medications;
  state.isLoading = false;
  state.errorMessage = null;
  notify();
}

export function setError(message) {
  state.errorMessage = message;
  state.isLoading = false;
  notify();
}

export function addMedication(medication) {
  state.medications = [...state.medications, medication];
  notify();
}

export function selectMedication(id) {
  state.selectedId = id;
  state.detailErrorMessage = null;
  notify();
}

export function clearSelection() {
  state.selectedId = null;
  state.detailErrorMessage = null;
  notify();
}

export function setDetailError(message) {
  state.detailErrorMessage = message;
  state.isLoadingDetail = false;
  notify();
}

export function removeMedicationFromState(id) {
  state.medications = state.medications.filter((m) => m.id !== id);
  state.selectedId = null;
  notify();
}
