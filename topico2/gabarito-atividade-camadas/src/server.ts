/**
 * ============================================================
 * Mini-Prontuario - Servidor HTTP
 * ============================================================
 * SOLUCAO -- Encontro 2 (Erros, Validacao, Upload)
 *
 * O errorHandler e registrado por ULTIMO -- depois de todas as
 * rotas. Express so o identifica como error handler por ter
 * exatamente 4 parametros (err, req, res, next).
 * ============================================================
 */
import express from "express";
import { patientsRouter } from "./routes/patients.routes.ts";
import { encountersRouter } from "./routes/encounters.routes.ts";
import { errorHandler } from "./middlewares/errorHandler.ts";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api/patients", patientsRouter);
app.use("/api/patients/:id/encounters", encountersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Mini-Prontuario no ar em http://localhost:${PORT}`);
});
