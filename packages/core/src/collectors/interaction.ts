import type { Collector, InputModality, PointerType } from '../types';

export interface InteractionSnapshot {
  inputModality: InputModality;
  pointerType: PointerType;
}

export function createInteractionCollector(): Collector<InteractionSnapshot> {
  let snapshot: InteractionSnapshot = {
    inputModality: 'mouse',
    pointerType: 'fine'
  };
  const listeners = new Set<(value: InteractionSnapshot) => void>();

  const notify = () => {
    for (const listener of listeners) {
      listener(snapshot);
    }
  };

  const onKeyDown = () => {
    snapshot = {
      ...snapshot,
      inputModality: 'keyboard'
    };
    notify();
  };

  const onPointerDown = (event: PointerEvent) => {
    snapshot = {
      inputModality: event.pointerType === 'touch' ? 'touch' : 'mouse',
      pointerType: event.pointerType === 'touch' ? 'coarse' : 'fine'
    };
    notify();
  };

  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', onKeyDown, { passive: true });
        window.addEventListener('pointerdown', onPointerDown, {
          passive: true
        });
      }
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && typeof window !== 'undefined') {
          window.removeEventListener('keydown', onKeyDown);
          window.removeEventListener('pointerdown', onPointerDown);
        }
      };
    }
  };
}
