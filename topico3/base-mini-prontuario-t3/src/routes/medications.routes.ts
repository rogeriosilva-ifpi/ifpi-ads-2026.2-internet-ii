/**
 * Rotas de MedicationRequest, aninhadas em
 * /api/encounters/:encounterId/medications.
 */
import { Router } from "express";
import * as medicationsController from "../controllers/medications.controller";
import { validate } from "../middlewares/validate";
import { createMedicationSchema } from "../validation/medications.schemas";

export const medicationsRouter = Router({ mergeParams: true });

medicationsRouter.get("/", medicationsController.listByEncounter);
medicationsRouter.post("/", validate(createMedicationSchema), medicationsController.create);
