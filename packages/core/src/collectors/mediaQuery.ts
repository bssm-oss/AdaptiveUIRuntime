import type { Collector, SystemPreferencesSnapshot } from '../types';

function readMediaSnapshot(): SystemPreferencesSnapshot {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return {
      colorScheme: 'light',
      contrast: 'normal',
      reducedMotion: false,
      pointer: 'fine',
      viewTransitions: false
    };
  }

  return {
    colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light',
    contrast: window.matchMedia('(prefers-contrast: more)').matches
      ? 'more'
      : window.matchMedia('(prefers-contrast: less)').matches
        ? 'less'
        : 'normal',
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
      .matches,
    pointer: window.matchMedia('(pointer: coarse)').matches ? 'coarse' : 'fine',
    viewTransitions:
      typeof document !== 'undefined' && 'startViewTransition' in document
  };
}

export function createMediaQueryCollector(): Collector<SystemPreferencesSnapshot> {
  let snapshot = readMediaSnapshot();
  const listeners = new Set<(value: SystemPreferencesSnapshot) => void>();
  const queries =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? [
          window.matchMedia('(prefers-color-scheme: dark)'),
          window.matchMedia('(prefers-contrast: more)'),
          window.matchMedia('(prefers-contrast: less)'),
          window.matchMedia('(prefers-reduced-motion: reduce)'),
          window.matchMedia('(pointer: coarse)')
        ]
      : [];

  const notify = () => {
    snapshot = readMediaSnapshot();
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
      queries.forEach((query) => query.addEventListener?.('change', notify));
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
          queries.forEach((query) =>
            query.removeEventListener?.('change', notify)
          );
        }
      };
    }
  };
}
