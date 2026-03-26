import type { AdaptiveRegisteredComponent } from './AdaptiveSlot';
import { resolvePlan } from '@adaptive-ui/core';
import type { AdaptationPlan, SurfaceSchema } from '@adaptive-ui/core';
import { useEffect, useMemo } from 'react';
import { AdaptiveSurfaceContext, useAdaptiveProviderContext } from './context';

export interface AdaptiveSurfaceProps<
  TSurface extends SurfaceSchema = SurfaceSchema
> {
  surface: TSurface['id'];
  schema: TSurface;
  components: Record<string, AdaptiveRegisteredComponent>;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: React.ReactNode;
}

function styleFromPlan(plan: AdaptationPlan): React.CSSProperties {
  return Object.fromEntries(
    Object.entries(plan.tokenOverrides)
  ) as React.CSSProperties;
}

function planSignature(plan: AdaptationPlan): string {
  return JSON.stringify({
    layoutMode: plan.layoutMode,
    disclosureLevel: plan.disclosureLevel,
    transitionMode: plan.transitionMode,
    exposureIds: plan.exposureIds,
    variants: Object.fromEntries(
      Object.entries(plan.zones).map(([zoneName, zonePlan]) => [
        zoneName,
        zonePlan.variantId
      ])
    ),
    frozen: plan.stability.frozen
  });
}

export function AdaptiveSurface<
  TSurface extends SurfaceSchema = SurfaceSchema
>({
  surface,
  schema,
  components,
  as,
  className,
  children
}: AdaptiveSurfaceProps<TSurface>) {
  const { profile, behavior, context, accountPolicy, plans, actions } =
    useAdaptiveProviderContext();
  const Component = (as ?? 'section') as keyof React.JSX.IntrinsicElements;
  const previousPlan = plans[surface];
  const previousSignature = previousPlan ? planSignature(previousPlan) : '';
  const plan = useMemo(
    () =>
      resolvePlan({
        surface: schema,
        userProfile: profile,
        behaviorSummary: behavior,
        context: {
          ...context,
          surfaceId: schema.id,
          timestamp: Math.max(
            context.timestamp,
            profile.metadata.lastUpdated,
            behavior.lastInteractionAt
          )
        },
        accountPolicy,
        previousPlan,
        now: Math.max(
          context.timestamp,
          profile.metadata.lastUpdated,
          behavior.lastInteractionAt
        )
      }),
    [accountPolicy, behavior, context, previousPlan, profile, schema]
  );
  const currentSignature = useMemo(() => planSignature(plan), [plan]);

  useEffect(() => {
    if (currentSignature !== previousSignature) {
      actions.commitPlan(plan);
    }
  }, [actions, currentSignature, plan, previousSignature]);

  return (
    <AdaptiveSurfaceContext.Provider
      value={{
        surface: schema,
        plan,
        components
      }}
    >
      <Component
        aria-label={schema.label}
        className={className}
        data-adaptive-surface={surface}
        data-density={plan.resolvedPreferences.values.density}
        data-nav-mode={plan.resolvedPreferences.values.navMode}
        data-layout-bias={plan.layoutMode}
        data-transition-mode={plan.transitionMode}
        style={styleFromPlan(plan)}
      >
        {children}
      </Component>
    </AdaptiveSurfaceContext.Provider>
  );
}
