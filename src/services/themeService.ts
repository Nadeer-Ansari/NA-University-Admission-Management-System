export type ThemeMode = 'light' | 'dark';

export const THEME_KEY = 'nau-theme';

export function getPreferredTheme(): ThemeMode {
  try {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
  } catch {
    // localStorage might be unavailable
  }

  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

export function applyTheme(theme: ThemeMode, persist: boolean = false): void {
  try {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.setAttribute('data-bs-theme', theme);
      document.documentElement.style.colorScheme = theme;
    }
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(THEME_KEY, theme);
    }
  } catch (err) {
    console.error('Failed to set theme:', err);
  }
}
