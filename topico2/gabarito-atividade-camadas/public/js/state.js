/**
 * Estado central da aplicacao. Nada no projeto manipula o DOM
 * direto: tudo passa por aqui, e render.js le esse estado para
 * desenhar a tela de novo.
 */
export const state = {
  patients: [],
  formError: null,
  fieldErrors: {},
  /** { [patientId]: objectUrl } -- preview local antes do envio ao servidor */
  photoPreviews: {},
};

export function setPatients(patients) {
  state.patients = patients;
}

export function addPatient(patient) {
  state.patients = [...state.patients, patient].sort((a, b) => a.name.localeCompare(b.name));
}

export function updatePatient(updated) {
  state.patients = state.patients.map((p) => (p.id === updated.id ? updated : p));
}

export function setFormError(message, fieldErrors = {}) {
  state.formError = message;
  state.fieldErrors = fieldErrors;
}

export function clearFormError() {
  state.formError = null;
  state.fieldErrors = {};
}

export function setPhotoPreview(patientId, objectUrl) {
  state.photoPreviews = { ...state.photoPreviews, [patientId]: objectUrl };
}

export function clearPhotoPreview(patientId) {
  const { [patientId]: _removed, ...rest } = state.photoPreviews;
  state.photoPreviews = rest;
}
