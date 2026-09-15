/**
 * ============================================================
 * TODO 5 -- Controller de Encounter
 * ============================================================
 * Mesma regra do TODO 2: traduz HTTP <-> dominio, chama o
 * Service (TODO 6), nunca acessa o banco diretamente.
 *
 * Repare que aqui o id do paciente vem de req.params.id (por
 * causa do mergeParams no TODO 4) -- e nao de um :patientId
 * separado.
 *
 *   import { encountersService } from "../services/encounters.service.ts";
 *
 *   export const encountersController = {
 *     list(req, res) { ... },
 *     create(req, res) { ... },
 *   };
 * ============================================================
 */
