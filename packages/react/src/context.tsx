import { createContext, useContext } from 'react';
import type {
  AccountPolicy,
  AdaptationPlan,
  AdaptiveEngine,
  BehaviorEvent,
  BehaviorSummary,
  ContextSnapshot,
  ManualPreferenceKey,
  SurfaceSchema,
  TelemetryEvent,
  UserProfile
} from '@adaptive-ui/core';

export interface AdaptiveSimulationState {
  label?: string;
}

export interface AdaptiveActions {
  updateExplicitPreference<TKey extends ManualPreferenceKey>(
    key: TKey,
    value: UserProfile['explicit'][TKey]
  ): void;
  trackBehavior(event: BehaviorEvent): void;
  patchContext(patch: Partial<ContextSnapshot>): void;
  replaceProfile(patch: Partial<UserProfile>): void;
  resetPreferences(): void;
  commitPlan(plan: AdaptationPlan): void;
  freezeSurface(surfaceId: string, frozen: boolean): void;
  simulateScenario(
    name: 'novice' | 'expert' | 'mobile' | 'high-contrast' | 'reduced-motion'
  ): void;
  clearSimulation(): void;
  setDevtoolsOpen(open: boolean): void;
}

export interface AdaptiveProviderValue {
  engine: AdaptiveEngine;
  profile: UserProfile;
  behavior: BehaviorSummary;
  context: ContextSnapshot;
  accountPolicy?: AccountPolicy | undefined;
  plans: Record<string, AdaptationPlan>;
  events: TelemetryEvent[];
  simulation: AdaptiveSimulationState;
  devtoolsOpen: boolean;
  actions: AdaptiveActions;
}

export interface SurfaceRenderContextValue {
  surface: SurfaceSchema;
  plan: AdaptationPlan;
  components: Record<
    string,
    import('./AdaptiveSlot').AdaptiveRegisteredComponent
  >;
}

export const AdaptiveProviderContext =
  createContext<AdaptiveProviderValue | null>(null);
export const AdaptiveSurfaceContext =
  createContext<SurfaceRenderContextValue | null>(null);

export function useAdaptiveProviderContext(): AdaptiveProviderValue {
  const value = useContext(AdaptiveProviderContext);
  if (!value) {
    throw new Error('AdaptiveProvider is required.');
  }
  return value;
}

export function useAdaptiveSurfaceContext(): SurfaceRenderContextValue {
  const value = useContext(AdaptiveSurfaceContext);
  if (!value) {
    throw new Error('AdaptiveSurface is required.');
  }
  return value;
}
