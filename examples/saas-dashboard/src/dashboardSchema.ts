import { defineSurface } from '@adaptive-ui/core';
import type { VariantRule } from '@adaptive-ui/core';

const chartPreferenceRule: VariantRule = {
  id: 'behavior-chart-heavy',
  label: '차트 중심 행동',
  apply(context) {
    return context.behaviorSummary.chartInteractions >
      context.behaviorSummary.tableInteractions
      ? 8
      : 0;
  }
};

const keyboardRule: VariantRule = {
  id: 'behavior-keyboard-heavy',
  label: '키보드 중심 행동',
  apply(context) {
    return context.behaviorSummary.keyboardShortcuts > 2 ? 7 : 0;
  }
};

export const dashboardHomeSurface = defineSurface({
  id: 'dashboard.home',
  label: '적응형 SaaS 대시보드',
  policies: {
    hysteresisThreshold: 8,
    navCooldownMs: 180_000,
    minConfidenceDelta: 0.15
  },
  zones: {
    primaryNav: {
      label: '주요 탐색',
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
                reason: '사이드바 탐색은 태블릿과 데스크톱에서만 사용합니다.'
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
      label: '히어로',
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
                reason: '모바일 히어로는 모바일 컨텍스트에서만 표시됩니다.'
              }
          ]
        }
      }
    },
    summaryPanel: {
      label: '요약 패널',
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
      label: '메인 콘텐츠',
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
      label: '보조 패널',
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
              label: '반복적인 패널 접기',
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
      label: '빠른 액션',
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
