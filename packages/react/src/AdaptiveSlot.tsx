import type { SurfaceSchema } from '@adaptive-ui/core';
import {
  useAdaptiveProviderContext,
  useAdaptiveSurfaceContext
} from './context';

export interface AdaptiveSlotComponentProps {
  surfaceId: string;
  zoneName: string;
  variantId: string;
  plan: ReturnType<typeof useAdaptiveSurfaceContext>['plan'];
  trackBehavior: ReturnType<
    typeof useAdaptiveProviderContext
  >['actions']['trackBehavior'];
}

export type AdaptiveRegisteredComponent = React.ComponentType<
  AdaptiveSlotComponentProps & Record<string, unknown>
>;

export interface AdaptiveSlotProps<
  TSurface extends SurfaceSchema = SurfaceSchema
> {
  name: keyof TSurface['zones'] & string;
  fallback?: React.ReactNode;
  componentProps?: Record<string, unknown>;
}

export function AdaptiveSlot<TSurface extends SurfaceSchema = SurfaceSchema>({
  name,
  fallback = null,
  componentProps
}: AdaptiveSlotProps<TSurface>) {
  const { plan, components } = useAdaptiveSurfaceContext();
  const { actions } = useAdaptiveProviderContext();
  const zonePlan = plan.zones[name];
  if (!zonePlan) {
    return <>{fallback}</>;
  }

  const Component = components[zonePlan.component];
  if (!Component) {
    return <>{fallback}</>;
  }

  return (
    <div data-adaptive-zone={name} data-adaptive-variant={zonePlan.variantId}>
      <Component
        {...componentProps}
        plan={plan}
        surfaceId={plan.surfaceId}
        trackBehavior={actions.trackBehavior}
        variantId={zonePlan.variantId}
        zoneName={name}
      />
    </div>
  );
}
