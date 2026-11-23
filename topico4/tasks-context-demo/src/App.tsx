import { useReducer } from 'react';
import type { Task } from './types';
import { tasksReducer } from './tasksReducer';
import { initialTasks } from './initialTasks';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';

let nextId = initialTasks.length + 1;

// ⚠️ VERSÃO "ANTES": PROPS DRILLING
// O estado vive aqui no topo. Tudo o que os componentes lá embaixo
// precisam (tasks + handlers) desce "furando" a árvore, prop a prop.
// Repare também: cada intermediário precisa DECLARAR o tipo de props
// que nem usa. Em TypeScript o drilling dói em dobro.
export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

  function handleAddTask(text: string) {
    dispatch({ type: 'added', id: nextId++, text });
  }

  function handleChangeTask(task: Task) {
    dispatch({ type: 'changed', task });
  }

  function handleDeleteTask(taskId: number) {
    dispatch({ type: 'deleted', id: taskId });
  }

  function handleClearDone() {
    dispatch({ type: 'cleared_done' });
  }

  return (
    <div className="app">
      <div className="container">
        {/* Header não usa tasks... só repassa para TaskCounter */}
        <Header tasks={tasks} />

        {/* TaskBoard recebe 5 props e não usa NENHUMA diretamente */}
        <TaskBoard
          tasks={tasks}
          onAddTask={handleAddTask}
          onChangeTask={handleChangeTask}
          onDeleteTask={handleDeleteTask}
          onClearDone={handleClearDone}
        />
      </div>
    </div>
  );
}
