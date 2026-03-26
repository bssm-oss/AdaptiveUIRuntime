import { describe, expect, it } from 'vitest';
import { createAdaptiveEngine } from '../engine';
import { createMemoryStorageAdapter } from '../storage/memory';
import { testSurface } from './fixtures';

describe('persistence', () => {
  it('persists explicit and learned state through the storage adapter', () => {
    const storage = createMemoryStorageAdapter();
    const engine = createAdaptiveEngine({
      storage,
      surfaces: [testSurface],
      learnedPersistenceThrottleMs: 0
    });

    engine.updateExplicitPreference('density', 'compact');
    engine.trackBehavior({
      type: 'chart_interaction',
      surfaceId: 'dashboard.test',
      zoneName: 'mainContent'
    });

    const persisted = storage.load();
    expect(persisted?.profile.explicit.density).toBe('compact');
    expect((persisted?.profile.learned.prefersCharts ?? 0) > 0.5).toBe(true);
  });
});
