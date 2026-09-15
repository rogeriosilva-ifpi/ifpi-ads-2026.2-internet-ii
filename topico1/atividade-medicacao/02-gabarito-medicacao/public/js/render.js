/**
 * ============================================================
 * RENDERIZAÇÃO [GABARITO]
 * ============================================================
 */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDateTime(isoDateTime) {
  const [datePart, timePart] = isoDateTime.split("T");
  const [year, month, day] = datePart.split("-");
  return `${day}/${month}/${year} às ${timePart}`;
}

function medicationCardTemplate(med) {
  return `
    <li class="medication-card" data-medication-id="${med.id}" role="button" tabindex="0">
      <h2 class="medication-card__name">${escapeHtml(med.medicationName)} — ${escapeHtml(med.dosage)}</h2>
      <p class="medication-card__meta">${escapeHtml(med.patientName)}</p>
      <p class="medication-card__meta">${escapeHtml(med.route)} · ${formatDateTime(med.scheduledAt)}</p>
    </li>
  `;
}

function emptyStateTemplate() {
  return `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Nada por aqui</p>
        <p class="m-0">Nenhuma prescrição cadastrada ainda.</p>
      </div>
    </li>
  `;
}

export function renderMedicationList(medications, container) {
  if (medications.length === 0) {
    container.innerHTML = emptyStateTemplate();
    return;
  }
  container.innerHTML = medications.map(medicationCardTemplate).join("");
}

export function renderCounter(count, container) {
  container.textContent = `${count} prescrição(ões) no painel`;
}

export function renderLoading(container) {
  container.innerHTML = `<li><div class="empty-state"><p class="empty-state__title">Carregando…</p></div></li>`;
}

export function renderError(message, container) {
  container.innerHTML = `<li><div class="empty-state"><p class="empty-state__title">Algo deu errado</p><p class="m-0">${escapeHtml(message)}</p></div></li>`;
}

export function renderDetail(state, container) {
  if (!state.selectedMedication) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  const med = state.selectedMedication;

  const body = state.detailErrorMessage
    ? `<p class="text-danger">${escapeHtml(state.detailErrorMessage)}</p>`
    : `
      <p class="medication-card__meta"><strong>Paciente:</strong> ${escapeHtml(med.patientName)}</p>
      <p class="medication-card__meta"><strong>Medicamento:</strong> ${escapeHtml(med.medicationName)} — ${escapeHtml(med.dosage)}</p>
      <p class="medication-card__meta"><strong>Via:</strong> ${escapeHtml(med.route)}</p>
      <p class="medication-card__meta"><strong>Horário previsto:</strong> ${formatDateTime(med.scheduledAt)}</p>
      ${med.notes ? `<p class="medication-card__meta"><strong>Observações:</strong> ${escapeHtml(med.notes)}</p>` : ""}
    `;

  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-start mb-3">
      <h2 class="h5 m-0">Detalhe da prescrição</h2>
      <button id="close-detail-button" class="btn btn-outline-secondary btn-sm" type="button">Fechar</button>
    </div>
    ${body}
    <button id="remove-button" class="btn btn-outline-danger btn-sm mt-2" type="button">Suspender</button>
  `;
}
