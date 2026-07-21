import { useEffect, useState } from 'react';

export function useDarkMode() {
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'dark'
  );

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return [theme, toggleTheme];
}

export default useDarkMode;
