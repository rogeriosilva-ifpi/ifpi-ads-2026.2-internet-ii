/**
 * Controller de Patient — o TRADUTOR entre HTTP e domínio.
 * Ele lê o `req`, chama o service e formata o `res`. Só.
 * Se um controller começa a ter `if` de regra de negócio ou SQL,
 * a fronteira vazou.
 */
import type { Request, Response } from "express";
import { UnprocessableEntityError } from "../errors/HttpError";
import * as patientsService from "../services/patients.service";

export function list(_request: Request, response: Response) {
  response.status(200).json(patientsService.listPatients());
}

export function getById(request: Request, response: Response) {
  const patient = patientsService.getPatientById(Number(request.params.id));
  response.status(200).json(patient);
}

export function create(request: Request, response: Response) {
  // O body chega VALIDADO — o middleware validate(createPatientSchema)
  // rodou antes. Controller não revalida: confia na esteira.
  const created = patientsService.createPatient(request.body);
  // 201 + o recurso criado com o id que o banco gerou.
  response.status(201).json(created);
}

export function uploadPhoto(request: Request, response: Response) {
  // O multer só popula request.file quando o campo "photo" veio.
  if (!request.file) {
    throw new UnprocessableEntityError("Envie o arquivo no campo 'photo'.");
  }

  const updated = patientsService.setPatientPhoto(
    Number(request.params.id),
    `/uploads/${request.file.filename}`,
  );
  response.status(200).json(updated);
}
