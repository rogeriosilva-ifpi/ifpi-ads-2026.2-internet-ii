/**
 * ============================================================
 * TODO 12 (Encontro 2) -- Configuracao do multer
 * ============================================================
 * multer.diskStorage: destino "uploads/", nome de arquivo GERADO
 * pelo servidor (nunca o nome original do cliente -- e o que
 * previne path traversal).
 *
 * fileFilter: so aceitar image/jpeg e image/png.
 * limits.fileSize: 2 * 1024 * 1024 (2MB).
 *
 * export const uploadPhoto = multer({ storage, limits, fileFilter });
 * ============================================================
 */
