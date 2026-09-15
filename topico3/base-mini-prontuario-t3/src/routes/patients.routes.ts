/**
 * Rotas de Patient — a camada que só ROTEIA.
 * Método + caminho + esteira de middlewares + controller. Nada mais.
 *
 * TODO AUTH-7 — (parte NÃO guiada) a matriz de permissões diz
 * quem pode passar por cada porta. Aplique-a aqui quando o que
 * falta no middlewares/auth.ts existir.
 */
import { Router } from "express";
import * as patientsController from "../controllers/patients.controller";
import { validate } from "../middlewares/validate";
import { uploadPhoto } from "../middlewares/upload";
import { createPatientSchema } from "../validation/patients.schemas";

export const patientsRouter = Router();

patientsRouter.get("/", patientsController.list);
patientsRouter.get("/:id", patientsController.getById);
patientsRouter.post("/", validate(createPatientSchema), patientsController.create);
patientsRouter.post("/:id/photo", uploadPhoto.single("photo"), patientsController.uploadPhoto);
