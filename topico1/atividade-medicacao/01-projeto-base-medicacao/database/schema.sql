-- ============================================================
-- Painel de Medicacao - Esquema do banco
-- JA PRONTO - voce nao precisa mexer aqui nesta atividade.
-- ============================================================

DROP TABLE IF EXISTS medication_orders;

CREATE TABLE medication_orders (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_name   TEXT    NOT NULL,
  medication_name TEXT   NOT NULL,
  dosage         TEXT    NOT NULL,
  route          TEXT    NOT NULL,            -- "Oral", "Intravenosa", "Intramuscular"
  scheduled_at   TEXT    NOT NULL,             -- ISO 8601: AAAA-MM-DDTHH:MM
  notes          TEXT                          -- observacoes, opcional
);
