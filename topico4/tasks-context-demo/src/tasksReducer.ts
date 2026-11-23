import type { Task, TaskAction } from './types';

// Reducer: função PURA (state, action) => novoState
// Ela não sabe nada de componentes, nem de Context. Só de tarefas.
export function tasksReducer(tasks: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'added':
      return [...tasks, { id: action.id, text: action.text, done: false }];

    case 'changed':
      return tasks.map((t) => (t.id === action.task.id ? action.task : t));

    case 'deleted':
      return tasks.filter((t) => t.id !== action.id);

    case 'cleared_done':
      return tasks.filter((t) => !t.done);

    default: {
      // Se alguém criar uma ação nova e esquecer o `case`, isto não compila.
      const unknownAction: never = action;
      throw new Error('Ação desconhecida: ' + JSON.stringify(unknownAction));
    }
  }
}
