-- Dados ficticios. Nenhum dado real de paciente pode entrar aqui.
INSERT INTO patients (name, birth_date, national_id, active) VALUES
  ('Ana Beatriz Nogueira',   '1991-03-14', '700012345678901', 1),
  ('Carlos Eduardo Matias',  '1978-11-02', '700012345678902', 1),
  ('Dulcineia Rocha Lima',   '1955-07-23', '700012345678903', 1),
  ('Eduardo Vasconcelos',    '2003-01-09', '700012345678904', 0),
  ('Fernanda Passos Alves',  '1986-09-30', '700012345678905', 1),
  ('Gustavo Rios Camelo',    '1999-05-17', '700012345678906', 1),
  ('Helena Marques Sa',      '1968-12-05', '700012345678907', 0),
  ('Igor Bastos Teixeira',   '1994-08-21', '700012345678908', 1);

INSERT INTO encounters (patient_id, started_at, chief_complaint, notes) VALUES
  (1, '2026-08-03T08:15', 'Cefaleia ha tres dias',        'Orientada hidratacao. Retorno em 7 dias.'),
  (1, '2026-08-10T14:40', 'Retorno - cefaleia',           'Melhora do quadro. Alta.'),
  (2, '2026-07-29T10:05', 'Dor lombar apos esforco',      'Repouso relativo e analgesia.'),
  (3, '2026-08-11T09:00', 'Controle de pressao arterial', 'PA 130x80. Mantida a medicacao.'),
  (5, '2026-08-12T16:20', 'Tosse seca persistente',       NULL);
