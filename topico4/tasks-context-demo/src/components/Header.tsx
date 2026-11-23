import TaskCounter from './TaskCounter';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="header">
      <h1>📋 Minhas Tarefas</h1>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <TaskCounter />
        <ThemeToggle />
      </div>
    </header>
  );
}
