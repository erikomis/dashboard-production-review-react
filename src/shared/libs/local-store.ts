import { useSyncExternalStore } from "react";

export interface LocalStore<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: () => void) => () => void;
}

/**
 * Pequeno store persistido em localStorage e compartilhado entre componentes
 * (diferente de useState + localStorage, todas as instâncias ficam sincronizadas).
 */
export function createLocalStore<T>(key: string, initial: T): LocalStore<T> {
  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  };

  let value = read();
  const listeners = new Set<() => void>();

  return {
    get: () => value,
    set: (next: T) => {
      value = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // armazenamento indisponível (modo privado etc.): mantém só em memória
      }
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

export function useLocalStore<T>(store: LocalStore<T>) {
  const value = useSyncExternalStore(store.subscribe, store.get, store.get);
  return [value, store.set] as const;
}
