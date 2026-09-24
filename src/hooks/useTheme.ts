import { useEffect } from 'react';
import type { Theme } from '../types';

/** تم و حالت رنگ‌کوری را روی `<html>` اعمال می‌کند. */
export function useTheme(theme: Theme, colorBlind: boolean): void {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.colorblind = String(colorBlind);
  }, [theme, colorBlind]);
}
