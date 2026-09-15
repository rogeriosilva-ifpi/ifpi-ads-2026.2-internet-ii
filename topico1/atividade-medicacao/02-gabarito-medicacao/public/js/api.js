/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO [GABARITO]
 * ============================================================
 */

const MEDICATIONS_URL = "/api/medications";

export async function listMedications() {
  const response = await fetch(MEDICATIONS_URL);
  if (!response.ok) {
    throw new Error(`Não foi possível carregar as prescrições (HTTP ${response.status})`);
  }
  return response.json();
}

export async function createMedication(medication) {
  const response = await fetch(MEDICATIONS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(medication),
  });

  if (!response.ok) {
    const problem = await response.json().catch(() => ({}));
    throw new Error(problem.error ?? `Falha ao cadastrar (HTTP ${response.status})`);
  }

  return response.json();
}

export async function getMedication(id) {
  const response = await fetch(`${MEDICATIONS_URL}/${id}`);

  if (response.status === 404) {
    throw new Error("Prescrição não encontrada.");
  }
  if (!response.ok) {
    throw new Error(`Falha ao buscar a prescrição (HTTP ${response.status})`);
  }

  return response.json();
}

export async function removeMedication(id) {
  const response = await fetch(`${MEDICATIONS_URL}/${id}`, { method: "DELETE" });

  // 204 nao tem corpo — nao dá pra chamar response.json() aqui.
  if (!response.ok) {
    throw new Error(`Falha ao suspender a prescrição (HTTP ${response.status})`);
  }
}
