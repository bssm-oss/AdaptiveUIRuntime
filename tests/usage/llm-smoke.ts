import assert from 'node:assert/strict';
import {
  createBootstrapContext,
  createUserProfile,
  defineSurface,
  resolvePlan,
  type ContextSnapshot,
  type ManualPreferenceKey,
  type UserProfile
} from '@adaptive-ui/core';
import {
  applyAdaptiveIntentRecommendation,
  createHeuristicAdaptiveIntentCompiler
} from '@adaptive-ui/llm';

const surface = defineSurface({
  id: 'usage.llm',
  label: 'Usage LLM smoke surface',
  zones: {
    primaryNav: {
      label: 'Primary nav',
      defaultVariant: 'sidebarNav',
      variants: {
        sidebarNav: {
          component: 'SidebarNav',
          traits: {
            navMode: 'sidebar'
          }
        },
        commandNav: {
          component: 'CommandNav',
          traits: {
            navMode: 'command'
          }
        },
        bottomNav: {
          component: 'BottomNav',
          traits: {
            navMode: 'bottom'
          }
        }
      }
    },
    hero: {
      label: 'Hero',
      defaultVariant: 'noviceHero',
      variants: {
        noviceHero: {
          component: 'NoviceHero',
          traits: {
            expertise: 'novice'
          }
        },
        expertHero: {
          component: 'ExpertHero',
          traits: {
            expertise: 'expert'
          }
        },
        mobileHero: { component: 'MobileHero' }
      }
    },
    mainContent: {
      label: 'Main content',
      defaultVariant: 'summaryCards',
      variants: {
        summaryCards: {
          component: 'SummaryCards',
          baseScore: 3,
          traits: {
            defaultView: 'cards',
            contentMode: 'summary'
          }
        },
        chartPowerView: {
          component: 'ChartPowerView',
          baseScore: 3,
          traits: {
            defaultView: 'chart',
            navMode: 'command',
            layoutBias: 'compare'
          }
        }
      }
    }
  }
});

const compiler = createHeuristicAdaptiveIntentCompiler();
const baseProfile = createUserProfile();
const baseContext = createBootstrapContext({
  surfaceId: 'usage.llm',
  route: '/usage-llm'
});

const recommendation = await compiler.compile({
  surface,
  userRequest: '차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.',
  userProfile: baseProfile,
  context: baseContext,
  language: 'ko-KR'
});

assert.equal(recommendation.preferenceUpdates.defaultView, 'chart');
assert.equal(recommendation.preferenceUpdates.navMode, 'command');
assert.equal(recommendation.variantHints.mainContent, 'chartPowerView');
assert.equal(recommendation.variantHints.primaryNav, 'commandNav');
assert.match(recommendation.messageToUser, /즉시 반영/);

let nextProfile: UserProfile = baseProfile;
let nextContext: ContextSnapshot = baseContext;

applyAdaptiveIntentRecommendation(recommendation, {
  currentContext: nextContext,
  updateExplicitPreference(
    key: ManualPreferenceKey,
    value: UserProfile['explicit'][ManualPreferenceKey]
  ) {
    nextProfile = {
      ...nextProfile,
      explicit: {
        ...nextProfile.explicit,
        [key]: value
      }
    };
  },
  patchContext(patch: Partial<ContextSnapshot>) {
    nextContext = {
      ...nextContext,
      ...patch
    };
  }
});

const plan = resolvePlan({
  surface,
  userProfile: nextProfile,
  context: nextContext
});

assert.equal(plan.zones.primaryNav?.variantId, 'commandNav');
assert.equal(plan.zones.mainContent?.variantId, 'chartPowerView');

console.log('Adaptive UI LLM consumer smoke test passed.');
console.log(
  `Applied intent: ${recommendation.summary} -> ${plan.zones.mainContent?.variantId}`
);
