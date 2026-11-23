import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} title="Alternar tema">
      {theme === 'light' ? '🌙 Escuro' : '☀️ Claro'}
    </button>
  );
}
