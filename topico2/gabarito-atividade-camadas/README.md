# Mini-Prontuário — Gabarito da Atividade

**Tópico 2, etapa avançada** — API REST profissional: arquitetura em camadas,
tratamento de erros, validação com Zod e upload de foto.

Este é o estado final esperado ao fim dos dois encontros, com os 3 níveis de
maestria resolvidos.

## Como rodar

```
npm install
npm run db:reset
npm run dev
```

Rode `requests.http` do início ao fim (blocos 1–15) para conferir.

## Nível 1 — Essencial

- Camadas: `src/routes/`, `src/controllers/`, `src/services/` (Patient e Encounter).
- Erros: hierarquia em `src/errors/HttpError.ts` + `src/middlewares/errorHandler.ts`,
  registrado por último em `server.ts`.
- Validação: `src/validation/patients.schemas.ts` (Zod) + `src/middlewares/validate.ts`,
  aplicados na rota de criação de paciente.

## Nível 2 — Proficiente

- Upload de foto: `src/middlewares/upload.ts` (multer — nome de arquivo gerado
  pelo servidor, filtro de MIME, limite de 2MB) + `patientsController.uploadPhoto`
  + `patientsService.setPhoto`.
- Frontend adaptado: `public/js/errors.js` (`renderApiError`), upload via
  `FormData` em `public/js/api.js`, preview local em `public/js/render.js` +
  `state.js` (`photoPreviews`), e envio disparado por delegação de evento em
  `public/js/app.js`.

## Nível 3 — Avançado (as duas opções, resolvidas)

### Opção A — Justificativa arquitetural

> Onde tracei a fronteira entre Controller e Service, com um exemplo real:

A regra "CNS duplicado não pode ser cadastrado" vive inteiramente em
`patientsService.create` (verifica duplicidade, decide o `ConflictError`),
não no Controller. Cheguei a considerar checar a duplicidade ainda na rota,
antes de chamar o Service — seria uma linha a menos no Service. Descartei
porque isso criaria duas fontes de verdade sobre "o que torna um cadastro de
paciente válido": uma no Controller (checagem de duplicidade) e outra no
Service (o resto da regra). Se um dia esse Service for chamado de outro
lugar (ex.: um script de importação em lote, sem passar por HTTP), a
checagem de duplicidade precisa vir junto — e só vem se estiver no Service,
não no Controller.

### Opção B — Auditoria de segurança do upload

**O que já está protegido:**
1. Nome do arquivo salvo é gerado pelo servidor (`crypto.randomUUID()`),
   nunca o nome enviado pelo cliente — elimina risco de *path traversal*.
2. `fileFilter` valida por `mimetype`, não só por extensão — um `.txt`
   renomeado para `.jpg` é rejeitado.
3. Limite de 2MB (`limits.fileSize`) evita que um upload grande consuma
   memória/disco do servidor.

**O que ainda NÃO está protegido (de propósito, até o item 4 da ementa):**
- **Não há autenticação nem autorização.** Qualquer pessoa que souber o `id`
  de um paciente pode enviar (ou sobrescrever) a foto dele — não há checagem
  de quem está fazendo a requisição. Isso é OWASP A01 (Broken Access
  Control) e só é aceitável porque o projeto ainda não tem login. Quando a
  autenticação existir, este endpoint precisa passar a exigir que quem
  chama tenha permissão sobre aquele paciente especificamente.
- **Não há verificação do conteúdo real do arquivo** (magic bytes) — só do
  `mimetype` declarado pelo cliente, que pode ser falsificado com mais
  esforço do que trocar a extensão. Mitigação adicional possível: checar a
  assinatura binária do arquivo antes de salvar.

## Testes realizados neste gabarito

- `tsc --noEmit`: sem erros.
- 11 requisições HTTP reais cobrindo sucesso e falha de Patient/Encounter:
  todas com o status code esperado (200/201/400/404/409).
- Upload de foto testado com: arquivo válido (200), tipo incorreto (422),
  paciente inexistente (404), sem arquivo (422), arquivo >2MB (413).
- Sintaxe de todos os módulos do frontend verificada (`node --check`).
