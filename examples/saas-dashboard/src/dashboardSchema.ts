import { defineSurface } from '@adaptive-ui/core';
import type { VariantRule } from '@adaptive-ui/core';

const chartPreferenceRule: VariantRule = {
  id: 'behavior-chart-heavy',
  label: 'Chart heavy behavior',
  apply(context) {
    return context.behaviorSummary.chartInteractions >
      context.behaviorSummary.tableInteractions
      ? 8
      : 0;
  }
};

const keyboardRule: VariantRule = {
  id: 'behavior-keyboard-heavy',
  label: 'Keyboard heavy behavior',
  apply(context) {
    return context.behaviorSummary.keyboardShortcuts > 2 ? 7 : 0;
  }
};

export const dashboardHomeSurface = defineSurface({
  id: 'dashboard.home',
  label: 'Adaptive SaaS dashboard',
  policies: {
    hysteresisThreshold: 8,
    navCooldownMs: 180_000,
    minConfidenceDelta: 0.15
  },
  zones: {
    primaryNav: {
      label: 'Primary navigation',
      kind: 'navigation',
      defaultVariant: 'sidebarNav',
      variants: {
        sidebarNav: {
          component: 'SidebarNav',
          baseScore: 2,
          tokenOverrides: {
            '--nav-width': '15rem'
          },
          traits: {
            navMode: 'sidebar',
            stableLayout: 1
          },
          eligibility: [
            (context) =>
              context.context.deviceCategory !== 'mobile' || {
                eligible: false,
                reason: 'Sidebar nav is reserved for tablet and desktop.'
              }
          ]
        },
        tabsNav: {
          component: 'TabsNav',
          baseScore: 1,
          traits: {
            navMode: 'tabs',
            stableLayout: 0.9
          }
        },
        bottomNav: {
          component: 'BottomNav',
          baseScore: 1,
          tokenOverrides: {
            '--surface-gap': '0.875rem'
          },
          traits: {
            navMode: 'bottom',
            touchComfort: 1,
            stableLayout: 0.72
          }
        },
        commandNav: {
          component: 'CommandNav',
          baseScore: 2,
          traits: {
            navMode: 'command',
            keyboardAffinity: 1,
            expertise: 'expert',
            quickActions: 0.8
          },
          rules: [keyboardRule]
        }
      }
    },
    hero: {
      label: 'Hero',
      kind: 'content',
      defaultVariant: 'noviceHero',
      variants: {
        noviceHero: {
          component: 'NoviceHero',
          baseScore: 2,
          tokenOverrides: {
            '--hero-accent': 'rgba(37, 99, 235, 0.14)'
          },
          traits: {
            expertise: 'novice',
            summaryAffinity: 0.8
          }
        },
        expertHero: {
          component: 'ExpertHero',
          baseScore: 2,
          tokenOverrides: {
            '--hero-accent': 'rgba(14, 165, 233, 0.16)'
          },
          traits: {
            expertise: 'expert',
            density: 'compact',
            chartAffinity: 0.7
          }
        },
        mobileHero: {
          component: 'MobileHero',
          baseScore: 2,
          tokenOverrides: {
            '--hero-accent': 'rgba(56, 189, 248, 0.12)'
          },
          traits: {
            navMode: 'bottom',
            summaryAffinity: 0.7,
            touchComfort: 1
          },
          eligibility: [
            (context) =>
              context.context.deviceCategory === 'mobile' || {
                eligible: false,
                reason: 'Mobile hero only appears for mobile contexts.'
              }
          ]
        }
      }
    },
    summaryPanel: {
      label: 'Summary panel',
      kind: 'content',
      defaultVariant: 'summaryCards',
      variants: {
        summaryCards: {
          component: 'SummaryCards',
          baseScore: 2,
          traits: {
            contentMode: 'summary',
            summaryAffinity: 1
          }
        },
        detailedSummary: {
          component: 'DetailedSummary',
          baseScore: 2,
          traits: {
            contentMode: 'detailed',
            summaryAffinity: -0.4,
            chartAffinity: 0.4
          }
        },
        progressiveSummary: {
          component: 'ProgressiveSummary',
          baseScore: 2,
          traits: {
            contentMode: 'progressive',
            expertise: 'novice',
            summaryAffinity: 0.5
          }
        }
      }
    },
    mainContent: {
      label: 'Main content',
      kind: 'content',
      defaultVariant: 'tablePowerView',
      variants: {
        tablePowerView: {
          component: 'TablePowerView',
          baseScore: 2,
          traits: {
            defaultView: 'table',
            density: 'compact',
            stableLayout: 1
          }
        },
        chartPowerView: {
          component: 'ChartPowerView',
          baseScore: 2,
          traits: {
            defaultView: 'chart',
            chartAffinity: 1,
            layoutBias: 'compare'
          },
          rules: [chartPreferenceRule]
        },
        cardPowerView: {
          component: 'CardPowerView',
          baseScore: 2,
          traits: {
            defaultView: 'cards',
            contentMode: 'summary',
            summaryAffinity: 0.7
          }
        }
      }
    },
    sidePanel: {
      label: 'Side panel',
      kind: 'support',
      defaultVariant: 'insightsRail',
      variants: {
        onboardingRail: {
          component: 'OnboardingRail',
          baseScore: 1,
          traits: {
            expertise: 'novice',
            summaryAffinity: 0.6
          }
        },
        insightsRail: {
          component: 'InsightsRail',
          baseScore: 2,
          traits: {
            expertise: 'expert',
            chartAffinity: 0.7
          }
        },
        collapsedRail: {
          component: 'CollapsedRail',
          baseScore: 1,
          traits: {
            stableLayout: 0.9
          },
          rules: [
            {
              id: 'behavior-collapse-rail',
              label: 'Repeated rail collapse',
              apply(context) {
                return (context.behaviorSummary.widgetCollapses.sidePanel ??
                  0) > 1
                  ? 8
                  : 0;
              }
            }
          ]
        }
      }
    },
    quickActions: {
      label: 'Quick actions',
      kind: 'actions',
      defaultVariant: 'prominentActions',
      variants: {
        prominentActions: {
          component: 'ProminentActions',
          baseScore: 2,
          traits: {
            quickActions: 1,
            expertise: 'novice'
          }
        },
        minimalActions: {
          component: 'MinimalActions',
          baseScore: 1,
          traits: {
            quickActions: -0.2,
            stableLayout: 1
          }
        },
        keyboardActions: {
          component: 'KeyboardActions',
          baseScore: 2,
          traits: {
            quickActions: 0.9,
            keyboardAffinity: 1,
            expertise: 'expert'
          },
          rules: [keyboardRule]
        }
      }
    }
  }
});

export type DashboardHomeSurface = typeof dashboardHomeSurface;
