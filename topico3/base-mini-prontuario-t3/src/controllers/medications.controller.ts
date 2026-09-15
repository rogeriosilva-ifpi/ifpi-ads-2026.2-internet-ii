/**
 * Controller de MedicationRequest.
 */
import type { Request, Response } from "express";
import * as medicationsService from "../services/medications.service";

export function listByEncounter(request: Request, response: Response) {
  const medications = medicationsService.listMedicationsByEncounter(request);
  response.status(200).json(medications);
}

export function create(request: Request, response: Response) {
  const created = medicationsService.createMedication(
    Number(request.params.encounterId),
    request.body,
  );
  response.status(201).json(created);
}
