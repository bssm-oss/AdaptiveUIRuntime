import { createContextSnapshot } from '../context';
import { createUserProfile } from '../preferences';
import { defineSurface } from '../schema';

export const testSurface = defineSurface({
  id: 'dashboard.test',
  label: 'Test dashboard',
  policies: {
    hysteresisThreshold: 8,
    navCooldownMs: 60_000
  },
  zones: {
    primaryNav: {
      label: 'Primary navigation',
      kind: 'navigation',
      variants: {
        sidebar: {
          component: 'Sidebar',
          baseScore: 2,
          traits: {
            navMode: 'sidebar',
            stableLayout: 1
          }
        },
        command: {
          component: 'Command',
          baseScore: 2,
          traits: {
            navMode: 'command',
            keyboardAffinity: 1,
            expertise: 'expert'
          }
        }
      }
    },
    mainContent: {
      label: 'Main content',
      kind: 'content',
      variants: {
        table: {
          component: 'Table',
          baseScore: 2,
          traits: {
            defaultView: 'table',
            density: 'compact'
          }
        },
        chart: {
          component: 'Chart',
          baseScore: 2,
          traits: {
            defaultView: 'chart',
            chartAffinity: 1,
            layoutBias: 'compare'
          }
        }
      }
    },
    quickActions: {
      label: 'Quick actions',
      kind: 'actions',
      variants: {
        prominent: {
          component: 'ProminentActions',
          baseScore: 2,
          traits: {
            quickActions: 1,
            expertise: 'novice'
          }
        },
        keyboard: {
          component: 'KeyboardActions',
          baseScore: 2,
          traits: {
            quickActions: 0.9,
            keyboardAffinity: 1,
            expertise: 'expert'
          }
        }
      }
    }
  }
});

export function createTestProfile() {
  return createUserProfile();
}

export function createTestContext() {
  return createContextSnapshot({
    surfaceId: 'dashboard.test',
    route: '/dashboard',
    viewport: {
      width: 1280,
      height: 900
    },
    deviceCategory: 'desktop',
    pointerType: 'fine',
    inputModality: 'mouse',
    timestamp: 1_700_000_000_000
  });
}
