/**
 * Rotas de Encounter, aninhadas em /api/patients/:id/encounters.
 *
 * `mergeParams: true` é o detalhe que ninguém esquece duas vezes:
 * sem ele, o `:id` do router pai não chega em `req.params` aqui.
 */
import { Router } from "express";
import * as encountersController from "../controllers/encounters.controller";
import { validate } from "../middlewares/validate";
import { createEncounterSchema } from "../validation/encounters.schemas";

export const encountersRouter = Router({ mergeParams: true });

encountersRouter.get("/", encountersController.listByPatient);
encountersRouter.post("/", validate(createEncounterSchema), encountersController.create);
