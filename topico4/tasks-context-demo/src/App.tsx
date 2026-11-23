import { TasksProvider } from './context/TasksContext';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';

// ✅ VERSÃO "DEPOIS": CONTEXT API
// O App não guarda estado nem passa props.
// Só "liga" o provedor em volta da árvore.
export default function App() {
  return (
    <TasksProvider>
      <div className="app">
        <div className="container">
          <Header />
          <TaskBoard />
        </div>
      </div>
    </TasksProvider>
  );
}
