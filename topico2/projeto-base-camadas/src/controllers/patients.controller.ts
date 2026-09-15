/**
 * ============================================================
 * TODO 2 -- Controller de Patient
 * ============================================================
 * O controller traduz HTTP <-> dominio. Ele:
 *   - le req.params / req.body
 *   - chama o Service (que ainda nao existe -- e o TODO 3)
 *   - formata a resposta (res.status().json())
 *
 * O controller NUNCA:
 *   - chama db.prepare diretamente
 *   - contem "if" de regra de negocio (ex.: "CNS ja existe?")
 *
 * Migre a LOGICA DE TRADUCAO HTTP das 3 rotas de patients que
 * estao em server.ts (list, getById, create) para ca. A
 * validacao de formato e a checagem de duplicidade vao para o
 * Service, no TODO 3.
 *
 * Dica de assinatura:
 *   import { patientsService } from "../services/patients.service.ts";
 *
 *   export const patientsController = {
 *     list(req, res) { ... },
 *     getById(req, res) { ... },
 *     create(req, res) { ... },
 *   };
 * ============================================================
 */

class PatientController(){

    public list = (_request, response) => {
      const rows = db
        .prepare("SELECT id, name, birth_date, national_id, active, photo_path FROM patients ORDER BY name")
        .all() as PatientRow[];
    
      response.status(200).json(rows.map(toPatientJson));
    }

    getById = (req, res) => { ... }

    create = (req, res) => { ... }
}


/**
 * ============================================================
 * TODO 13 (Encontro 2, continuacao) -- Controller de upload
 * ============================================================
 * uploadPhoto(req, res):
 *   - se !req.file -> throw new UnprocessableEntityError()
 *   - chama patientsService.setPhoto(req.params.id, req.file.filename)
 *   - responde 200 com o paciente atualizado
 * ============================================================
 */
