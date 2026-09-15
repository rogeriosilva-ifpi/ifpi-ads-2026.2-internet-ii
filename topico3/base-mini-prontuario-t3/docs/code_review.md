# Revisão adversarial — roteiro da casa

Use com `/code-review` (ou peça a um agente em **contexto novo**:
o revisor é melhor *por saber menos* — ele não herda as
justificativas da sessão que escreveu o código).

## O que o revisor procura, nesta ordem
1. **Escopo** — o diff toca só o que a tarefa pedia? Arquivo
   inesperado é o sinal nº 1 de sessão fora do trilho.
   (`git diff --stat main`)
2. **Invariantes** — algum item do INVARIANTES.md foi tocado?
   Se sim, para tudo e discute. Não existe "só desta vez".
3. **Fronteiras** — regra de negócio vazou para controller/rota?
   SQL fora de service/repository? `res` dentro de service?
4. **Erros** — algum `res.status().json({error})` manual fora do
   errorHandler? Erro engolido em catch vazio?
5. **Segurança da semana** — SQL parametrizado? Senha sempre
   hasheada antes de tocar o banco? Nada sensível no payload do
   JWT? Segredo fora do código?

## Triagem dos achados (quem decide é o humano)
| Veredito | Quando |
|---|---|
| Aceitar | Aponta defeito real ou risco concreto |
| Perguntar | Não dá para julgar sem contexto — investigue antes |
| Recusar | Estilo, gosto, ou camada extra "para ficar profissional" |

Metade dos achados de um revisor-IA é ruído por obediência.
Taxa saudável de aceitação: **30–60%**. Recusar com justificativa
é senioridade — registre 1 recusa no IA.md a cada revisão.
