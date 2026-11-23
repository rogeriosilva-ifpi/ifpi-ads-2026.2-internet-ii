# Tasks · Context API (demo de aula)

Projeto de demonstração da aula **React Context API** — IFPI.
O mesmo app de tarefas, em **TypeScript**, em etapas, uma por **branch**:

| Branch | O que mostra |
|---|---|
| `01-props-drilling` | **Antes.** Estado no `App` e tudo descendo por props até 4 níveis. |
| `02-context-api` | **Depois.** `useReducer` + 2 Contexts (`state` e `dispatch`) + `TasksProvider` + hooks `useTasks()` / `useTasksDispatch()`. |
| `03-bonus-theme` | **Bônus.** Um segundo contexto simples (tema claro/escuro) convivendo com o de tarefas. |

> `main` = ponto de partida (igual a `01-props-drilling`).

## Rodando

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run typecheck  # só a checagem de tipos (tsc)
npm run build      # typecheck + build de produção
```

## TypeScript: o que observar

- `src/types.ts` define `Task` e `TaskAction` (união discriminada). Dentro de cada `case` do reducer o TS sabe exatamente quais campos a ação tem.
- O `default` do reducer usa `never`: se alguém criar uma ação nova e esquecer o `case`, o projeto não compila.
- Na branch 01, repare quantas vezes o tipo `(taskId: number) => void` de `onDeleteTask` é declarado só para repassar. **Em TS o props drilling dói em dobro.**
- Na branch 02, os contextos são tipados com `createContext<Task[] | null>(null)` e `createContext<Dispatch<TaskAction> | null>(null)`. Os hooks `useTasks()` e `useTasksDispatch()` eliminam o `null`, então quem consome recebe o tipo limpo.

## Roteiro sugerido em sala

```bash
git checkout 01-props-drilling      # 1. mostre o problema
#   procure os comentários 🚚 — componentes que só repassam props

git diff 01-props-drilling 02-context-api --stat   # 2. o que mudou
git checkout 02-context-api         # 3. mostre a solução
#   abra src/context/TasksContext.tsx

git checkout 03-bonus-theme         # 4. (opcional) segundo contexto
```

## Árvore de componentes

```
App
├── Header
│   └── TaskCounter          ← usa tasks
└── TaskBoard
    ├── AddTask              ← usa onAddTask / dispatch
    ├── TaskList             ← usa tasks
    │   └── TaskItem         ← usa onChangeTask / dispatch
    │       └── TaskActions  ← usa onDeleteTask / dispatch
    └── TaskFooter           ← usa tasks + onClearDone / dispatch
```

Na branch 01, `Header`, `TaskBoard`, `TaskList` e `TaskItem` recebem props que **não usam**, só repassam.
Na branch 02, cada componente pede ao contexto apenas o que precisa.

## Exercícios para os alunos

1. Na branch 01, adicione um botão "Marcar todas" no `Header`. Conte quantos arquivos precisou alterar.
2. Faça o mesmo na branch 02 e compare.
3. Crie um `FilterContext` (todas / pendentes / concluídas) consumido por `TaskList` e por um novo `FilterBar`.
4. Remova o `<TasksProvider>` do `App` e veja a mensagem de erro do hook `useTasks()`. Por que ela é útil?
5. Adicione a ação `{ type: 'toggled_all' }` em `TaskAction` **sem** criar o `case` no reducer. Leia o erro do `tsc`. Depois implemente.
