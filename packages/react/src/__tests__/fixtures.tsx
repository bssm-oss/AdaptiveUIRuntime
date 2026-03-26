import {
  createAdaptiveEngine,
  createUserProfile,
  defineSurface
} from '@adaptive-ui/core';
import type { SurfaceSchema } from '@adaptive-ui/core';
import {
  AdaptiveProvider,
  AdaptiveSlot,
  AdaptiveSurface,
  useAdaptiveActions
} from '..';

export const surface = defineSurface({
  id: 'dashboard.react',
  label: 'React test surface',
  zones: {
    hero: {
      label: 'Hero',
      kind: 'content',
      defaultVariant: 'novice',
      variants: {
        novice: {
          component: 'NoviceHero',
          baseScore: 2,
          traits: {
            expertise: 'novice'
          }
        },
        expert: {
          component: 'ExpertHero',
          baseScore: 2,
          traits: {
            expertise: 'expert',
            keyboardAffinity: 1
          }
        }
      }
    }
  }
});

export const registry = {
  NoviceHero: () => <div>Novice hero</div>,
  ExpertHero: () => <div>Expert hero</div>
};

export function ReactHarness({
  children,
  initialProfile
}: {
  children?: React.ReactNode;
  initialProfile?: Parameters<typeof AdaptiveProvider>[0]['initialProfile'];
}) {
  const engine = createAdaptiveEngine();
  return (
    <AdaptiveProvider
      engine={engine}
      {...(initialProfile ? { initialProfile } : {})}
      initialContext={{
        surfaceId: 'dashboard.react',
        route: '/react',
        viewport: { width: 1024, height: 768 }
      }}
    >
      <AdaptiveSurface
        surface="dashboard.react"
        schema={surface as SurfaceSchema}
        components={registry}
      >
        <AdaptiveSlot name="hero" />
        {children}
      </AdaptiveSurface>
    </AdaptiveProvider>
  );
}

export function createExpertInitialProfile() {
  return {
    ...createUserProfile(),
    explicit: {
      ...createUserProfile().explicit,
      expertise: 'expert' as const
    }
  };
}

export function OverrideButton() {
  const actions = useAdaptiveActions();
  return (
    <button
      type="button"
      onClick={() => actions.updateExplicitPreference('expertise', 'expert')}
    >
      Switch to expert
    </button>
  );
}
