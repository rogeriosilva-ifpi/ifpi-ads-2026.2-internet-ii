import { useTasks } from '../context/TasksContext';

// Pega `tasks` direto do contexto (já tipado como Task[]).
export default function TaskCounter() {
  const tasks = useTasks();
  const done = tasks.filter((t) => t.done).length;
  return (
    <span className="counter">
      {done} de {tasks.length} concluídas
    </span>
  );
}
