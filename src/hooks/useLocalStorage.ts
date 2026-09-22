import { useCallback, useState } from 'react';
import { readStore, SETTINGS, writeStore } from '../lib/storage';

export function useLocalStorage(key: string, initialValue: SETTINGS) {
  const [value, setValue] = useState<string>(() => readStore(key, initialValue));

  const update = useCallback(
    (next) => {
      setValue((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        writeStore(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}
