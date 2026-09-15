# prisma/ — a pasta que a trilha ORM vai povoar

O Prisma já está instalado (`prisma` + `@prisma/client`), mas o
`schema.prisma` é tarefa sua (TODO ORM-1..2):

1. `npx prisma init --datasource-provider sqlite` (ajuste o
   `DATABASE_URL` no `.env` — veja `.env.example`).
2. `npx prisma db pull` — o Prisma lê o banco existente e escreve
   os models. Repare: ele fala `snake_case`, como o banco.
3. Renomeie models e campos para o padrão da API com `@@map` /
   `@map` (ex.: model `Patient` ↦ tabela `patients`,
   campo `birthDate` ↦ coluna `birth_date`).
4. `npx prisma generate` e reimplemente os repositories mantendo
   a MESMA interface — o service não pode perceber a troca.
5. Marque a baseline de migrations conforme visto em aula; a
   partir daí vale o invariante OP-1 (esquema só muda por
   migration — a tabela `users` da trilha AUTH nasce assim).
