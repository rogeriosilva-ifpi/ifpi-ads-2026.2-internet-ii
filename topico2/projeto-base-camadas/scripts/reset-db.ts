/**
 * Recria o banco do zero a partir de schema.sql + seed.sql.
 * Rode com: npm run db:reset
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { db } from "../src/db/database.ts";

const schema = readFileSync(join(process.cwd(), "database", "schema.sql"), "utf-8");
const seed = readFileSync(join(process.cwd(), "database", "seed.sql"), "utf-8");

db.exec(schema);
db.exec(seed);

console.log("Banco recriado com sucesso: database/prontuario.db");
