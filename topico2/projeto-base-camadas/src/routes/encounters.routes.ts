/**
 * ============================================================
 * TODO 4 -- Rotas de Encounter
 * ============================================================
 * As rotas de encounter sao aninhadas em patient
 * (/api/patients/:id/encounters). Migre as 2 rotas que estao em
 * server.ts:
 *   GET   /   -> encountersController.list
 *   POST  /   -> encountersController.create
 *
 * Dica: este router e montado em server.ts com
 *   app.use("/api/patients/:id/encounters", encountersRouter)
 * entao aqui dentro os paths sao so "/".
 *
 *   import { Router } from "express";
 *   import { encountersController } from "../controllers/encounters.controller.ts";
 *
 *   export const encountersRouter = Router({ mergeParams: true });
 *   encountersRouter.get("/", encountersController.list);
 *   encountersRouter.post("/", encountersController.create);
 *
 * `mergeParams: true` e essencial: sem isso, req.params.id (o id
 * do paciente) nao chega ate aqui.
 * ============================================================
 */
