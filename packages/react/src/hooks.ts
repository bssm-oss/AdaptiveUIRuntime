import { explainPlan } from '@adaptive-ui/core';
import type { ManualPreferenceKey } from '@adaptive-ui/core';
import { useMemo } from 'react';
import { useAdaptiveProviderContext } from './context';

export function useAdaptivePlan(surfaceId: string) {
  return useAdaptiveProviderContext().plans[surfaceId];
}

export function useAdaptivePreference<TKey extends ManualPreferenceKey>(
  key: TKey
) {
  const { profile, actions } = useAdaptiveProviderContext();
  return {
    value: profile.explicit[key],
    setValue: (value: (typeof profile.explicit)[TKey]) =>
      actions.updateExplicitPreference(key, value)
  };
}

export function useAdaptiveActions() {
  return useAdaptiveProviderContext().actions;
}

export function useAdaptiveWhy(surfaceId: string) {
  const { plans } = useAdaptiveProviderContext();
  return useMemo(() => {
    const plan = plans[surfaceId];
    return plan ? explainPlan(plan) : undefined;
  }, [plans, surfaceId]);
}

export function useAdaptiveDevtools() {
  const value = useAdaptiveProviderContext();
  return {
    currentSurface: Object.keys(value.plans)[0],
    profile: value.profile,
    behavior: value.behavior,
    context: value.context,
    plans: value.plans,
    events: value.events,
    simulation: value.simulation,
    devtoolsOpen: value.devtoolsOpen,
    actions: value.actions
  };
}
