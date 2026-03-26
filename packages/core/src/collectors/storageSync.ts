import type { Collector } from '../types';

export interface StorageSyncSnapshot {
  key: string;
  changedAt: number;
}

export function createStorageSyncCollector(
  key: string
): Collector<StorageSyncSnapshot> {
  let snapshot: StorageSyncSnapshot = {
    key,
    changedAt: 0
  };
  const listeners = new Set<(value: StorageSyncSnapshot) => void>();

  const onStorage = (event: StorageEvent) => {
    if (event.key !== key) {
      return;
    }

    snapshot = {
      key,
      changedAt: Date.now()
    };
    for (const listener of listeners) {
      listener(snapshot);
    }
  };

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', onStorage);
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && typeof window !== 'undefined') {
          window.removeEventListener('storage', onStorage);
        }
      };
    }
  };
}
