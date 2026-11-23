import { useTasks } from '../context/TasksContext';
import TaskItem from './TaskItem';

export default function TaskList() {
  const tasks = useTasks();

  if (tasks.length === 0) {
    return <p className="empty">Nenhuma tarefa por aqui 🎉</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        // `task` continua sendo prop: é dado do ITEM, não global.
        // Context não substitui props — complementa.
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
