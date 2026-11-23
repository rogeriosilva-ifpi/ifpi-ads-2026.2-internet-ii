import type { Task } from '../types';
import TaskItem from './TaskItem';

type TaskListProps = {
  tasks: Task[];
  onChangeTask: (task: Task) => void; // 🚚 só repassa
  onDeleteTask: (taskId: number) => void; // 🚚 só repassa
};

// 🚚 TaskList usa `tasks` para o map, mas onChangeTask e onDeleteTask
//    são só REPASSADOS para cada TaskItem.
export default function TaskList({ tasks, onChangeTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty">Nenhuma tarefa por aqui 🎉</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onChangeTask={onChangeTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </ul>
  );
}
