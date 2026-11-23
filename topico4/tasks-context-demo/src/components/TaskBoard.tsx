import type { Task } from '../types';
import AddTask from './AddTask';
import TaskList from './TaskList';
import TaskFooter from './TaskFooter';

// 🚚 5 props tipadas... e nenhuma é usada aqui.
type TaskBoardProps = {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onChangeTask: (task: Task) => void;
  onDeleteTask: (taskId: number) => void;
  onClearDone: () => void;
};

// 🚚 TaskBoard é só layout. Recebe 5 props e apenas distribui.
export default function TaskBoard({
  tasks,
  onAddTask,
  onChangeTask,
  onDeleteTask,
  onClearDone,
}: TaskBoardProps) {
  return (
    <main className="board">
      <AddTask onAddTask={onAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={onChangeTask}
        onDeleteTask={onDeleteTask}
      />
      <TaskFooter tasks={tasks} onClearDone={onClearDone} />
    </main>
  );
}
