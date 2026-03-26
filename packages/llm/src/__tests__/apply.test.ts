import { describe, expect, it, vi } from 'vitest';
import { createBootstrapContext } from '@adaptive-ui/core';
import { applyAdaptiveIntentRecommendation } from '../compiler';

describe('applyAdaptiveIntentRecommendation', () => {
  it('applies explicit updates and patches nested system context safely', () => {
    const updateExplicitPreference = vi.fn();
    const patchContext = vi.fn();

    const result = applyAdaptiveIntentRecommendation(
      {
        surfaceId: 'dashboard.home',
        request: '고대비와 차트',
        summary: 'summary',
        messageToUser: 'message',
        reasoning: ['reason'],
        confidence: 0.8,
        preferenceUpdates: {
          defaultView: 'chart',
          contrast: 'more'
        },
        contextPatch: {
          highContrast: true,
          reducedMotion: true
        },
        variantHints: {
          mainContent: 'chartPowerView'
        },
        unsupportedRequests: [],
        suggestedPrompts: []
      },
      {
        currentContext: createBootstrapContext({
          surfaceId: 'dashboard.home',
          route: '/dashboard'
        }),
        updateExplicitPreference,
        patchContext
      }
    );

    expect(updateExplicitPreference).toHaveBeenCalledWith('contrast', 'more');
    expect(updateExplicitPreference).toHaveBeenCalledWith(
      'defaultView',
      'chart'
    );
    expect(patchContext).toHaveBeenCalledTimes(1);
    expect(result.updatedPreferences).toEqual(
      expect.arrayContaining(['contrast', 'defaultView'])
    );
    expect(result.patchedContext).toBe(true);
    expect(result.variantHints.mainContent).toBe('chartPowerView');
  });
});
