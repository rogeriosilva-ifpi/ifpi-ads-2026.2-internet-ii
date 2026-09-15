/**
 * Controller de Encounter -- traduz HTTP <-> dominio.
 */
import type { Request, Response } from "express";
import { encountersService } from "../services/encounters.service.ts";

export const encountersController = {
  list(request: Request, response: Response) {
    const encounters = encountersService.list(request.params.id as string);
    response.status(200).json(encounters);
  },

  create(request: Request, response: Response) {
    const encounter = encountersService.create(request.params.id as string, request.body);
    response.status(201).json(encounter);
  },
};
