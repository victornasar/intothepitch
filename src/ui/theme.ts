// Light vs dark. Dark is the default (broadcast cam).
// After the first visit, the learner's last choice wins.

import { iconMoon, iconSun } from './icons';

export type Theme = 'day' | 'night';

const STORAGE_KEY = 'itp-theme';

export function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'day' || stored === 'night') return stored;
  } catch {
    // Private mode can throw; fall through.
  }
  return 'night';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme === 'night' ? 'dark' : 'light';
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Session still switches without persistence.
  }
}

export function createThemeToggle(container: HTMLElement): void {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'hud-theme';

  function paint(theme: Theme): void {
    const goingDark = theme === 'day';
    button.replaceChildren(goingDark ? iconMoon() : iconSun());
    button.setAttribute('aria-pressed', String(theme === 'night'));
    button.setAttribute(
      'aria-label',
      goingDark ? 'Switch to dark theme' : 'Switch to light theme',
    );
  }

  paint(readTheme());

  button.addEventListener('click', () => {
    const next: Theme = readTheme() === 'night' ? 'day' : 'night';
    applyTheme(next);
    paint(next);
  });

  container.appendChild(button);
}
