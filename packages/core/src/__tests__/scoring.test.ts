import { describe, expect, it } from 'vitest';
import { resolvePlan } from '../engine';
import { createBehaviorSummary } from '../behavior';
import { createTestContext, createTestProfile, testSurface } from './fixtures';

describe('rule-based scoring', () => {
  it('picks chart-first content when chart affinity is strong', () => {
    const profile = createTestProfile();
    profile.learned.prefersCharts = 0.92;
    const plan = resolvePlan({
      surface: testSurface,
      userProfile: profile,
      behaviorSummary: createBehaviorSummary({
        chartInteractions: 5,
        tableInteractions: 1,
        viewCount: 6
      }),
      context: createTestContext()
    });

    expect(plan.zones.mainContent?.variantId).toBe('chart');
  });
});
