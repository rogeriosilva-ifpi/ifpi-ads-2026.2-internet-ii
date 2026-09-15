/**
 * ============================================================
 * CAMADA DE COMUNICAÇÃO
 * ------------------------------------------------------------
 * Único arquivo autorizado a chamar `fetch`. Mesmo padrão do
 * Mini-Prontuário (Semana 01).
 * ============================================================
 */

const MEDICATIONS_URL = "/api/medications";

// ============================================================
// PASSO 2 — implemente listMedications()
//   const response = await fetch(MEDICATIONS_URL);
//   if (!response.ok) throw new Error(...)
//   return response.json();
// ============================================================


// ============================================================
// PASSO 3 — implemente createMedication(medication)
//   method: "POST", headers Content-Type, body: JSON.stringify(medication)
//   se !response.ok, leia o corpo e jogue o erro com a mensagem do servidor
// ============================================================


// ============================================================
// PASSO 4 — implemente getMedication(id)
//   fetch(`${MEDICATIONS_URL}/${id}`)
//   response.status === 404 -> throw new Error("Prescrição não encontrada.")
// ============================================================


// ============================================================
// PASSO 5 — implemente removeMedication(id)
//   method: "DELETE"
//   sucesso = response.status === 204 (sem corpo, não dá pra fazer .json())
// ============================================================
