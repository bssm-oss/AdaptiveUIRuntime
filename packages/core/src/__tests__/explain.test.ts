import { describe, expect, it } from 'vitest';
import { explainPlan } from '../explain';
import { resolvePlan } from '../engine';
import { createTestContext, createTestProfile, testSurface } from './fixtures';

describe('plan explanations', () => {
  it('returns a readable why trace for each selected zone', () => {
    const plan = resolvePlan({
      surface: testSurface,
      userProfile: createTestProfile(),
      context: createTestContext()
    });

    const explanation = explainPlan(plan);
    expect(explanation.summary[0]).toContain('dashboard.test');
    expect(explanation.zones.primaryNav?.variantId).toBe(
      plan.zones.primaryNav?.variantId
    );
    expect(explanation.zones.mainContent?.why.length ?? 0).toBeGreaterThan(0);
  });
});
