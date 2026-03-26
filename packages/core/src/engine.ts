import {
  createBehaviorSummary,
  inferLearnedPreferences,
  trackBehaviorEvent
} from './behavior';
import { createContextSnapshot } from './context';
import {
  createBehaviorTrackedEvent,
  createPlanAppliedEvent,
  createPlanExposureEvent,
  createPlanResolvedEvent,
  createPreferenceUpdatedEvent
} from './events';
import { explainPlan as explainPlanDetails } from './explain';
import { resolvePlan as resolveAdaptivePlan } from './planner';
import {
  createUserProfile,
  hydrateProfile as hydrateProfileData,
  patchExplicitPreference,
  serializeProfile as serializeUserProfile
} from './preferences';
import { RuleBasedStrategy } from './strategies/ruleBased';
import { createMemoryStorageAdapter } from './storage/memory';
import type {
  AdaptationPlan,
  AdaptiveEngine,
  AdaptiveEngineConfig,
  AdaptiveEngineSnapshot,
  BehaviorEvent,
  ContextSnapshot,
  ManualPreferenceKey,
  ResolvePlanInput,
  SurfaceSchema,
  UserProfile
} from './types';
import { BufferedTelemetryAdapter } from './adapters';

function applyPlanToElement<SurfaceId extends string = string>(
  plan: AdaptationPlan<SurfaceId>,
  target?: HTMLElement | null
): AdaptationPlan<SurfaceId> {
  if (!target) {
    return plan;
  }

  target.dataset.adaptiveSurface = plan.surfaceId;
  target.dataset.adaptiveLayout = plan.layoutMode;
  target.dataset.adaptiveDisclosure = plan.disclosureLevel;
  target.dataset.adaptiveTransition = plan.transitionMode;

  for (const [token, value] of Object.entries(plan.tokenOverrides)) {
    target.style.setProperty(token, value);
  }

  return plan;
}

