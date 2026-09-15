-- Dados ficticios. Nenhum dado real de paciente pode entrar aqui.

INSERT INTO patients (name, birth_date, national_id, active) VALUES
  ('Maria da Conceicao Silva',   '1978-03-14', '700000000000001', 1),
  ('Joao Pedro Alves Santos',    '1990-07-22', '700000000000002', 1),
  ('Francisca das Chagas Souza', '1965-11-02', '700000000000003', 1),
  ('Antonio Carlos Ferreira',    '2001-01-30', '700000000000004', 0),
  ('Raimunda Nonata Costa',      '1988-05-19', '700000000000005', 1);

INSERT INTO encounters (patient_id, started_at, chief_complaint, notes) VALUES
  (1, '2026-08-03T08:15', 'Cefaleia ha tres dias',        'Orientada hidratacao. Retorno em 7 dias.'),
  (1, '2026-08-10T14:40', 'Retorno - cefaleia',           'Melhora do quadro. Alta.'),
  (2, '2026-07-29T10:05', 'Dor lombar apos esforco',      'Repouso relativo e analgesia.'),
  (3, '2026-08-11T09:00', 'Controle de pressao arterial', 'PA 130x80. Mantida a medicacao.'),
  (5, '2026-08-12T16:20', 'Tosse seca persistente',       NULL);
