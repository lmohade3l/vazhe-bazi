import { useCallback } from 'react';
import { KEYS, defaultSettings } from '../lib/storage';
import { useLocalStorage } from './useLocalStorage';
import type { SetSetting, Settings } from '../types';

/** تنظیمات کاربر: تم، حالت سخت و حالت رنگ‌کوری. */
export function useSettings(): { settings: Settings; setSetting: SetSetting } {
  const [stored, setStored] = useLocalStorage<Settings>(KEYS.settings, defaultSettings);
  const settings: Settings = { ...defaultSettings, ...stored };

  const setSetting = useCallback<SetSetting>(
    (name, value) => {
      setStored((current) => {
        const next: Settings = { ...defaultSettings, ...current };
        next[name] = value;
        return next;
      });
    },
    [setStored],
  );

  return { settings, setSetting };
}
