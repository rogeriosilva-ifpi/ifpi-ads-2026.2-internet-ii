import TaskCounter from './TaskCounter';

// Header não recebe mais props que não usa (e não precisa de tipo de props).
export default function Header() {
  return (
    <header className="header">
      <h1>📋 Minhas Tarefas</h1>
      <TaskCounter />
    </header>
  );
}
