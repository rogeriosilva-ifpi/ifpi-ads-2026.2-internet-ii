/**
 * Controller de Patient -- traduz HTTP <-> dominio.
 * Erros lancados pelo Service sobem sozinhos ate o errorHandler
 * (Express 5 captura automaticamente, mesmo em handlers async).
 */
import type { Request, Response } from "express";
import { patientsService } from "../services/patients.service.ts";
import { UnprocessableEntityError } from "../errors/HttpError.ts";

export const patientsController = {
  list(_request: Request, response: Response) {
    response.status(200).json(patientsService.list());
  },

  getById(request: Request, response: Response) {
    const patient = patientsService.getById(request.params.id as string);
    response.status(200).json(patient);
  },

  create(request: Request, response: Response) {
    const patient = patientsService.create(request.body);
    response.status(201).json(patient);
  },

  uploadPhoto(request: Request, response: Response) {
    if (!request.file) {
      throw new UnprocessableEntityError("Nenhum arquivo de foto foi enviado.");
    }

    const patient = patientsService.setPhoto(request.params.id as string, request.file.filename);
    response.status(200).json(patient);
  },
};
