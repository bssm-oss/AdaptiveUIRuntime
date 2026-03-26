# API Reference

This document summarizes the public API exposed by the current implementation.

## Core Package: `@adaptive-ui/core`

## `createAdaptiveEngine(config?)`

Creates a stateful runtime engine that manages:

- profile state
- behavior state
- registered surfaces
- resolved plans
- telemetry emission
- persistence

Use this in application code when you want a long-lived runtime object.

## `defineSurface(schema)`

Identity helper for surface schemas.
Its main purpose is preserving type inference for surface ids, zone names, and variant names.

## `resolvePlan(input)`

Pure plan resolution function.
Use this when:

- rendering on the server
- writing deterministic tests
- benchmarking planner behavior
- integrating outside React

Input includes:

- `surface`
- `userProfile`
- `context`
- optional `behaviorSummary`
- optional `accountPolicy`
- optional `previousPlan`
- optional `strategy`
- optional `now`

Returns an `AdaptationPlan`.

## `applyPlan(plan, target?)`

Applies a plan to a target element by writing:

- data attributes
- CSS custom properties

This is intentionally minimal.
Complex rendering belongs in framework adapters.

## `updateExplicitPreference(profile, key, value)`

Pure helper for producing a new `UserProfile` with an updated explicit setting.

The engine instance also exposes a stateful version:

- `engine.updateExplicitPreference(key, value)`

## `serializeProfile(profile)`

Serializes the profile to JSON.
Useful for:

- export
- storage
- SSR embedding

## `hydrateProfile(data)`

Hydrates a profile from serialized JSON or a partial object and fills missing defaults.

## `createBootstrapContext(partial)`

Creates a fully normalized context snapshot from partial input.

## Engine Instance Methods

The engine instance currently exposes:

- `registerSurface(surface)`
- `createBootstrapContext(partial)`
- `resolvePlan(input)`
- `applyPlan(plan, target?)`
- `updateExplicitPreference(key, value)`
- `trackBehavior(event)`
- `explainPlan(plan)`
- `serializeProfile(profile?)`
- `hydrateProfile(data)`
- `getSnapshot()`
- `getProfile()`
- `getBehaviorSummary()`
- `freezeSurface(surfaceId, frozen)`
- `reset()`

## Important Types

Core public types include:

- `UserProfile`
- `ContextSnapshot`
- `SurfaceSchema`
- `AdaptationPlan`
- `SelectionStrategy`
- `StorageAdapter`
- `TelemetryAdapter`
- `ExperimentAdapter`

## React Package: `@adaptive-ui/react`

## `AdaptiveProvider`

Top-level runtime provider.

Important props:

- `engine`
- `initialProfile`
- `initialContext`
- `accountPolicy`
- `surfaces`
- `collectRuntimeSignals`

## `AdaptiveSurface`

Wraps a domain surface.

Important props:

- `surface`
- `schema`
- `components`
- `as`
- `className`

It computes a plan and exposes it to descendant slots.

## `AdaptiveSlot`

Renders the selected component for a zone.

Important props:

- `name`
- `fallback`
- `componentProps`

## Hooks

### `useAdaptivePlan(surfaceId)`

Returns the current plan for a surface, if any.

### `useAdaptivePreference(key)`

Returns:

- current explicit value
- setter function

### `useAdaptiveActions()`

Returns the provider action set:

- update explicit preference
- track behavior
- patch context
- replace profile
- reset preferences
- commit plan
- freeze surface
- simulate scenario
- clear simulation
- toggle devtools open state

### `useAdaptiveWhy(surfaceId)`

Returns the explainability summary for a surface.

### `useAdaptiveDevtools()`

Returns the provider state shaped for inspection UIs.

## Devtools Package: `@adaptive-ui/devtools`

## `AdaptiveDevtoolsPanel`

Renders the inspection panel inline.

## `AdaptiveDevtoolsOverlay`

Renders the same panel in a fixed overlay position.

## OTel Package: `@adaptive-ui/otel`

## `createOpenTelemetryAdapter(config?)`

Creates a telemetry adapter that exports runtime events through OTLP HTTP traces and metrics.

Config includes:

- `serviceName`
- `traceUrl`
- `metricsUrl`
- `headers`
- `exportIntervalMillis`

Returned adapter supports:

- `emit(event)`
- `shutdown()`
