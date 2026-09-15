# Painel de Medicação — GABARITO

Implementação completa das 4 operações (listar, criar, obter um, remover) sobre SQLite.

## Rodar

```bash
npm install
npm run db:reset
npm run dev
```

## O que testar

- `requests.http` — 10 casos, incluindo 3 falhas propositais (sem campo obrigatório, data mal formatada, id inexistente)
- Persistência real: cadastre algo, reinicie o servidor (`Ctrl+C` + `npm run dev`), confirme que continua lá
- Frontend: lista reativa, formulário sem recarregar página, clique no cartão abre detalhe via nova chamada à API, botão "Suspender" remove e atualiza a tela

## Uso deste gabarito

Não compartilhar com os alunos antes do fim da atividade. Use para corrigir e para responder dúvidas específicas durante o laboratório.
