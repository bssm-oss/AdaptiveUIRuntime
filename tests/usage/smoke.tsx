import assert from 'node:assert/strict';
import { renderToString } from 'react-dom/server';
import {
  DEFAULT_EXPLICIT_PREFERENCES,
  createAdaptiveEngine,
  createBootstrapContext,
  createUserProfile,
  defineSurface,
  resolvePlan
} from '@adaptive-ui/core';
import {
  AdaptiveProvider,
  AdaptiveSlot,
  AdaptiveSurface
} from '@adaptive-ui/react';

const smokeSurface = defineSurface({
  id: 'usage.smoke',
  label: 'Usage smoke surface',
  zones: {
    mainContent: {
      label: 'Main content',
      kind: 'content',
      defaultVariant: 'summaryCards',
      variants: {
        summaryCards: {
          component: 'SummaryCards',
          baseScore: 3,
          traits: {
            defaultView: 'cards',
            contentMode: 'summary',
            summaryAffinity: 1
          }
        },
        chartBoard: {
          component: 'ChartBoard',
          baseScore: 3,
          traits: {
            defaultView: 'chart',
            chartAffinity: 1,
            layoutBias: 'compare'
          }
        },
        detailTable: {
          component: 'DetailTable',
          baseScore: 3,
          traits: {
            defaultView: 'table',
            contentMode: 'detailed',
            density: 'compact'
          }
        }
      }
    }
  }
});

const registry = {
  SummaryCards: () => <section>Summary Cards Variant</section>,
  ChartBoard: () => <section>Chart Board Variant</section>,
  DetailTable: () => <section>Detail Table Variant</section>
};

const baseContext = createBootstrapContext({
  surfaceId: 'usage.smoke',
  route: '/usage-smoke',
  viewport: {
    width: 1280,
    height: 800
  },
  deviceCategory: 'desktop',
  pointerType: 'fine',
  inputModality: 'mouse',
  system: {
    colorScheme: 'light',
    contrast: 'normal',
    reducedMotion: false,
    pointer: 'fine',
    viewTransitions: false
  }
});

function renderConsumer(profile = createUserProfile()): string {
  return renderToString(
    <AdaptiveProvider initialProfile={profile} initialContext={baseContext}>
      <AdaptiveSurface
        surface="usage.smoke"
        schema={smokeSurface}
        components={registry}
      >
        <AdaptiveSlot name="mainContent" />
      </AdaptiveSurface>
    </AdaptiveProvider>
  );
}

const initialProfile = createUserProfile({
  explicit: {
    ...DEFAULT_EXPLICIT_PREFERENCES,
    defaultView: 'cards',
    contentMode: 'summary'
  }
});

const initialPlan = resolvePlan({
  surface: smokeSurface,
  userProfile: initialProfile,
  context: baseContext
});
assert.equal(initialPlan.zones.mainContent?.variantId, 'summaryCards');

const initialMarkup = renderConsumer(initialProfile);
assert.match(initialMarkup, /Summary Cards Variant/);

const explicitEngine = createAdaptiveEngine({
  initialProfile
});
explicitEngine.updateExplicitPreference('defaultView', 'chart');
const explicitProfile = explicitEngine.getProfile();
const explicitPlan = resolvePlan({
  surface: smokeSurface,
  userProfile: explicitProfile,
  context: baseContext
});
assert.equal(explicitPlan.zones.mainContent?.variantId, 'chartBoard');

const explicitMarkup = renderConsumer(explicitProfile);
assert.match(explicitMarkup, /Chart Board Variant/);

const learnedEngine = createAdaptiveEngine({
  initialProfile: createUserProfile()
});
for (let index = 0; index < 6; index += 1) {
  learnedEngine.trackBehavior({
    type: 'chart_interaction',
    surfaceId: 'usage.smoke',
    zoneName: 'mainContent'
  });
}
const learnedProfile = learnedEngine.getProfile();
const learnedPlan = resolvePlan({
  surface: smokeSurface,
  userProfile: learnedProfile,
  context: baseContext,
  behaviorSummary: learnedEngine.getBehaviorSummary()
});
assert.equal(learnedPlan.zones.mainContent?.variantId, 'chartBoard');

const learnedMarkup = renderConsumer(learnedProfile);
assert.match(learnedMarkup, /Chart Board Variant/);

console.log('Adaptive UI consumer smoke test passed.');
console.log(`Initial variant: ${initialPlan.zones.mainContent?.variantId}`);
console.log(
  `Explicit override variant: ${explicitPlan.zones.mainContent?.variantId}`
);
console.log(
  `Learned preference variant: ${learnedPlan.zones.mainContent?.variantId}`
);
