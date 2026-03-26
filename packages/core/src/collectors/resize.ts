import type { Collector } from '../types';

export interface ResizeSnapshot {
  viewport: {
    width: number;
    height: number;
  };
  containers: Record<string, { width: number; height: number }>;
}

export function createResizeCollector(
  targets: Record<string, HTMLElement | null> = {}
): Collector<ResizeSnapshot> {
  let snapshot: ResizeSnapshot = {
    viewport: {
      width: typeof window !== 'undefined' ? window.innerWidth : 1280,
      height: typeof window !== 'undefined' ? window.innerHeight : 800
    },
    containers: {}
  };
  const listeners = new Set<(value: ResizeSnapshot) => void>();

  const recompute = () => {
    snapshot = {
      viewport: {
        width:
          typeof window !== 'undefined'
            ? window.innerWidth
            : snapshot.viewport.width,
        height:
          typeof window !== 'undefined'
            ? window.innerHeight
            : snapshot.viewport.height
      },
      containers: Object.fromEntries(
        Object.entries(targets)
          .filter(([, target]) => Boolean(target))
          .map(([key, target]) => [
            key,
            {
              width: target?.clientWidth ?? 0,
              height: target?.clientHeight ?? 0
            }
          ])
      )
    };

    for (const listener of listeners) {
      listener(snapshot);
    }
  };

  let observer: ResizeObserver | undefined;
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(recompute);
    Object.values(targets).forEach((target) => {
      if (target) {
        observer?.observe(target);
      }
    });
  }

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', recompute);
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          if (typeof window !== 'undefined') {
            window.removeEventListener('resize', recompute);
          }
          observer?.disconnect();
        }
      };
    }
  };
}
