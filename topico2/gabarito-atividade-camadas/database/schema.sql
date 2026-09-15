-- ============================================================
-- Mini-Prontuario - Esquema do banco
-- Vocabulario inspirado em HL7 FHIR (Patient, Encounter)
--
-- Este arquivo ja vem PRONTO. Nao ha TODO aqui: a etapa desta
-- semana e sobre arquitetura, erros, validacao e upload -- nao
-- sobre desenho de banco.
-- ============================================================

DROP TABLE IF EXISTS encounters;
DROP TABLE IF EXISTS patients;

-- ------------------------------------------------------------
-- patients  ->  o paciente cadastrado no prontuario
-- ------------------------------------------------------------
CREATE TABLE patients (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  birth_date  TEXT    NOT NULL,            -- ISO 8601: AAAA-MM-DD
  national_id TEXT    NOT NULL UNIQUE,     -- Cartao Nacional de Saude (CNS)
  active      INTEGER NOT NULL DEFAULT 1,  -- SQLite nao tem BOOLEAN: 0 ou 1
  photo_path  TEXT                         -- caminho da foto (ex.: /uploads/xxx.jpg)
                                            -- usado a partir do Encontro 2 (upload)
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
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Sem indice, o SQLite varre a tabela toda a cada listagem de
-- atendimentos de um paciente.
CREATE INDEX idx_encounters_patient ON encounters(patient_id);
