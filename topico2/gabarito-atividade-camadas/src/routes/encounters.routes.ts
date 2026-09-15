import { Router } from "express";
import { encountersController } from "../controllers/encounters.controller.ts";

// mergeParams: true e essencial -- sem isso, req.params.id (o id
// do paciente, definido em server.ts) nao chega ate aqui.
export const encountersRouter = Router({ mergeParams: true });

encountersRouter.get("/", encountersController.list);
encountersRouter.post("/", encountersController.create);
