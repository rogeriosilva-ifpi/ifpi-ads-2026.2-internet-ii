/**
 * Conexão única com o banco SQLite (better-sqlite3).
 *
 * Este arquivo é INFRAESTRUTURA. Pela Regra da Dependência, só a
 * borda do sistema pode conhecê-lo — hoje, os Services (e, depois
 * da trilha ARQ, apenas os Repositories).
 *
 * Na trilha ORM ele será aposentado em favor do Prisma Client —
 * e, se a arquitetura estiver certa, NENHUM service perceberá.
 */
import Database from "better-sqlite3";
import { join } from "node:path";

export const DATABASE_FILE = join(process.cwd(), "database", "prontuario.db");

export const db = new Database(DATABASE_FILE);

// SQLite não aplica chave estrangeira por padrão. Isso liga a verificação.
db.pragma("foreign_keys = ON");
