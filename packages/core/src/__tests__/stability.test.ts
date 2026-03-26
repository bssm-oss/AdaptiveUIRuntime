import { describe, expect, it } from 'vitest';
import { defineSurface } from '../schema';
import { resolvePlan } from '../engine';
import { createBehaviorSummary } from '../behavior';
import { createTestContext, createTestProfile } from './fixtures';

describe('stability guards', () => {
  it('keeps the previous navigation when the score delta is below hysteresis', () => {
    const surface = defineSurface({
      id: 'dashboard.stability',
      label: 'Stability surface',
      policies: {
        hysteresisThreshold: 8
      },
      zones: {
        primaryNav: {
          label: 'Primary nav',
          kind: 'navigation',
          defaultVariant: 'sidebar',
          variants: {
            sidebar: {
              component: 'Sidebar',
              baseScore: 10
            },
            command: {
              component: 'Command',
              baseScore: 10,
              rules: [
                {
                  id: 'small-command-bump',
                  label: 'Small keyboard bump',
                  apply(context) {
                    return context.behaviorSummary.keyboardShortcuts > 0
                      ? 6
                      : 0;
                  }
                }
              ]
            }
          }
        }
      }
    });

    const profile = createTestProfile();
    const initialPlan = resolvePlan({
      surface,
      userProfile: profile,
      context: {
        ...createTestContext(),
        surfaceId: 'dashboard.stability'
      }
    });

    const nextProfile = createTestProfile();
    nextProfile.learned.prefersKeyboardFlow = 0.6;

    const nextPlan = resolvePlan({
      surface,
      userProfile: nextProfile,
      behaviorSummary: createBehaviorSummary({
        viewCount: 3,
        keyboardShortcuts: 1
      }),
      context: {
        ...createTestContext(),
        surfaceId: 'dashboard.stability'
      },
      previousPlan: initialPlan
    });

    expect(initialPlan.zones.primaryNav?.variantId).toBe('sidebar');
    expect(nextPlan.zones.primaryNav?.variantId).toBe('sidebar');
    expect(nextPlan.stability.keptPrevious).toContain('primaryNav');
  });
});
