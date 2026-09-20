import { useCallback, useState } from 'react';
import { readStore, writeStore } from '../lib/storage';

/**
 * یک state که خودش را در localStorage نگه می‌دارد.
 * مقدار اولیه فقط یک‌بار خوانده می‌شود.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readStore(key, initialValue));

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
