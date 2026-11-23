import type { Task } from '../types';
import TaskCounter from './TaskCounter';

type HeaderProps = {
  tasks: Task[]; // 🚚 só para repassar
};

// 🚚 Header só RECEBE e REPASSA `tasks`. Ele mesmo não usa.
export default function Header({ tasks }: HeaderProps) {
  return (
    <header className="header">
      <h1>📋 Minhas Tarefas</h1>
      <TaskCounter tasks={tasks} />
    </header>
  );
}
