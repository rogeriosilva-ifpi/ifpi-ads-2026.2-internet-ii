/**
 * Upload de foto do paciente (Tópico 2) — as três defesas:
 *
 * 1. NOME GERADO PELO SERVIDOR — jamais o nome enviado pelo
 *    cliente. `../../etc/passwd.jpg` como filename é um ataque
 *    de path traversal; nome aleatório o desarma por completo.
 * 2. fileFilter por MIMETYPE (não por extensão — renomear
 *    virus.txt para foto.jpg não engana o filtro).
 * 3. Limite de tamanho (2MB) — o multer corta ANTES de encher o
 *    disco; o errorHandler traduz para 413.
 */
import { randomUUID } from "node:crypto";
import { extname } from "node:path";
import multer from "multer";
import { UnprocessableEntityError } from "../errors/HttpError";

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
]);

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_request, file, callback) => {
    // A extensão vem do MIMETYPE aceito, não do nome original.
    const extension = ALLOWED.get(file.mimetype) ?? extname(file.originalname);
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const uploadPhoto = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_request, file, callback) => {
    if (!ALLOWED.has(file.mimetype)) {
      callback(new UnprocessableEntityError("Apenas imagens JPEG ou PNG são aceitas."));
      return;
    }
    callback(null, true);
  },
});
