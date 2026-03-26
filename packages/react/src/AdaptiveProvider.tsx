import {
  createAdaptiveEngine,
  createContextSnapshot,
  createPlanExposureEvent,
  createUserProfile,
  mergeContextSnapshot
} from '@adaptive-ui/core';
import type {
  AccountPolicy,
  AdaptationPlan,
  AdaptiveEngine,
  BehaviorEvent,
  ContextSnapshot,
  SurfaceSchema,
  TelemetryEvent,
  UserProfile
} from '@adaptive-ui/core';
import { useEffect, useMemo, useState } from 'react';
import {
  createInteractionCollector,
  createMediaQueryCollector,
  createVisibilityCollector
} from '@adaptive-ui/core';
import {
  AdaptiveProviderContext,
  type AdaptiveActions,
  type AdaptiveProviderValue,
  type AdaptiveSimulationState
} from './context';

export interface AdaptiveProviderProps {
  children: React.ReactNode;
  engine?: AdaptiveEngine;
  initialProfile?: Partial<UserProfile>;
  initialContext?: Partial<ContextSnapshot>;
  accountPolicy?: AccountPolicy;
  surfaces?: SurfaceSchema[];
  collectRuntimeSignals?: boolean;
}

function appendEvent(
  current: TelemetryEvent[],
  event: TelemetryEvent
): TelemetryEvent[] {
  return [...current.slice(-49), event];
}

