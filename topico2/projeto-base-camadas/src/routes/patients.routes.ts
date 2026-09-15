import { Router } from "express";
 import { PatientController } from "../controllers/patients.controller.ts";

/**
 * ============================================================
 * TODO 1 -- Rotas de Patient
 * ============================================================
 * Uma rota so faz UMA coisa: mapear METODO + PATH para uma
 * funcao do controller. Nada de db.prepare aqui, nada de
 * validacao aqui.
 *
 * Migre as 3 rotas de patients que estao em server.ts:
 *   GET    /            -> patientsController.list
 *   GET    /:id         -> patientsController.getById
 *   POST   /             -> patientsController.create
 *
 * Dica de import (depois que TODO 2 estiver pronto):
 *   import { Router } from "express";
 *   import { patientsController } from "../controllers/patients.controller.ts";
 *
 *   export const patientsRouter = Router();
 *   patientsRouter.get("/", patientsController.list);
 *   patientsRouter.get("/:id", patientsController.getById);
 *   patientsRouter.post("/", patientsController.create);
 *
 * Faca TODO 2 (controller) e TODO 3 (service) ANTES de terminar
 * este arquivo -- e mais facil escrever a rota quando o
 * controller ja existe para apontar.
 * ============================================================
 */

 export const patientsRouter = Router();
 const patientsController = PatientController()
 
 patientsRouter.get("/", patientsController.create, patientsController.list);
 patientsRouter.get("/:id", patientsController.getById);
 patientsRouter.post("/", patientsController.create);


/**
 * ============================================================
 * TODO 13 (Encontro 2) -- Rota de upload de foto
 * ============================================================
 * So depois do TODO 12 (multer) pronto.
 *
 *   import { uploadPhoto } from "../middlewares/upload.ts";
 *   patientsRouter.post("/:id/photo", uploadPhoto.single("photo"), patientsController.uploadPhoto);
 * ============================================================
 */
