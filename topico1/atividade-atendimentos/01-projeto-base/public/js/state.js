/**
 * ============================================================
 * ESTADO
 * ------------------------------------------------------------
 * Este arquivo guarda a resposta para: "o que a tela precisa
 * mostrar agora?"
 *
 * REGRA DE OURO: este arquivo NÃO conhece o DOM.
 * Se você escrever `document` aqui, algo saiu do lugar.
 * Teste mental: se eu apagasse o index.html inteiro, este
 * arquivo ainda faria sentido? Tem que fazer.
 * ============================================================
 */

/**
 * O estado. Uma única fonte da verdade.
 *
 * Repare no que NÃO está aqui: a lista filtrada.
 * A lista filtrada é CONSEQUÊNCIA de `patients` + `searchTerm`.
 * Guardar consequência no estado é criar duas verdades que
 * um dia vão discordar entre si.
 */
const state = {
  patients: [],
  searchTerm: "",
  onlyActive: false,
  isLoading: true,
  errorMessage: null,
};

/** Quem quer ser avisado quando o estado mudar. */
const listeners = [];

/**
 * Registra um interessado nas mudanças de estado.
 * @param {(state: object) => void} listener
 */
export function subscribe(listener) {
  listeners.push(listener);
}

/** Avisa todo mundo que o estado mudou. */
function notify() {
  const snapshot = getState();
  listeners.forEach((listener) => listener(snapshot));
}

/**
 * Devolve uma FOTOGRAFIA do estado, já com os dados derivados.
 * Devolvemos uma cópia para que ninguém de fora consiga alterar
 * o estado por acidente.
 */
export function getState() {
  return {
    ...state,
    visiblePatients: getVisiblePatients(),
  };
}

/* ------------------------------------------------------------
   DADOS DERIVADOS
   ------------------------------------------------------------ */

/**
 * Calcula quais pacientes devem aparecer, combinando os filtros.
 * Isto é uma função pura: mesma entrada, mesma saída, sem efeito
 * colateral. Fácil de testar, fácil de confiar.
 */
export function getVisiblePatients() {
  const term = state.searchTerm.trim().toLowerCase();

  return state.patients.filter((patient) => {
    const matchesTerm = patient.name.toLowerCase().includes(term);
    const matchesStatus = state.onlyActive ? patient.active : true;
    return matchesTerm && matchesStatus;
  });
}

/* ------------------------------------------------------------
   AÇÕES - as únicas autorizadas a mudar o estado
   ------------------------------------------------------------ */

/**
 * TODO STATE-1 (Encontro 1, Prática 1)
 * Guarde a lista recebida no estado, marque que o carregamento
 * terminou, limpe qualquer mensagem de erro anterior — e avise
 * os interessados.
 *
 * Três linhas de atribuição e uma chamada de notify().
 */
export function setPatients(patients) {
  // escreva aqui:
  state.patients = patients
  state.isLoading = false
  notify()
}

/**
 * TODO STATE-2 (Encontro 1, Prática 2)
 * Guarde o termo de busca e avise os interessados.
 */
export function setSearchTerm(term) {
  // escreva aqui
  state.searchTerm = term
  notify()
}

/** Liga/desliga o filtro de pacientes ativos. */
export function setOnlyActive(onlyActive) {
  state.onlyActive = onlyActive;
  notify();
}

/** Registra uma falha para a tela poder mostrar. */
export function setError(message) {
  state.errorMessage = message;
  state.isLoading = false;
  notify();
}
