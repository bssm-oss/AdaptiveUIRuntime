# API Reference

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

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

## 한국어 요약

### core 패키지

`@adaptive-ui/core`는 실제 의사결정을 담당하는 중심 패키지입니다.
대표 API는 다음과 같습니다.

- `createAdaptiveEngine(config?)`
- `defineSurface(schema)`
- `resolvePlan(input)`
- `applyPlan(plan, target?)`
- `updateExplicitPreference(profile, key, value)`
- `serializeProfile(profile)`
- `hydrateProfile(data)`
- `createBootstrapContext(partial)`

`createAdaptiveEngine`는 profile, behavior, storage, telemetry, surface registry를 관리하는 stateful runtime을 만듭니다.
반면 `resolvePlan`은 특정 입력으로부터 deterministic `AdaptationPlan`을 계산하는 pure entrypoint입니다.

### plan 관련 핵심 타입

실제로 자주 보게 되는 타입은 다음입니다.

- `UserProfile`
- `ContextSnapshot`
- `BehaviorSummary`
- `SurfaceSchema`
- `AdaptationPlan`
- `StorageAdapter`
- `TelemetryAdapter`
- `ExperimentAdapter`
- `SelectionStrategy`

`AdaptationPlan`은 zone별 variant 선택, token override, reasoning trace, confidence, stability metadata를 포함합니다.

### React 패키지

`@adaptive-ui/react`는 core 위에 얇게 얹는 adapter입니다.
대표 구성요소는 다음과 같습니다.

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`
- hooks: `useAdaptivePlan`, `useAdaptivePreference`, `useAdaptiveActions`, `useAdaptiveWhy`, `useAdaptiveDevtools`

`AdaptiveProvider`는 engine, profile, behavior, context, devtools state를 제공합니다.
`AdaptiveSurface`는 주어진 schema로 plan을 계산하고 렌더 컨텍스트를 만듭니다.
`AdaptiveSlot`은 현재 plan에 맞는 등록된 component variant를 렌더합니다.

### Devtools 패키지

`@adaptive-ui/devtools`는 현재 선택된 plan과 why trace를 시각적으로 확인하는 용도입니다.
주요 컴포넌트는 다음 두 가지입니다.

- `AdaptiveDevtoolsPanel`
- `AdaptiveDevtoolsOverlay`

panel은 직접 배치할 때 쓰고, overlay는 화면 위에 떠 있는 도구 형태로 빠르게 붙일 때 적합합니다.

### OTel 패키지

`@adaptive-ui/otel`의 `createOpenTelemetryAdapter(config?)`는 core telemetry event를 OpenTelemetry exporter로 연결합니다.

주요 설정값은 다음과 같습니다.

- `serviceName`
- `traceUrl`
- `metricsUrl`
- `headers`
- `exportIntervalMillis`

반환된 adapter는 최소한 `emit(event)`와 `shutdown()`을 지원합니다.
