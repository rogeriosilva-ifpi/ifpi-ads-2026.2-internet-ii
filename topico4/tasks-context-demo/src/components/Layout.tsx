import type { ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

// Lê o tema e aplica a classe no container principal.
export default function Layout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`}>
      <div className="container">{children}</div>
    </div>
  );
}
