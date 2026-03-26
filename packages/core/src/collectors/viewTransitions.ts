import type { Collector } from '../types';

export interface ViewTransitionSnapshot {
  supported: boolean;
}

export function detectViewTransitionSupport(): boolean {
  return typeof document !== 'undefined' && 'startViewTransition' in document;
}

export function createViewTransitionCollector(): Collector<ViewTransitionSnapshot> {
  const snapshot = {
    supported: detectViewTransitionSupport()
  };

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listener(snapshot);
      return () => undefined;
    }
  };
}
