import type { Collector } from '../types';

export interface PerformanceSnapshot {
  now: number;
  supported: boolean;
}

export function createPerformanceCollector(): Collector<PerformanceSnapshot> {
  let snapshot: PerformanceSnapshot = {
    now: typeof performance !== 'undefined' ? performance.now() : 0,
    supported: typeof performance !== 'undefined'
  };
  const listeners = new Set<(value: PerformanceSnapshot) => void>();

  const tick = () => {
    snapshot = {
      now:
        typeof performance !== 'undefined' ? performance.now() : snapshot.now,
      supported: typeof performance !== 'undefined'
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
      const frame =
        typeof window !== 'undefined'
          ? window.setInterval(tick, 1_000)
          : undefined;
      return () => {
        listeners.delete(listener);
        if (frame !== undefined && listeners.size === 0) {
          window.clearInterval(frame);
        }
      };
    }
  };
}
