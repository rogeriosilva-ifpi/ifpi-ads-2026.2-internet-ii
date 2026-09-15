import { Router, Request, Response, NextFunction } from "express";
import { patientsController } from "../controllers/patients.controller.ts";
import { validate } from "../middlewares/validate.ts";
import { createPatientSchema } from "../validation/patients.schemas.ts";
import { uploadPhoto } from "../middlewares/upload.ts";
import { BadRequestError } from "../errors/HttpError.ts";

export const patientsRouter = Router();


patientsRouter.get("/", patientsController.list);
patientsRouter.get("/:id", patientsController.getById);
patientsRouter.post("/", validate(createPatientSchema), patientsController.create);
patientsRouter.post("/:id/photo", uploadPhoto.single("photo"), patientsController.uploadPhoto);
