/**
 * Controller de Encounter.
 */
import type { Request, Response } from "express";
import { db } from "../database";
import { NotFoundError } from "../errors/HttpError";
import * as encountersService from "../services/encounters.service";

export function listByPatient(request: Request, response: Response) {
  // Checagem rápida de existência antes de chamar o service.
  const exists = db
    .prepare("SELECT 1 FROM patients WHERE id = ?")
    .get(request.params.id);
  if (!exists) {
    throw new NotFoundError("Paciente não encontrado.");
  }

  const encounters = encountersService.listEncountersByPatient(Number(request.params.id));
  response.status(200).json(encounters);
}

export function create(request: Request, response: Response) {
  const created = encountersService.createEncounter(
    Number(request.params.id),
    request.body,
  );
  response.status(201).json(created);
}