export function AdaptiveProvider({
  children,
  engine: providedEngine,
  initialProfile,
  initialContext,
  accountPolicy,
  surfaces,
  collectRuntimeSignals = true
}: AdaptiveProviderProps) {
  const [engine] = useState(() => {
    const nextEngine =
      providedEngine ??
      createAdaptiveEngine({
        ...(initialProfile ? { initialProfile } : {})
      });
    surfaces?.forEach((surface) => nextEngine.registerSurface(surface));
    return nextEngine;
  });
  const [profile, setProfile] = useState(() =>
    createUserProfile(initialProfile ?? engine.getProfile())
  );
  const [behavior, setBehavior] = useState(() => engine.getBehaviorSummary());
  const [context, setContext] = useState(() =>
    createContextSnapshot(initialContext ?? {})
  );
  const [plans, setPlans] = useState<Record<string, AdaptationPlan>>({});
  const [events, setEvents] = useState<TelemetryEvent[]>([]);
  const [simulation, setSimulation] = useState<AdaptiveSimulationState>({});
  const [devtoolsOpen, setDevtoolsOpen] = useState(false);
  const baselineProfile = useMemo(
    () => createUserProfile(initialProfile),
    [initialProfile]
  );
  const baselineContext = useMemo(
    () => createContextSnapshot(initialContext ?? {}),
    [initialContext]
  );

  useEffect(() => {
    if (!collectRuntimeSignals || typeof window === 'undefined') {
      return undefined;
    }

    const mediaCollector = createMediaQueryCollector();
    const interactionCollector = createInteractionCollector();
    const visibilityCollector = createVisibilityCollector();
    const unsubs = [
      mediaCollector.subscribe((system) => {
        setContext((current) =>
          mergeContextSnapshot(current, {
            system,
            pointerType: system.pointer,
            timestamp: Date.now()
          })
        );
      }),
      interactionCollector.subscribe((interaction) => {
        setContext((current) =>
          mergeContextSnapshot(current, {
            inputModality: interaction.inputModality,
            pointerType: interaction.pointerType,
            timestamp: Date.now()
          })
        );
      }),
      visibilityCollector.subscribe((visibility) => {
        setContext((current) =>
          mergeContextSnapshot(current, {
            networkIndependentHints: {
              ...current.networkIndependentHints,
              visibilityState: visibility.visibilityState
            },
            timestamp: Date.now()
          })
        );
      })
    ];

    return () => {
      unsubs.forEach((unsubscribe) => unsubscribe());
    };
  }, [collectRuntimeSignals]);

  const actions = useMemo<AdaptiveActions>(
    () => ({
      updateExplicitPreference(key, value) {
        const nextProfile = engine.updateExplicitPreference(key, value);
        setProfile(nextProfile);
        setEvents((current) =>
          appendEvent(current, {
            type: 'preference_updated',
            timestamp: Date.now(),
            payload: {
              key,
              value
            }
          })
        );
      },
      trackBehavior(event: BehaviorEvent) {
        const nextBehavior = engine.trackBehavior(event);
        setBehavior(nextBehavior);
        setProfile(engine.getProfile());
        setEvents((current) =>
          appendEvent(current, {
            type: 'behavior_tracked',
            timestamp: Date.now(),
            payload: {
              type: event.type,
              ...(event.moduleId ? { moduleId: event.moduleId } : {}),
              ...(event.zoneName ? { zoneName: event.zoneName } : {})
            },
            ...(event.surfaceId ? { surfaceId: event.surfaceId } : {})
          })
        );
      },
      patchContext(patch) {
        setContext((current) =>
          mergeContextSnapshot(current, {
            ...patch,
            timestamp: Date.now()
          })
        );
      },
      replaceProfile(patch) {
        setProfile((current) =>
          createUserProfile({
            ...current,
            ...patch,
            explicit: {
              ...current.explicit,
              ...patch.explicit
            },
            learned: {
              ...current.learned,
              ...patch.learned
            }
          })
        );
      },
      resetPreferences() {
        engine.reset();
        setProfile(baselineProfile);
        setBehavior(engine.getBehaviorSummary());
        setPlans({});
        setSimulation({});
        setContext(baselineContext);
      },
      commitPlan(plan) {
        setPlans((current) => ({
          ...current,
          [plan.surfaceId]: plan
        }));
        engine.applyPlan(plan);
        setEvents((current) =>
          appendEvent(current, createPlanExposureEvent(plan))
        );
      },
      freezeSurface(surfaceId, frozen) {
        engine.freezeSurface(surfaceId, frozen);
        setPlans((current) => {
          const existing = current[surfaceId];
          if (!existing) {
            return current;
          }

          return {
            ...current,
            [surfaceId]: {
              ...existing,
              stability: {
                ...existing.stability,
                frozen
              }
            }
          };
        });
      },
      simulateScenario(name) {
        if (name === 'novice') {
          setSimulation({ name, label: 'Novice manager' });
          setProfile((current) =>
            createUserProfile({
              ...current,
              explicit: {
                ...current.explicit,
                expertise: 'novice',
                density: 'comfortable',
                contentMode: 'summary',
                layoutBias: 'overview',
                navMode: 'sidebar'
              },
              learned: {
                ...current.learned,
                prefersSummary: 0.82,
                prefersQuickActions: 0.35,
                prefersCharts: 0.32
              }
            })
          );
          return;
        }

        if (name === 'expert') {
          setSimulation({ name, label: 'Expert analyst' });
          setProfile((current) =>
            createUserProfile({
              ...current,
              explicit: {
                ...current.explicit,
                expertise: 'expert',
                density: 'compact',
                contentMode: 'detailed',
                defaultView: 'chart',
                navMode: 'command'
              },
              learned: {
                ...current.learned,
                prefersCharts: 0.88,
                prefersKeyboardFlow: 0.9,
                prefersQuickActions: 0.78
              }
            })
          );
          return;
        }

        if (name === 'mobile') {
          setSimulation({ name, label: 'Mobile quick-check' });
          setContext((current) =>
            mergeContextSnapshot(current, {
              viewport: { width: 390, height: 844 },
              deviceCategory: 'mobile',
              pointerType: 'coarse',
              inputModality: 'touch',
              timestamp: Date.now()
            })
          );
          setProfile((current) =>
            createUserProfile({
              ...current,
              explicit: {
                ...current.explicit,
                navMode: 'bottom',
                density: 'comfortable',
                contentMode: 'summary'
              }
            })
          );
          return;
        }

        if (name === 'high-contrast') {
          setSimulation({ name, label: 'High contrast' });
          setContext((current) =>
            mergeContextSnapshot(current, {
              system: {
                ...current.system,
                contrast: 'more'
              },
              timestamp: Date.now()
            })
          );
          return;
        }

        setSimulation({ name, label: 'Reduced motion' });
        setContext((current) =>
          mergeContextSnapshot(current, {
            system: {
              ...current.system,
              reducedMotion: true
            },
            timestamp: Date.now()
          })
        );
      },
      clearSimulation() {
        setSimulation({});
        setProfile(baselineProfile);
        setContext(baselineContext);
      },
      setDevtoolsOpen(open) {
        setDevtoolsOpen(open);
      }
    }),
    [baselineContext, baselineProfile, engine]
  );

  const value = useMemo<AdaptiveProviderValue>(
    () => ({
      engine,
      profile,
      behavior,
      context,
      plans,
      events,
      simulation,
      devtoolsOpen,
      actions,
      ...(accountPolicy ? { accountPolicy } : {})
    }),
    [
      accountPolicy,
      actions,
      behavior,
      context,
      devtoolsOpen,
      engine,
      events,
      plans,
      profile,
      simulation
    ]
  );

  return (
    <AdaptiveProviderContext.Provider value={value}>
      {children}
    </AdaptiveProviderContext.Provider>
  );
}
