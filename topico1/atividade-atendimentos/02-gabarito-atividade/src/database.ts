/**
 * Conexao unica com o banco SQLite.
 *
 * Por que `better-sqlite3` e nao um ORM?
 * Porque nesta semana o objetivo e voce ENXERGAR o SQL que executa.
 * A biblioteca e sincrona: `db.prepare(...).all()` devolve o resultado
 * direto, sem callback e sem Promise. Isso simplifica muito o codigo agora.
 */
import Database from "better-sqlite3";
import { join } from "node:path";

export const DATABASE_FILE = join(process.cwd(), "database", "prontuario.db");

export const db = new Database(DATABASE_FILE);

// SQLite nao aplica chave estrangeira por padrao. Isso liga a verificacao.
db.pragma("foreign_keys = ON");
