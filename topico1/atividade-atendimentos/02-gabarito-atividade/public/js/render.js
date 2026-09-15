/**
 * ============================================================
 * RENDERIZAÇÃO
 * ------------------------------------------------------------
 * Este arquivo desenha o estado na tela. E só isso.
 *
 * REGRA DE OURO: aqui não se DECIDE nada.
 * Não se filtra, não se ordena, não se calcula regra de negócio.
 * Ele recebe o que deve aparecer e coloca na tela.
 *
 * Um bom `render` é burro de propósito. Toda a inteligência
 * mora no estado.
 * ============================================================
 */

/* ------------------------------------------------------------
   SEGURANÇA - por que escapar o texto?
   ------------------------------------------------------------
   Vamos montar HTML com `innerHTML`. Se o nome de um paciente
   fosse `<img src=x onerror="alert(1)">`, o navegador executaria
   esse código. Isso se chama XSS.
   Escapar significa: transformar caractere de marcação em texto.
   Voltaremos a isso com calma em OWASP Top 10.
   ------------------------------------------------------------ */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** 1991-03-14  ->  14/03/1991 */
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

/** Monta o HTML de UM cartão de paciente. */
function formatDateTime(isoDateTime) {
  const [datePart, timePart] = isoDateTime.split("T");
  return `${formatDate(datePart)} às ${timePart}`;
}

function patientCardTemplate(patient) {
  const cardModifier = patient.active ? "" : " patient-card--inactive";
  const badgeModifier = patient.active ? "status-badge--active" : "status-badge--inactive";
  const badgeLabel = patient.active ? "Ativo" : "Inativo";

  return `
    <li class="patient-card${cardModifier}" data-patient-id="${patient.id}" role="button" tabindex="0">
      <div class="d-flex justify-content-between align-items-start gap-2">
        <h2 class="patient-card__name">${escapeHtml(patient.name)}</h2>
        <span class="status-badge ${badgeModifier}">${badgeLabel}</span>
      </div>
      <p class="patient-card__meta">
        Nascimento: ${formatDate(patient.birthDate)}
      </p>
      <p class="patient-card__meta patient-card__id">
        CNS ${escapeHtml(patient.nationalId)} · #${patient.id}
      </p>
    </li>
  `;
}

/** Tela de "nada encontrado". */
function emptyStateTemplate(searchTerm) {
  const complement = searchTerm
    ? `Nenhum paciente corresponde a “${escapeHtml(searchTerm)}”.`
    : "Nenhum paciente cadastrado ainda.";

  return `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Nada por aqui</p>
        <p class="m-0">${complement}</p>
      </div>
    </li>
  `;
}

/**
 * Desenha a lista inteira a cada chamada.
 *
 * Sim, a lista INTEIRA. Para oito pacientes isso é instantâneo e
 * o código fica trivial de entender. Para dez mil linhas com foco
 * e rolagem preservados, não seria — e é exatamente esse problema
 * que o React resolve com o virtual DOM. Você vai entender o React
 * muito melhor por ter vivido esta versão primeiro.
 */
export function renderPatientList(patients, searchTerm, container) {
  if (patients.length === 0) {
    container.innerHTML = emptyStateTemplate(searchTerm);
    return;
  }

  container.innerHTML = patients.map(patientCardTemplate).join("");
}

/** Atualiza o contador de resultados. */
export function renderCounter(visibleCount, totalCount, container) {
  container.textContent =
    visibleCount === totalCount
      ? `${totalCount} paciente(s) no prontuário`
      : `${visibleCount} de ${totalCount} paciente(s)`;
}

/** Mensagem enquanto os dados não chegaram. */
export function renderLoading(container) {
  container.innerHTML = `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Carregando…</p>
        <p class="m-0">Buscando os pacientes.</p>
      </div>
    </li>
  `;
}

/** Mensagem quando a comunicação falhou. */
export function renderError(message, container) {
  container.innerHTML = `
    <li>
      <div class="empty-state">
        <p class="empty-state__title">Algo deu errado</p>
        <p class="m-0">${escapeHtml(message)}</p>
      </div>
    </li>
  `;
}

/* ============================================================
   DETALHE DO PACIENTE
   ============================================================ */

function encounterItemTemplate(encounter) {
  const notes = encounter.notes
    ? `<p class="encounter-item__notes">${escapeHtml(encounter.notes)}</p>`
    : "";

  return `
    <li class="encounter-item">
      <p class="encounter-item__date">${formatDateTime(encounter.startedAt)}</p>
      <p class="encounter-item__complaint">${escapeHtml(encounter.chiefComplaint)}</p>
      ${notes}
    </li>
  `;
}

/** Desenha o painel de detalhe inteiro a partir do estado. */
export function renderDetail(state, container) {
  if (!state.selectedPatient) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;

  const body = state.encounterError
    ? `<div class="empty-state"><p class="empty-state__title">Algo deu errado</p><p class="m-0">${escapeHtml(state.encounterError)}</p></div>`
    : state.isLoadingEncounters
      ? `<div class="empty-state"><p class="m-0">Carregando atendimentos…</p></div>`
      : state.encounters.length === 0
        ? `<div class="empty-state"><p class="empty-state__title">Sem atendimentos</p><p class="m-0">Este paciente ainda não tem registros.</p></div>`
        : `<ul class="encounter-list">${state.encounters.map(encounterItemTemplate).join("")}</ul>`;

  container.innerHTML = `
    <div class="detail-panel__header">
      <div>
        <p class="detail-panel__eyebrow">Prontuário de</p>
        <h2 class="detail-panel__title">${escapeHtml(state.selectedPatient.name)}</h2>
      </div>
      <button id="close-detail-button" class="btn btn-outline-secondary btn-sm" type="button">
        Fechar
      </button>
    </div>

    <div class="detail-panel__form">
      <div>
        <label class="form-label" for="encounter-date-input">Data e hora</label>
        <input id="encounter-date-input" class="form-control" type="datetime-local" />
      </div>
      <div>
        <label class="form-label" for="encounter-complaint-input">Queixa principal</label>
        <input id="encounter-complaint-input" class="form-control" type="text" autocomplete="off" />
      </div>
      <div>
        <label class="form-label" for="encounter-notes-input">Conduta (opcional)</label>
        <input id="encounter-notes-input" class="form-control" type="text" autocomplete="off" />
      </div>
    </div>

    <button id="save-encounter-button" class="btn btn-success mt-3" type="button">
      Registrar atendimento
    </button>
    <p id="encounter-feedback" class="patient-form__feedback" role="alert"></p>

    <h3 class="detail-panel__subtitle">Atendimentos</h3>
    ${body}
  `;
}
