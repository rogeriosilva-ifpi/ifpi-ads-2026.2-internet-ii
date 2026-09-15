/**
 * Orquestracao -- PRONTA. Liga os elementos do DOM as acoes de
 * estado + api. Nenhuma logica de negocio mora aqui.
 */
import { listPatients, createPatient } from "./api.js";
import { state, setPatients, addPatient, setFormError, clearFormError } from "./state.js";
import { render } from "./render.js";

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
  } catch (err) {
    // TODO 14 (Encontro 2): trocar por renderApiError(err.apiError)
    // quando o contrato de erro { error: { message, ... } } estiver pronto.
    setFormError(err.apiError?.error ?? "Falha ao cadastrar paciente.");
  }
  render();
});

init();
