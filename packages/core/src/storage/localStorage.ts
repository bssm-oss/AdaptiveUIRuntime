import type { StorageAdapter, StoredAdaptiveState } from '../types';

export function createLocalStorageAdapter(
  key = 'adaptive-ui.profile'
): StorageAdapter {
  return {
    load() {
      if (typeof window === 'undefined' || !window.localStorage) {
        return null;
      }

      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as StoredAdaptiveState) : null;
    },
    save(state) {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      window.localStorage.setItem(key, JSON.stringify(state));
    },
    clear() {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }

      window.localStorage.removeItem(key);
    }
  };
}
