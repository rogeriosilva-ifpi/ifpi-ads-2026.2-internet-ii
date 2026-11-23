import { ThemeProvider } from './context/ThemeContext';
import { TasksProvider } from './context/TasksContext';
import Layout from './components/Layout';
import Header from './components/Header';
import TaskBoard from './components/TaskBoard';

// Vários contextos convivem: cada um com UMA responsabilidade.
// A ordem dos providers só importa se um depender do outro.
export default function App() {
  return (
    <ThemeProvider>
      <TasksProvider>
        <Layout>
          <Header />
          <TaskBoard />
        </Layout>
      </TasksProvider>
    </ThemeProvider>
  );
}
