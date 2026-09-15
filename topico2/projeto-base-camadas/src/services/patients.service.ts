/**
 * ============================================================
 * TODO 3 -- Service de Patient
 * ============================================================
 * O Service e onde mora a regra de negocio de verdade: o SQL
 * (db.prepare), a checagem de CNS duplicado (409), a traducao
 * snake_case -> camelCase (toPatientJson).
 *
 * O Service NUNCA:
 *   - conhece req/res (nao sabe que existe HTTP)
 *   - formata resposta HTTP
 *
 * Quando algo da errado (paciente nao encontrado, CNS
 * duplicado), por enquanto o Service pode continuar devolvendo
 * um valor especial (ex.: null) OU lancando um Error comum --
 * a hierarquia HttpError chega no TODO 8 (Encontro 2). Combine
 * com a dupla como vao sinalizar "nao encontrado" antes disso
 * existir.
 *
 * Migre para ca: a query de list, a query de getById, a
 * checagem de duplicata + insert de create, e a funcao
 * toPatientJson (que hoje esta em server.ts).
 *
 * Dica de assinatura:
 *   export const patientsService = {
 *     list() { ... },
 *     getById(id: string) { ... },
 *     create(data: { name: string; birthDate: string; nationalId: string }) { ... },
 *   };
 * ============================================================
 */

/**
 * ============================================================
 * TODO 13 (Encontro 2, continuacao) -- Service de upload
 * ============================================================
 * setPhoto(id, filename):
 *   - busca o paciente (senao existir -> throw NotFoundError)
 *   - UPDATE patients SET photo_path = ? WHERE id = ?
 *     (salve como `/uploads/${filename}`)
 *   - devolve o paciente atualizado (toPatientJson)
 * ============================================================
 */
