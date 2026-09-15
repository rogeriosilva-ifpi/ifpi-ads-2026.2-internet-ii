/**
 * Renderizacao. Uma unica funcao render() le o estado inteiro e
 * redesenha a lista -- inclusive o preview de foto local, antes
 * de qualquer resposta do servidor.
 */
import { state } from "./state.js";

export function render() {
  renderFormError();
  renderPatientList();
}

function renderFormError() {
  const container = document.getElementById("form-error-container");
  container.innerHTML = "";
  if (!state.formError) return;

  const box = document.createElement("div");
  box.className = "form-error";
  box.textContent = state.formError;

  if (state.fieldErrors && Object.keys(state.fieldErrors).length > 0) {
    const list = document.createElement("ul");
    list.className = "mb-0 mt-1 ps-3";
    for (const [field, messages] of Object.entries(state.fieldErrors)) {
      const item = document.createElement("li");
      item.className = "field-error";
      item.textContent = `${field}: ${[].concat(messages).join(", ")}`;
      list.appendChild(item);
    }
    box.appendChild(list);
  }

  container.appendChild(box);
}

function renderPatientList() {
  const list = document.getElementById("patient-list");
  list.innerHTML = "";

  for (const patient of state.patients) {
    const li = document.createElement("li");
    li.className = "patient-card";
    li.dataset.patientId = patient.id;

    // Preview local (ainda nao enviado) tem prioridade sobre a
    // foto ja salva no servidor -- e o feedback imediato.
    const photoSrc = state.photoPreviews[patient.id] || patient.photoUrl || "";

    li.innerHTML = `
      ${photoSrc ? `<img class="patient-card__photo" src="${photoSrc}" alt="" />` : `<div class="patient-card__photo"></div>`}
      <div class="flex-grow-1">
        <p class="patient-card__name">${patient.name}</p>
        <p class="patient-card__meta">CNS ${patient.nationalId} · ${patient.active ? "ativo" : "inativo"}</p>
      </div>
      <div>
        <label class="btn btn-sm btn-outline-secondary mb-0">
          Foto
          <input type="file" accept="image/jpeg,image/png" class="patient-card__photo-input d-none" data-patient-id="${patient.id}" />
        </label>
      </div>
    `;
    list.appendChild(li);
  }
}
