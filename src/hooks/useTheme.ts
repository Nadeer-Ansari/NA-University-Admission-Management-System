import { useState, useEffect } from 'react';
import { ThemeMode, getPreferredTheme, applyTheme, THEME_KEY } from '../services/themeService';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

  useEffect(() => {
    // Ensure document attributes are set on mount
    applyTheme(theme);

    // Listen to OS prefers-color-scheme changes if no saved theme is in localStorage
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        try {
          const savedTheme = localStorage.getItem(THEME_KEY);
          if (!savedTheme) {
            const newTheme: ThemeMode = e.matches ? 'dark' : 'light';
            setTheme(newTheme);
            applyTheme(newTheme, false);
          }
        } catch {
          // ignore
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme, true);
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
