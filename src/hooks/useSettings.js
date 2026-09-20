import { useCallback } from 'react';
import { KEYS, defaultSettings } from '../lib/storage';
import { useLocalStorage } from './useLocalStorage';

/** تنظیمات کاربر: تم، حالت سخت و حالت رنگ‌کوری. */
export function useSettings() {
  const [stored, setStored] = useLocalStorage(KEYS.settings, defaultSettings);
  const settings = { ...defaultSettings, ...stored };

  const setSetting = useCallback(
    (name, value) => {
      setStored((current) => ({ ...defaultSettings, ...current, [name]: value }));
    },
    [setStored],
  );

  return { settings, setSetting };
}
