/**
 * ============================================================
 * ESTADO
 * ------------------------------------------------------------
 * Guarda a resposta para "o que a tela precisa mostrar agora?".
 * Não conhece o DOM. Mesmo padrão do Mini-Prontuário.
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

/** Derivado: o registro aberto no painel de detalhe (nunca guardado duas vezes). */
export function getSelectedMedication() {
  if (state.selectedId === null) return null;
  return state.medications.find((m) => m.id === state.selectedId) ?? null;
}

// ============================================================
// PASSO 2 — implemente setMedications(medications)
//   guarde a lista, encerre o loading, limpe o erro, notify()
// ============================================================


/** Registra uma falha de carregamento da lista. */
export function setError(message) {
  state.errorMessage = message;
  state.isLoading = false;
  notify();
}

// ============================================================
// PASSO 3 — implemente addMedication(medication)
//   acrescenta ao array de medications (imutável: [...state.medications, medication])
//   notify()
// ============================================================


// ============================================================
// PASSO 4 — implemente selectMedication(id) e clearSelection()
//   selectMedication: guarda o id, zera erro de detalhe, notify()
//   clearSelection: volta selectedId para null, notify()
// ============================================================


/** Registra uma falha ao buscar o detalhe. */
export function setDetailError(message) {
  state.detailErrorMessage = message;
  state.isLoadingDetail = false;
  notify();
}

// ============================================================
// PASSO 5 — implemente removeMedicationFromState(id)
//   filtra o array tirando o id removido, limpa a seleção, notify()
// ============================================================
