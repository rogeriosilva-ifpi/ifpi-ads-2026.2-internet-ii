/**
 * ============================================================
 * TRILHA AUTH — o guarda na porta
 * ------------------------------------------------------------
 * Na Arquitetura Hexagonal, este arquivo é um ADAPTER DE ENTRADA:
 * o guarda fica na PORTA (middleware), nunca dentro da cozinha
 * (service). O service recebe "quem é o usuário" já resolvido.
 * ============================================================
 */
import type { NextFunction, Request, Response } from "express";

/** O que o token comprova sobre quem chamou. */
export type AuthenticatedUser = {
  id: number;
  name: string;
  role: "admin" | "profissional" | "recepcao";
};

// Anexamos o usuário autenticado ao Request para os controllers lerem.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

/* ------------------------------------------------------------
   TODO AUTH-5 — requireAuth (autenticação: QUEM é você?)
   ------------------------------------------------------------
   Implemente o middleware `requireAuth`:
   1. Leia o header `Authorization`. Formato esperado:
      "Bearer <token>". Sem header ou formato errado ->
      lance UnauthorizedError (401).
   2. Verifique o token com jwt.verify(token, JWT_SECRET).
      Token adulterado ou expirado -> UnauthorizedError (401).
      (jwt.verify LANÇA nesses casos — capture e traduza.)
   3. Coloque o payload em `request.user` e chame next().

   Segredo: process.env.JWT_SECRET — vem do .env (invariante OP-2:
   segredo NUNCA hardcoded, NUNCA commitado).
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   TODO AUTH-6 — (parte NÃO guiada da atividade)
   ------------------------------------------------------------
   A Apresentação de Condução para aqui de propósito.
   Você tem a matriz de permissões e os testes de ataque que
   precisam passar (requests.http, seção AUTH). Descubra o que
   falta construir aqui — e onde aplicá-lo.
   ------------------------------------------------------------ */
