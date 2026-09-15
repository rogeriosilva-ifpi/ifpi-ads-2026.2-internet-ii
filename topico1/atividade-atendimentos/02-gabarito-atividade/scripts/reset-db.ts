/**
 * Recria o banco do zero: apaga as tabelas, cria de novo e insere os dados de teste.
 * Uso:  npm run db:reset
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db, DATABASE_FILE } from "../src/database";

const schema = readFileSync(join(process.cwd(), "database", "schema.sql"), "utf8");
const seed = readFileSync(join(process.cwd(), "database", "seed.sql"), "utf8");

db.exec(schema);
db.exec(seed);

const total = db.prepare("SELECT COUNT(*) AS total FROM patients").get() as { total: number };

console.log(`Banco recriado em ${DATABASE_FILE}`);
console.log(`Pacientes inseridos: ${total.total}`);