export function createAdaptiveEngine(
  config: AdaptiveEngineConfig = {}
): AdaptiveEngine {
  const storage = config.storage ?? createMemoryStorageAdapter();
  const telemetry = config.telemetry ?? new BufferedTelemetryAdapter();
  const now = config.now ?? (() => Date.now());
  const selectionStrategy = config.selectionStrategy ?? new RuleBasedStrategy();
  const persisted = storage.load();
  let profile = createUserProfile(persisted?.profile ?? config.initialProfile);
  let behavior = createBehaviorSummary(
    persisted?.behavior ?? config.initialBehavior
  );
  const surfaces = new Map<string, SurfaceSchema>(
    (config.surfaces ?? []).map((surface) => [surface.id, surface])
  );
  const plans = new Map<string, AdaptationPlan>();
  const frozenSurfaces = new Set<string>();
  let lastLearnedPersistAt = 0;

  const persist = (force = false) => {
    const currentNow = now();
    if (
      !force &&
      currentNow - lastLearnedPersistAt <
        (config.learnedPersistenceThrottleMs ?? 5_000)
    ) {
      return;
    }

    storage.save({
      profile,
      behavior
    });
    lastLearnedPersistAt = currentNow;
  };

  return {
    registerSurface(surface) {
      surfaces.set(surface.id, surface);
    },
    createBootstrapContext(partial) {
      return createContextSnapshot(partial);
    },
    resolvePlan<SurfaceId extends string = string>(
      input: Omit<ResolvePlanInput<SurfaceId>, 'strategy' | 'previousPlan'> & {
        previousPlan?: AdaptationPlan<SurfaceId>;
      }
    ) {
      if (!surfaces.has(input.surface.id)) {
        surfaces.set(input.surface.id, input.surface);
      }

      const existingPlan = plans.get(input.surface.id) as
        | AdaptationPlan<SurfaceId>
        | undefined;
      if (frozenSurfaces.has(input.surface.id) && existingPlan) {
        return {
          ...existingPlan,
          stability: {
            ...existingPlan.stability,
            frozen: true
          }
        };
      }

      const startedAt = now();
      const planInput: ResolvePlanInput<SurfaceId> = {
        ...input,
        strategy: selectionStrategy,
        behaviorSummary: input.behaviorSummary ?? behavior,
        userProfile: input.userProfile ?? profile,
        now: startedAt,
        ...((input.previousPlan ?? existingPlan)
          ? {
              previousPlan: (input.previousPlan ??
                existingPlan) as AdaptationPlan<SurfaceId>
            }
          : {})
      };
      const plan = resolveAdaptivePlan(planInput);
      plans.set(plan.surfaceId, plan);
      telemetry.emit(createPlanResolvedEvent(plan, now() - startedAt));
      telemetry.emit(createPlanExposureEvent(plan));
      return plan;
    },
    applyPlan(plan, target) {
      const appliedPlan = applyPlanToElement(plan, target);
      plans.set(plan.surfaceId, appliedPlan);
      telemetry.emit(createPlanAppliedEvent(plan));
      return appliedPlan;
    },
    updateExplicitPreference<TKey extends ManualPreferenceKey>(
      key: TKey,
      value: UserProfile['explicit'][TKey]
    ) {
      profile = patchExplicitPreference(profile, key, value);
      persist(true);
      telemetry.emit(createPreferenceUpdatedEvent(key, value));
      return profile;
    },
    trackBehavior(event: BehaviorEvent) {
      behavior = trackBehaviorEvent(behavior, event);
      profile = createUserProfile({
        ...profile,
        learned: inferLearnedPreferences(profile, behavior),
        metadata: {
          ...profile.metadata,
          lastUpdated: now(),
          source: 'learned'
        }
      });
      persist();
      telemetry.emit(
        createBehaviorTrackedEvent(event.type, {
          surfaceId: event.surfaceId,
          zoneName: event.zoneName,
          moduleId: event.moduleId
        })
      );
      return behavior;
    },
    explainPlan(plan) {
      return explainPlanDetails(plan);
    },
    serializeProfile(profileInput = profile) {
      return serializeUserProfile(profileInput);
    },
    hydrateProfile(data) {
      return hydrateProfileData(data);
    },
    getSnapshot(): AdaptiveEngineSnapshot {
      return {
        profile,
        behavior,
        surfaces: Object.fromEntries(surfaces.entries()),
        plans: Object.fromEntries(plans.entries()),
        events:
          telemetry instanceof BufferedTelemetryAdapter
            ? [...telemetry.events]
            : [],
        frozenSurfaces: [...frozenSurfaces]
      };
    },
    getProfile() {
      return profile;
    },
    getBehaviorSummary() {
      return behavior;
    },
    freezeSurface(surfaceId, frozen) {
      if (frozen) {
        frozenSurfaces.add(surfaceId);
      } else {
        frozenSurfaces.delete(surfaceId);
      }
    },
    reset() {
      profile = createUserProfile(config.initialProfile);
      behavior = createBehaviorSummary(config.initialBehavior);
      plans.clear();
      frozenSurfaces.clear();
      storage.clear();
    }
  };
}

export function applyPlan<SurfaceId extends string = string>(
  plan: AdaptationPlan<SurfaceId>,
  target?: HTMLElement | null
): AdaptationPlan<SurfaceId> {
  return applyPlanToElement(plan, target);
}

export function resolvePlan<SurfaceId extends string = string>(
  input: ResolvePlanInput<SurfaceId>
): AdaptationPlan<SurfaceId> {
  return resolveAdaptivePlan(input);
}

export function updateExplicitPreference<TKey extends ManualPreferenceKey>(
  profile: UserProfile,
  key: TKey,
  value: UserProfile['explicit'][TKey]
): UserProfile {
  return patchExplicitPreference(profile, key, value);
}

export function serializeProfile(profile: UserProfile): string {
  return serializeUserProfile(profile);
}

export function hydrateProfile(
  data: string | Partial<UserProfile>
): UserProfile {
  return hydrateProfileData(data);
}

export function createBootstrapContext<SurfaceId extends string = string>(
  partial: Partial<ContextSnapshot<SurfaceId>>
): ContextSnapshot<SurfaceId> {
  return createContextSnapshot(partial);
}
