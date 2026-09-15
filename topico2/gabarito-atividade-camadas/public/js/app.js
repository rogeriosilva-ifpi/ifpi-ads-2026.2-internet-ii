/**
 * Orquestracao. Liga os elementos do DOM as acoes de estado + api.
 * Nenhuma logica de negocio mora aqui.
 */
import { listPatients, createPatient, uploadPatientPhoto } from "./api.js";
import {
  state,
  setPatients,
  addPatient,
  updatePatient,
  setFormError,
  clearFormError,
  setPhotoPreview,
  clearPhotoPreview,
} from "./state.js";
import { render } from "./render.js";
import { renderApiError } from "./errors.js";

async function init() {
  try {
    const patients = await listPatients();
    setPatients(patients);
  } catch (err) {
    setFormError(err.message ?? "Falha ao carregar pacientes.");
  }
  render();
}

document.getElementById("patient-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFormError();

  const form = event.target;
  const payload = {
    name: form.name.value,
    birthDate: form.birthDate.value,
    nationalId: form.nationalId.value,
  };

  try {
    const created = await createPatient(payload);
    addPatient(created);
    form.reset();
    render();
  } catch (err) {
    if (err.apiError) {
      renderApiError(err.apiError);
    } else {
      setFormError("Falha ao cadastrar paciente.");
      render();
    }
  }
});

// Delegacao de evento: um unico listener no <ul>, nao um por card
// (a lista e recriada a cada render, entao listeners individuais
// se perderiam).
document.getElementById("patient-list").addEventListener("change", async (event) => {
  const input = event.target.closest(".patient-card__photo-input");
  if (!input) return;

  const patientId = input.dataset.patientId;
  const file = input.files[0];
  if (!file) return;

  // Preview local, antes de qualquer requisicao ao servidor.
  setPhotoPreview(patientId, URL.createObjectURL(file));
  render();

  try {
    const updated = await uploadPatientPhoto(patientId, file);
    updatePatient(updated);
  } catch (err) {
    if (err.apiError) {
      renderApiError(err.apiError);
    } else {
      setFormError("Falha ao enviar foto.");
    }
  } finally {
    clearPhotoPreview(patientId);
    render();
  }
});

init();
