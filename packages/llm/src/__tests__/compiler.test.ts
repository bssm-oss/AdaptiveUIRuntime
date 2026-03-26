import { describe, expect, it } from 'vitest';
import { defineSurface, type SurfaceSchema } from '@adaptive-ui/core';
import { createBootstrapContext, createUserProfile } from '@adaptive-ui/core';
import {
  createAdaptiveIntentCompiler,
  createHeuristicAdaptiveIntentCompiler
} from '../index';

const testSurface = defineSurface({
  id: 'dashboard.home',
  label: 'Dashboard',
  zones: {
    primaryNav: {
      label: 'Primary nav',
      variants: {
        sidebarNav: { component: 'SidebarNav' },
        commandNav: { component: 'CommandNav' }
      }
    },
    mainContent: {
      label: 'Main content',
      variants: {
        tablePowerView: { component: 'TablePowerView' },
        chartPowerView: { component: 'ChartPowerView' }
      }
    }
  }
}) satisfies SurfaceSchema;

describe('@adaptive-ui/llm compilers', () => {
  it('maps chart and keyboard intent into safe preference updates', async () => {
    const compiler = createHeuristicAdaptiveIntentCompiler();
    const recommendation = await compiler.compile({
      surface: testSurface,
      userRequest: '차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.',
      userProfile: createUserProfile(),
      context: createBootstrapContext({
        surfaceId: 'dashboard.home',
        route: '/dashboard'
      }),
      language: 'ko-KR'
    });

    expect(recommendation.preferenceUpdates.defaultView).toBe('chart');
    expect(recommendation.preferenceUpdates.navMode).toBe('command');
    expect(recommendation.variantHints.mainContent).toBe('chartPowerView');
    expect(recommendation.variantHints.primaryNav).toBe('commandNav');
    expect(recommendation.summary).toContain('안전한 화면 추천');
    expect(recommendation.reasoning[0]).toContain('차트');
  });

  it('drops unknown variant hints returned by a text transport', async () => {
    const compiler = createAdaptiveIntentCompiler({
      transport: {
        name: 'stub',
        async generateText() {
          return JSON.stringify({
            summary: 'Unsafe variant dropped.',
            message_to_user: 'Only approved variants should survive.',
            reasoning: ['Testing transport sanitization.'],
            confidence: 0.91,
            preference_updates: {
              density: 'compact'
            },
            context_patch: {},
            variant_hints: {
              mainContent: 'unknownVariant'
            },
            unsupported_requests: [],
            suggested_prompts: []
          });
        }
      }
    });

    const recommendation = await compiler.compile({
      surface: testSurface,
      userRequest: '테스트',
      userProfile: createUserProfile(),
      context: createBootstrapContext({
        surfaceId: 'dashboard.home',
        route: '/dashboard'
      })
    });

    expect(recommendation.preferenceUpdates.density).toBe('compact');
    expect(recommendation.variantHints.mainContent).toBeUndefined();
    expect(recommendation.unsupportedRequests[0]).toContain('unknownVariant');
  });
});
