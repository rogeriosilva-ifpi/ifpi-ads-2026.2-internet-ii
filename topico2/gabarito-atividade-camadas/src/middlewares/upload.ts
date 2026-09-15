/**
 * Configuracao do multer para upload de foto de paciente.
 *
 * Tres decisões de segurança deliberadas:
 *   1. O nome do arquivo salvo é gerado pelo servidor
 *      (crypto.randomUUID()) -- nunca o nome original enviado
 *      pelo cliente. Isso é o que evita path traversal.
 *   2. fileFilter aceita só image/jpeg e image/png -- por MIME,
 *      não por extensão (um .txt renomeado para .jpg tem extensão
 *      certa mas mimetype errado).
 *   3. Limite de tamanho de 2MB evita que um upload gigante
 *      consuma memória/disco do servidor.
 */
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import multer from "multer";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png"];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, "uploads/");
  },
  filename: (_request, file, callback) => {
    callback(null, `${randomUUID()}${extname(file.originalname)}`);
  },
});

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_request, file, callback) => {
    callback(null, ALLOWED_MIME_TYPES.includes(file.mimetype));
  },
});
