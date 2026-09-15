# repositories/ — a pasta que a trilha ARQ vai povoar

Hoje ela está vazia de propósito. O SQL mora nos services — e é
exatamente essa mistura ("decidir" + "buscar") que a trilha ARQ
desfaz.

Cada recurso ganhará um arquivo aqui com **duas coisas**:

1. A **interface** (o *port*): `PatientsRepository`,
   `EncountersRepository`, `MedicationsRepository` — o contrato
   que o service enxerga.
2. A **implementação SQLite** (o *adapter*):
   `SqlitePatientsRepository` etc. — o único lugar do sistema que
   pode importar `src/database`.

Na trilha ORM, cada adapter ganha um irmão gêmeo em Prisma — e a
prova de que a arquitetura funcionou é o service **não perceber a
troca**.

Quando esta pasta existir, feche a trilha com o TODO ARQ-6:
a checagem de arquitetura (`.dependency-cruiser.cjs`) ganha a
regra que torna esta fronteira permanente.
