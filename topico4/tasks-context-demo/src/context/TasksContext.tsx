import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { Task, TaskAction } from '../types';
import { tasksReducer } from '../tasksReducer';
import { initialTasks } from '../initialTasks';

// 1) Criar os contextos — um para o ESTADO, outro para o DISPATCH.
//    Por que dois? Componentes que só disparam ações (AddTask, TaskActions)
//    não precisam re-renderizar quando a lista muda.
//    O genérico diz o tipo do valor; `| null` porque o padrão (sem Provider) é null.
const TasksContext = createContext<Task[] | null>(null);
const TasksDispatchContext = createContext<Dispatch<TaskAction> | null>(null);

type TasksProviderProps = {
  children: ReactNode;
};

// 2) Encapsular reducer + providers num único componente.
export function TasksProvider({ children }: TasksProviderProps) {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  // React 19: o próprio Context é o provider.
  // (Em React 18 ou anterior: <TasksContext.Provider value={tasks}>)
  return (
    <TasksContext value={tasks}>
      <TasksDispatchContext value={dispatch}>
        {children}
      </TasksDispatchContext>
    </TasksContext>
  );
}

// 3) Hooks customizados — o resto do app nem sabe que existe Context.
//    Eles também "estreitam" o tipo: retornam Task[] (sem o null).
export function useTasks(): Task[] {
  const tasks = useContext(TasksContext);
  if (tasks === null) {
    throw new Error('useTasks() precisa estar dentro de <TasksProvider>');
  }
  return tasks;
}

export function useTasksDispatch(): Dispatch<TaskAction> {
  const dispatch = useContext(TasksDispatchContext);
  if (dispatch === null) {
    throw new Error('useTasksDispatch() precisa estar dentro de <TasksProvider>');
  }
  return dispatch;
}
