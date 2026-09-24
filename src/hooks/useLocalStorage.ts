import { useCallback, useState } from 'react';
import { readStore, writeStore, type StorageKey } from '../lib/storage';

export type SetStoredValue<T> = (next: T | ((current: T) => T)) => void;

/**
 * یک state که خودش را در localStorage نگه می‌دارد.
 * مقدار اولیه فقط یک‌بار خوانده می‌شود.
 */
export function useLocalStorage<T>(
  key: StorageKey,
  initialValue: T,
): [T, SetStoredValue<T>] {
  const [value, setValue] = useState<T>(() => readStore(key, initialValue));

  const update = useCallback<SetStoredValue<T>>(
    (next) => {
      setValue((current) => {
        const resolved =
          typeof next === 'function' ? (next as (current: T) => T)(current) : next;
        writeStore(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, update];
}
