/**
 * ============================================================
 * RENDERIZAÇÃO — desenha o estado na tela. E só isso.
 * ------------------------------------------------------------
 * REGRA DE OURO: aqui não se DECIDE nada. Não se filtra, não se
 * calcula regra de negócio. Um bom render é burro de propósito.
 * ============================================================
 */

/* ------------------------------------------------------------
   SEGURANÇA — escapar antes de inserir com innerHTML.
   Se um nome de paciente fosse `<img src=x onerror="...">`, o
   navegador o executaria (XSS) — e com ele leria o token do
   localStorage. O escape é a muralha; nunca o remova.
   ------------------------------------------------------------ */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** 1991-03-14 -> 14/03/1991 */
function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateTime(isoDateTime) {
  const [datePart, timePart] = isoDateTime.split("T");
  return `${formatDate(datePart)} às ${timePart}`;
}

/* ============================================================
   CABEÇALHO — identidade do usuário / modo aberto
   ============================================================ */
const ROLE_LABEL = {
  admin: "Administração",
  profissional: "Profissional de saúde",
  recepcao: "Recepção",
};

export function renderSessionBar(session, container) {
  if (session.status === "authenticated" && session.user) {
    container.innerHTML = `
      <span class="session-bar__name">${escapeHtml(session.user.name)}</span>
      <span class="role-badge role-badge--${escapeHtml(session.user.role)}">
        ${escapeHtml(ROLE_LABEL[session.user.role] ?? session.user.role)}
      </span>
      <button id="logout-button" class="btn btn-outline-light btn-sm" type="button">Sair</button>
    `;
    return;
  }

  if (session.status === "disabled") {
    container.innerHTML = `
      <span class="session-bar__open-mode" title="A trilha AUTH ainda não foi implementada no backend">
        Modo aberto — sem autenticação (trilha AUTH pendente)
      </span>
    `;
    return;
  }

  container.innerHTML = "";
}

/* ============================================================
   TELA DE LOGIN
   ============================================================ */
export function renderLoginView(state, loginView, appView) {
  const showLogin = state.session.status === "anonymous";
  loginView.hidden = !showLogin;
  appView.hidden = showLogin || state.session.status === "unknown";

  if (!showLogin) return;

  const feedback = loginView.querySelector("#login-feedback");
  const button = loginView.querySelector("#login-button");
  feedback.textContent = state.loginError ?? "";
  feedback.dataset.tone = state.loginError ? "error" : "";
  button.disabled = state.isLoggingIn;
  button.textContent = state.isLoggingIn ? "Entrando…" : "Entrar";
}

/* ============================================================
   LISTA DE PACIENTES
   ============================================================ */
function patientCardTemplate(patient) {
  const cardModifier = patient.active ? "" : " patient-card--inactive";
  const badgeModifier = patient.active ? "status-badge--active" : "status-badge--inactive";
  const badgeLabel = patient.active ? "Ativo" : "Inativo";
  const avatar = patient.photoUrl
    ? `<img class="patient-card__avatar" src="${escapeHtml(patient.photoUrl)}" alt="" />`
    : `<span class="patient-card__avatar patient-card__avatar--empty" aria-hidden="true">${escapeHtml(patient.name.charAt(0))}</span>`;

  return `
    <li class="patient-card${cardModifier}" data-patient-id="${patient.id}" role="button" tabindex="0">
      <div class="d-flex align-items-start gap-3">
        ${avatar}
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start gap-2">
            <h2 class="patient-card__name">${escapeHtml(patient.name)}</h2>
            <span class="status-badge ${badgeModifier}">${badgeLabel}</span>
          </div>
          <p class="patient-card__meta">Nascimento: ${formatDate(patient.birthDate)}</p>
          <p class="patient-card__meta patient-card__id">CNS ${escapeHtml(patient.nationalId)} · #${patient.id}</p>
        </div>
      </div>
    </li>
  `;
}

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
 * Desenha a lista INTEIRA a cada chamada. Para dezenas de
 * pacientes é instantâneo e trivial de entender — é exatamente o
 * problema que o virtual DOM do React resolve em escala maior.
 */
export function renderPatientList(patients, searchTerm, container) {
  if (patients.length === 0) {
    container.innerHTML = emptyStateTemplate(searchTerm);
    return;
  }
  container.innerHTML = patients.map(patientCardTemplate).join("");
}

export function renderCounter(visibleCount, totalCount, container) {
  container.textContent =
    visibleCount === totalCount
      ? `${totalCount} paciente(s) no prontuário`
      : `${visibleCount} de ${totalCount} paciente(s)`;
}

export function renderLoading(container) {
  container.innerHTML = `
    <li><div class="empty-state">
      <p class="empty-state__title">Carregando…</p>
      <p class="m-0">Buscando os pacientes.</p>
    </div></li>
  `;
}

export function renderError(message, container) {
  container.innerHTML = `
    <li><div class="empty-state">
      <p class="empty-state__title">Algo deu errado</p>
      <p class="m-0">${escapeHtml(message)}</p>
    </div></li>
  `;
}

