import type { StorageAdapter, StoredAdaptiveState } from '../types';

export function createMemoryStorageAdapter(
  initialState: StoredAdaptiveState | null = null
): StorageAdapter {
  let state = initialState;

  return {
    load() {
      return state;
    },
    save(nextState) {
      state = nextState;
    },
    clear() {
      state = null;
    }
  };
}
