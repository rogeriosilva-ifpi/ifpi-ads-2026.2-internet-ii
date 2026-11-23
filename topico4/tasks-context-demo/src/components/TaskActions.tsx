import type { Task } from '../types';

type TaskActionsProps = {
  task: Task;
  isEditing: boolean;
  onToggleEdit: () => void;
  onDeleteTask: (taskId: number) => void;
};

// ✅ Finalmente alguém usa onDeleteTask!
//    Caminho percorrido: App → TaskBoard → TaskList → TaskItem → TaskActions
//    (4 níveis de "furação" 🕳️ e o mesmo tipo declarado 4 vezes)
export default function TaskActions({ task, isEditing, onToggleEdit, onDeleteTask }: TaskActionsProps) {
  return (
    <div className="actions">
      <button onClick={onToggleEdit}>{isEditing ? 'Salvar' : 'Editar'}</button>
      <button className="danger" onClick={() => onDeleteTask(task.id)}>
        Excluir
      </button>
    </div>
  );
}
