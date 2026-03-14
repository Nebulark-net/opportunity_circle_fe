import { useEffect } from 'react';
import { useUIStore } from '../stores/uiStore';

export const useTheme = () => {
  const { theme, toggleTheme } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return { theme, toggleTheme };
};
