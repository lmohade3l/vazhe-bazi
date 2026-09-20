import { useEffect } from 'react';

/** تم و حالت رنگ‌کوری را روی `<html>` اعمال می‌کند. */
export function useTheme(theme, colorBlind) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.colorblind = String(Boolean(colorBlind));
  }, [theme, colorBlind]);
}