/* ============================================================
   DETALHE — foto, atendimentos e prescrições
   ============================================================ */

function medicationsTemplate(state, encounterId) {
  if (state.selectedEncounterId !== encounterId) {
    return `
      <button class="btn btn-link btn-sm p-0 encounter-item__toggle" data-open-medications="${encounterId}" type="button">
        Ver prescrições
      </button>
    `;
  }

  const body = state.medicationError
    ? `<p class="medication-list__feedback" data-tone="error">${escapeHtml(state.medicationError)}</p>`
    : state.isLoadingMedications
      ? `<p class="medication-list__feedback">Carregando prescrições…</p>`
      : state.medications.length === 0
        ? `<p class="medication-list__feedback">Nenhuma prescrição neste atendimento.</p>`
        : `<ul class="medication-list">${state.medications
            .map(
              (med) => `
                <li class="medication-item">
                  <span class="medication-item__name">${escapeHtml(med.medication)}</span>
                  <span class="medication-item__dosage">${escapeHtml(med.dosage)}</span>
                </li>`,
            )
            .join("")}</ul>`;

  return `
    <div class="encounter-item__medications">
      <div class="d-flex justify-content-between align-items-center">
        <h4 class="medication-list__title">Prescrições</h4>
        <button class="btn btn-link btn-sm p-0 encounter-item__toggle" data-close-medications type="button">Fechar</button>
      </div>
      ${body}
      <div class="medication-form">
        <input id="medication-name-input" class="form-control form-control-sm" type="text"
               placeholder="Medicamento (ex.: Dipirona 500mg)" autocomplete="off" />
        <input id="medication-dosage-input" class="form-control form-control-sm" type="text"
               placeholder="Posologia (ex.: 1 comprimido de 6/6h)" autocomplete="off" />
        <button id="save-medication-button" class="btn btn-success btn-sm" type="button"
                data-encounter-id="${encounterId}">Prescrever</button>
      </div>
      <p id="medication-feedback" class="patient-form__feedback" role="alert"></p>
    </div>
  `;
}

function encounterItemTemplate(state, encounter) {
  const notes = encounter.notes
    ? `<p class="encounter-item__notes">${escapeHtml(encounter.notes)}</p>`
    : "";

  return `
    <li class="encounter-item">
      <p class="encounter-item__date">${formatDateTime(encounter.startedAt)}</p>
      <p class="encounter-item__complaint">${escapeHtml(encounter.chiefComplaint)}</p>
      ${notes}
      ${medicationsTemplate(state, encounter.id)}
    </li>
  `;
}

export function renderDetail(state, container) {
  if (!state.selectedPatient) {
    container.hidden = true;
    container.innerHTML = "";
    return;
  }

  container.hidden = false;
  const patient = state.selectedPatient;

  const photo = patient.photoUrl
    ? `<img class="detail-panel__photo" src="${escapeHtml(patient.photoUrl)}" alt="Foto de ${escapeHtml(patient.name)}" />`
    : `<div class="detail-panel__photo detail-panel__photo--empty" id="photo-preview-slot">Sem foto</div>`;

  const body = state.encounterError
    ? `<div class="empty-state"><p class="empty-state__title">Algo deu errado</p><p class="m-0">${escapeHtml(state.encounterError)}</p></div>`
    : state.isLoadingEncounters
      ? `<div class="empty-state"><p class="m-0">Carregando atendimentos…</p></div>`
      : state.encounters.length === 0
        ? `<div class="empty-state"><p class="empty-state__title">Sem atendimentos</p><p class="m-0">Este paciente ainda não tem registros.</p></div>`
        : `<ul class="encounter-list">${state.encounters
            .map((encounter) => encounterItemTemplate(state, encounter))
            .join("")}</ul>`;

  container.innerHTML = `
    <div class="detail-panel__header">
      <div class="d-flex align-items-center gap-3">
        ${photo}
        <div>
          <p class="detail-panel__eyebrow">Prontuário de</p>
          <h2 class="detail-panel__title">${escapeHtml(patient.name)}</h2>
        </div>
      </div>
      <button id="close-detail-button" class="btn btn-outline-secondary btn-sm" type="button">Fechar</button>
    </div>

    <div class="photo-uploader">
      <label class="form-label" for="photo-input">Foto do paciente (JPEG/PNG, até 2MB)</label>
      <div class="photo-uploader__row">
        <input id="photo-input" class="form-control form-control-sm" type="file" accept="image/jpeg,image/png" />
        <button id="upload-photo-button" class="btn btn-outline-success btn-sm" type="button" disabled>Enviar</button>
      </div>
      <p id="photo-feedback" class="patient-form__feedback" role="alert"></p>
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

    <button id="save-encounter-button" class="btn btn-success mt-3" type="button">Registrar atendimento</button>
    <p id="encounter-feedback" class="patient-form__feedback" role="alert"></p>

    <h3 class="detail-panel__subtitle">Atendimentos</h3>
    ${body}
  `;
}
