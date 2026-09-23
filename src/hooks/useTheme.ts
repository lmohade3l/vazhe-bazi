import { useEffect } from 'react';

export type THEME = 'light' | 'dark'

export function useTheme(theme: THEME, colorBlind:boolean) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.colorblind = String(Boolean(colorBlind));
  }, [theme, colorBlind]);
}
