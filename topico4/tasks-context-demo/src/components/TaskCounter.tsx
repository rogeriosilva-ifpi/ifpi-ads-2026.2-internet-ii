import type { Task } from '../types';

type TaskCounterProps = {
  tasks: Task[];
};

// ✅ Este é quem realmente PRECISA de `tasks`.
export default function TaskCounter({ tasks }: TaskCounterProps) {
  const done = tasks.filter((t) => t.done).length;
  return (
    <span className="counter">
      {done} de {tasks.length} concluídas
    </span>
  );
}
