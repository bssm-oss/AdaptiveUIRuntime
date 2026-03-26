# Recipes

This document shows concrete integration patterns for host applications.

## Add Adaptive UI To An Existing Dashboard

### Step 1: Define the surface

Create a schema that matches the host screen.

```ts
const surface = defineSurface({
  id: 'dashboard.home',
  label: 'Home dashboard',
  zones: {
    mainContent: {
      label: 'Main content',
      kind: 'content',
      defaultVariant: 'table',
      variants: {
        table: {
          component: 'TableView',
          traits: { defaultView: 'table' }
        },
        chart: {
          component: 'ChartView',
          traits: { defaultView: 'chart', chartAffinity: 1 }
        }
      }
    }
  }
});
```

### Step 2: Provide a registry

```tsx
const registry = {
  TableView: DashboardTable,
  ChartView: DashboardChart
};
```

### Step 3: Render with provider, surface, and slot

```tsx
<AdaptiveProvider
  engine={engine}
  initialContext={{ surfaceId: 'dashboard.home' }}
>
  <AdaptiveSurface
    surface="dashboard.home"
    schema={surface}
    components={registry}
  >
    <AdaptiveSlot name="mainContent" />
  </AdaptiveSurface>
</AdaptiveProvider>
```

## Persist Preferences Locally

Use the built-in local storage adapter:

```ts
import {
  createAdaptiveEngine,
  createLocalStorageAdapter
} from '@adaptive-ui/core';

const engine = createAdaptiveEngine({
  storage: createLocalStorageAdapter('my-product.adaptive-ui')
});
```

## Provide Custom Storage

Implement `StorageAdapter` if you need encrypted, cookie-based, or hybrid persistence:

```ts
const storage: StorageAdapter = {
  load() {
    return null;
  },
  save(state) {
    console.log('persisted', state);
  },
  clear() {}
};
```

## Track Behavior Without Spamming Raw Events

Prefer meaningful aggregated events:

```ts
actions.trackBehavior({
  type: 'chart_interaction',
  surfaceId: 'dashboard.home',
  zoneName: 'mainContent'
});
```

Good behavior events represent stable intent.
They should not mirror every DOM event.

## Render Why Trace In Product UI

```tsx
const why = useAdaptiveWhy('dashboard.home');

return (
  <aside>
    {why?.summary.map((line) => (
      <div key={line}>{line}</div>
    ))}
  </aside>
);
```

## Integrate Devtools

```tsx
import { AdaptiveDevtoolsOverlay } from '@adaptive-ui/devtools';

<AdaptiveDevtoolsOverlay surfaceId="dashboard.home" />;
```

This is useful in:

- development
- QA
- design reviews
- experimentation analysis

## Validate As A Real Consumer

This repository includes a consumer-style smoke package in `tests/usage`.

Use it when you want to verify that:

- the built workspace packages can be imported by a downstream app
- server-side rendering works with `@adaptive-ui/react`
- explicit preferences still win over learned behavior
- learned behavior still changes the selected variant when the relevant preference is `auto`

Run it with:

```bash
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test:usage
```

Important detail:

- this test should consume the built package entrypoints
- it should not alias `@adaptive-ui/core` or `@adaptive-ui/react` directly to `src/*`
- if you alias to source files, you are testing local source transpilation semantics instead of the package contract that users actually install

The current smoke scenario covers:

1. summary-first rendering from an explicit profile
2. chart-first rendering after an explicit override
3. chart-first rendering after repeated chart interaction updates the learned profile

## Use The Runtime On The Server

Use the pure resolver directly:

```ts
const plan = resolvePlan({
  surface,
  userProfile,
  context: createBootstrapContext({
    surfaceId: 'dashboard.home',
    route: '/dashboard',
    viewport: { width: 1280, height: 800 }
  })
});
```

Then pass the same profile and context into the client provider.

## Use OpenTelemetry Export

```ts
import { createAdaptiveEngine } from '@adaptive-ui/core';
import { createOpenTelemetryAdapter } from '@adaptive-ui/otel';

const telemetry = createOpenTelemetryAdapter({
  serviceName: 'dashboard-web',
  traceUrl: 'https://collector.example.com/v1/traces',
  metricsUrl: 'https://collector.example.com/v1/metrics'
});

const engine = createAdaptiveEngine({
  telemetry
});
```

## Simulate Personas In Development

The React adapter exposes simulation helpers through provider actions.

Useful presets in the current implementation:

- novice
- expert
- mobile
- high-contrast
- reduced-motion

These presets are intended for:

- manual QA
- design review
- demos

## Migrate From One Static Surface To Adaptive Surface

Recommended sequence:

1. start with one surface only
2. define one or two adaptive zones, not every region
3. keep the default variant equal to the current production UI
4. add one learned dimension at a time
5. validate with devtools and E2E before widening the scope
