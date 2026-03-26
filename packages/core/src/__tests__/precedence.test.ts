import { describe, expect, it } from 'vitest';
import { resolvePlan } from '../engine';
import { createTestContext, createTestProfile, testSurface } from './fixtures';

describe('preference precedence', () => {
  it('lets explicit preferences override learned signals', () => {
    const profile = createTestProfile();
    profile.explicit.defaultView = 'table';
    profile.learned.prefersCharts = 0.95;

    const plan = resolvePlan({
      surface: testSurface,
      userProfile: profile,
      context: createTestContext()
    });

    expect(plan.resolvedPreferences.values.defaultView).toBe('table');
    expect(plan.zones.mainContent?.variantId).toBe('table');
  });
});
