import { useTasks, useTasksDispatch } from '../context/TasksContext';

// Usa os dois contextos: lê o estado e dispara ação.
export default function TaskFooter() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();
  const hasDone = tasks.some((t) => t.done);

  return (
    <footer className="footer">
      <button
        onClick={() => dispatch({ type: 'cleared_done' })}
        disabled={!hasDone}
      >
        Limpar concluídas
      </button>
    </footer>
  );
}
