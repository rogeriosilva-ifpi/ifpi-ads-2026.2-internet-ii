/**
 * Conexao unica com o banco SQLite.
 * JA PRONTO - mesmo padrao usado no Mini-Prontuario (Semana 01).
 */
import Database from "better-sqlite3";
import { join } from "node:path";

export const DATABASE_FILE = join(process.cwd(), "database", "prontuario.db");

export const db = new Database(DATABASE_FILE);
db.pragma("foreign_keys = ON");
