export type Task = {
  id: number;
  text: string;
  done: boolean;
};

// União discriminada: o campo `type` diz qual formato a ação tem.
// O TypeScript usa isso para saber, dentro de cada `case`, quais campos existem.
export type TaskAction =
  | { type: 'added'; id: number; text: string }
  | { type: 'changed'; task: Task }
  | { type: 'deleted'; id: number }
  | { type: 'cleared_done' };
