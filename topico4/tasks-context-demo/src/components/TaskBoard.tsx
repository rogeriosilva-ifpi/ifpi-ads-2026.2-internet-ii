import AddTask from './AddTask';
import TaskList from './TaskList';
import TaskFooter from './TaskFooter';

// TaskBoard voltou a ser o que sempre foi: só layout.
// Adeus TaskBoardProps com 5 campos.
export default function TaskBoard() {
  return (
    <main className="board">
      <AddTask />
      <TaskList />
      <TaskFooter />
    </main>
  );
}
