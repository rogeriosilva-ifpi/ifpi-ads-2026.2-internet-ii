/**
 * Sobe o app real numa porta efêmera (porta 0 = o SO escolhe uma
 * livre) e devolve uma função `api()` para chamar a API com o
 * fetch nativo do Node. Nenhum mock: é o servidor de verdade.
 */
import type { Server } from "node:http";
import { app } from "../src/app";

export async function startServer(): Promise<{ base: string; server: Server }> {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : 0;
      resolve({ base: `http://127.0.0.1:${port}`, server });
    });
  });
}

export function jsonRequest(base: string) {
  return (path: string, options: RequestInit = {}) =>
    fetch(`${base}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    });
}

/** CNS aleatório para os testes não colidirem entre execuções. */
export function randomCns(): string {
  return `7${Math.floor(Math.random() * 1e14).toString().padStart(14, "0")}`;
}
