-- ============================================================
-- Mini-Prontuário T3 — Esquema do banco (estado de chegada)
-- Vocabulário inspirado em HL7 FHIR:
--   Patient, Encounter, MedicationRequest
--
-- ATENÇÃO (invariante OP-1): a partir da trilha ORM, TODA
-- mudança de esquema passa a ser feita por migration do Prisma.
-- Este arquivo vira histórico — não o edite depois disso.
-- ============================================================

-- A ordem do DROP importa: filho antes do pai (chave estrangeira).
DROP TABLE IF EXISTS medication_requests;
DROP TABLE IF EXISTS encounters;
DROP TABLE IF EXISTS patients;

-- ------------------------------------------------------------
-- patients  ->  o paciente cadastrado no prontuário
-- ------------------------------------------------------------
CREATE TABLE patients (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  birth_date  TEXT    NOT NULL,            -- ISO 8601: AAAA-MM-DD
  national_id TEXT    NOT NULL UNIQUE,     -- Cartão Nacional de Saúde (CNS) — invariante N1
  photo_url   TEXT,                        -- caminho servido em /uploads (Tópico 2)
  active      INTEGER NOT NULL DEFAULT 1   -- SQLite não tem BOOLEAN: 0 ou 1
);

-- ------------------------------------------------------------
-- encounters  ->  o atendimento registrado para um paciente
-- ------------------------------------------------------------
CREATE TABLE encounters (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id      INTEGER NOT NULL,
  started_at      TEXT    NOT NULL,          -- ISO 8601: AAAA-MM-DDTHH:MM
  chief_complaint TEXT    NOT NULL,          -- queixa principal
  notes           TEXT,                      -- conduta (opcional)
  -- professional_id chega na trilha AUTH (via migration!): quem registrou
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

CREATE INDEX idx_encounters_patient ON encounters(patient_id);

-- ------------------------------------------------------------
-- medication_requests  ->  a prescrição feita em um atendimento
-- (no FHIR real: MedicationRequest)
-- ------------------------------------------------------------
CREATE TABLE medication_requests (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  encounter_id INTEGER NOT NULL,
  medication   TEXT    NOT NULL,             -- ex.: "Dipirona 500mg"
  dosage       TEXT    NOT NULL,             -- ex.: "1 comprimido de 6/6h por 3 dias"
  FOREIGN KEY (encounter_id) REFERENCES encounters(id) ON DELETE CASCADE
);

CREATE INDEX idx_medreq_encounter ON medication_requests(encounter_id);
