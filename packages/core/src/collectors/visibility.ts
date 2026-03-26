import type { Collector } from '../types';

export interface VisibilitySnapshot {
  hidden: boolean;
  visibilityState: DocumentVisibilityState;
}

export function createVisibilityCollector(): Collector<VisibilitySnapshot> {
  let snapshot: VisibilitySnapshot = {
    hidden: typeof document !== 'undefined' ? document.hidden : false,
    visibilityState:
      typeof document !== 'undefined' ? document.visibilityState : 'visible'
  };
  const listeners = new Set<(value: VisibilitySnapshot) => void>();

  const recompute = () => {
    snapshot = {
      hidden: document.hidden,
      visibilityState: document.visibilityState
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
      document.addEventListener('visibilitychange', recompute);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          document.removeEventListener('visibilitychange', recompute);
        }
      };
    }
  };
}
