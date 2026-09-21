import { useCallback } from 'react';
import { KEYS, SETTINGS, defaultSettings } from '../lib/storage';
import { useLocalStorage } from './useLocalStorage';

/** تنظیمات کاربر: تم، حالت سخت و حالت رنگ‌کوری. */
export function useSettings() {
  const [stored, setStored] = useLocalStorage(KEYS.settings, defaultSettings);
  const settings = { ...defaultSettings, ...stored };

  const setSetting = useCallback(
    (name: string, value: string) => {
      setStored((current: SETTINGS) => ({ ...defaultSettings, ...current, [name]: value }));
    },
    [setStored],
  );

  return { settings, setSetting };
}
