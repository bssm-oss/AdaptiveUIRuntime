import type { AdaptationPlan, TelemetryEvent } from './types';

export function createPlanResolvedEvent(
  plan: AdaptationPlan,
  durationMs: number
): TelemetryEvent {
  return {
    type: 'plan_resolved',
    timestamp: Date.now(),
    surfaceId: plan.surfaceId,
    payload: {
      durationMs,
      confidence: plan.confidence,
      layoutMode: plan.layoutMode,
      disclosureLevel: plan.disclosureLevel,
      transitionMode: plan.transitionMode
    }
  };
}

export function createPlanAppliedEvent(plan: AdaptationPlan): TelemetryEvent {
  return {
    type: 'plan_applied',
    timestamp: Date.now(),
    surfaceId: plan.surfaceId,
    payload: {
      exposureIds: plan.exposureIds
    }
  };
}

export function createPlanExposureEvent(plan: AdaptationPlan): TelemetryEvent {
  return {
    type: 'plan_exposure',
    timestamp: Date.now(),
    surfaceId: plan.surfaceId,
    payload: {
      zones: Object.fromEntries(
        Object.entries(plan.zones).map(([zoneName, zonePlan]) => [
          zoneName,
          zonePlan.variantId
        ])
      )
    }
  };
}

export function createPreferenceUpdatedEvent(
  key: string,
  value: unknown
): TelemetryEvent {
  return {
    type: 'preference_updated',
    timestamp: Date.now(),
    payload: {
      key,
      value
    }
  };
}

export function createBehaviorTrackedEvent(
  type: string,
  payload: Record<string, unknown>
): TelemetryEvent {
  return {
    type: 'behavior_tracked',
    timestamp: Date.now(),
    payload: {
      type,
      ...payload
    }
  };
}
