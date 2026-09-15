/**
 * ============================================================
 * TODO 9 (Encontro 2) -- Middleware central de erro
 * ============================================================
 * So depois do TODO 8 (HttpError) estar pronto.
 *
 * Um unico middleware de 4 argumentos (err, req, res, next) que:
 *   - se err for HttpError -> res.status(err.statusCode).json({ error: {...} })
 *   - senao -> console.error(err) + res.status(500).json({ error: {...} })
 *
 * Registre em server.ts com app.use(errorHandler) -- DEPOIS de
 * todas as rotas (veja o TODO 9 la no final de server.ts).
 * ============================================================
 */
