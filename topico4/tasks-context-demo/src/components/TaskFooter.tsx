import type { Task } from '../types';

type TaskFooterProps = {
  tasks: Task[];
  onClearDone: () => void;
};

// ✅ Usa tasks (para saber se há concluídas) e onClearDone
export default function TaskFooter({ tasks, onClearDone }: TaskFooterProps) {
  const hasDone = tasks.some((t) => t.done);
  return (
    <footer className="footer">
      <button onClick={onClearDone} disabled={!hasDone}>
        Limpar concluídas
      </button>
    </footer>
  );
}
