import type { Task } from '../types';
import { useTasksDispatch } from '../context/TasksContext';

type TaskActionsProps = {
  task: Task;
  isEditing: boolean;
  onToggleEdit: () => void;
};

// Antes: onDeleteTask atravessava 4 componentes (e 4 tipos de props).
// Agora: pega o dispatch direto do contexto.
export default function TaskActions({ task, isEditing, onToggleEdit }: TaskActionsProps) {
  const dispatch = useTasksDispatch();

  return (
    <div className="actions">
      <button onClick={onToggleEdit}>{isEditing ? 'Salvar' : 'Editar'}</button>
      <button
        className="danger"
        onClick={() => dispatch({ type: 'deleted', id: task.id })}
      >
        Excluir
      </button>
    </div>
  );
}
