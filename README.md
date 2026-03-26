# Adaptive UI Runtime

Adaptive UI Runtime is an open-source JavaScript/TypeScript library for building safe, deterministic, explainable adaptive interfaces on top of an existing design system.

It is not a text-to-UI generator.
It does not render arbitrary HTML from prompts.
It does not call an LLM in the critical render path.

Instead, it resolves an `AdaptationPlan` for a known product surface and uses that plan to select approved variants inside approved slots under explicit policy, accessibility, stability, and performance constraints.

## Table Of Contents

- [What This Project Is](#what-this-project-is)
- [What This Project Is Not](#what-this-project-is-not)
- [Why Constrained Adaptation](#why-constrained-adaptation)
- [Core Principles](#core-principles)
- [Supported Adaptation Scope](#supported-adaptation-scope)
- [Explicit Preferences Vs Learned Preferences](#explicit-preferences-vs-learned-preferences)
- [Architecture At A Glance](#architecture-at-a-glance)
- [Package Overview](#package-overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Data Model](#core-data-model)
- [Plan-Based Rendering](#plan-based-rendering)
- [Why Trace](#why-trace)
- [Runtime Pipeline](#runtime-pipeline)
- [Design System Integration](#design-system-integration)
- [React Integration](#react-integration)
- [SSR And Hydration](#ssr-and-hydration)
- [Browser API Usage](#browser-api-usage)
- [Privacy And Storage](#privacy-and-storage)
- [Accessibility Principles](#accessibility-principles)
- [Performance Principles](#performance-principles)
- [When Personalization Must Not Apply](#when-personalization-must-not-apply)
- [Example App](#example-app)
- [Public API Summary](#public-api-summary)
- [Testing And Verification](#testing-and-verification)
- [Development Commands](#development-commands)
- [Documentation Map](#documentation-map)
- [Testing Guide](./docs/testing.md)

## What This Project Is

Adaptive UI Runtime is a personalization runtime for domain applications such as:

- SaaS dashboards
- operations consoles
- internal admin tools
- education products
- analytics products
- commerce back offices

The runtime helps product teams adapt:

- layout density
- disclosure depth
- navigation pattern
- default view
- panel prominence
- quick action prominence
- token packs
- optional module priority

The adaptation happens inside a bounded system:

- surfaces are declared in code
- zones are explicit
- variants are pre-approved
- component mapping is controlled by the app
- token overrides stay within the design system contract

## What This Project Is Not

This project intentionally does not do the following:

- free-form UI generation
- runtime prompt-to-DOM generation
- hidden or opaque autonomous personalization
- network-dependent first-paint personalization
- personalization that overrides explicit user settings
- personalization that breaks focus, structure, or legal UI

If a product needs arbitrary generation, this library is the wrong layer.
If a product needs safe adaptation of an existing product surface, this library is the intended layer.

## Why Constrained Adaptation

Free generation is attractive in demos but dangerous in production workflow UI.
Product teams need:

- predictable semantics
- SSR safety
- accessibility guarantees
- auditability
- stable experimentation
- testability

Constrained adaptation gives those guarantees because the runtime is only choosing among options that the product team has already declared safe.

## Core Principles

1. Determinism first.
   The same input should produce the same plan.
2. Accessibility before optimization.
   Reduced motion, contrast, keyboard access, and focus preservation win over adaptation.
3. Explicit preference before inference.
   User intent beats automatic heuristics.
4. Stability before cleverness.
   Small signal changes should not make the UI oscillate.
5. Local-first by default.
   Initial adaptation should not need a network request.
6. Plan, not DOM.
   The engine resolves a plan; the adapter renders it.

## Supported Adaptation Scope

V1 focuses on constrained adaptation of:

- density: `compact | comfortable | auto`
- content mode: `summary | detailed | progressive | auto`
- navigation mode: `sidebar | tabs | bottom | command | auto`
- default view: `table | chart | cards | auto`
- layout bias: `focus | overview | compare | auto`
- expertise mode: `novice | regular | expert | auto`
- quick action prominence
- onboarding assistance visibility
- optional panel or widget priority
- token overrides for theme, contrast, motion, and density-sensitive spacing

## Explicit Preferences Vs Learned Preferences

### Explicit preferences

Explicit preferences are chosen by the user or set through a policy surface.
Examples:

- theme
- density
- nav mode
- default view
- content mode
- expertise

These are treated as direct intent and win over learned signals.

### Learned preferences

Learned preferences are deterministic numeric signals derived from low-cost aggregated behavior.
Examples:

- chart affinity
- summary affinity
- keyboard-flow preference
- quick-action preference
- stable-layout preference

These values influence only dimensions that are still set to `auto`.

### Why both exist

If the runtime only uses explicit settings, it becomes a manual preferences panel.
If it only uses learned behavior, it becomes hard to trust.
Using both gives control plus optimization.

## Architecture At A Glance

```text
Surface Schema + User Profile + Context Snapshot + Behavior Summary
                              |
                              v
                 resolveEffectivePreferences()
                              |
                              v
                   eligibility + scoring + guards
                              |
                              v
                   hysteresis + cooldown + tie-break
                              |
                              v
                        AdaptationPlan
                              |
                              v
                 React adapter / custom renderer
```

## Package Overview

- `@adaptive-ui/core`
  Pure deterministic engine, schemas, storage adapters, collectors, scoring, guards, and explainability.
- `@adaptive-ui/react`
  Thin adapter that computes plans and renders registered variants through slots.
- `@adaptive-ui/devtools`
  Panel and overlay for inspecting active plans, scores, rule contributions, simulations, and freeze state.
- `@adaptive-ui/otel`
  Vendor-neutral telemetry bridge that exports runtime telemetry through OpenTelemetry OTLP HTTP exporters.
- `examples/saas-dashboard`
  Example Vite React app demonstrating constrained adaptation with three personas.

## Installation

```bash
pnpm add @adaptive-ui/core @adaptive-ui/react
```

Optional packages:

```bash
pnpm add @adaptive-ui/devtools
pnpm add @adaptive-ui/otel
```

For local development in this repository, the shell currently needs `/opt/homebrew/bin` on `PATH`:

```bash
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm install
```

## Quick Start

```tsx
import { createAdaptiveEngine, defineSurface } from '@adaptive-ui/core';
import {
  AdaptiveProvider,
  AdaptiveSurface,
  AdaptiveSlot
} from '@adaptive-ui/react';

const engine = createAdaptiveEngine();

const dashboardSurface = defineSurface({
  id: 'dashboard.home',
  label: 'Dashboard',
  zones: {
    mainContent: {
      label: 'Main content',
      kind: 'content',
      defaultVariant: 'table',
      variants: {
        table: {
          component: 'TableView',
          baseScore: 2,
          traits: {
            defaultView: 'table',
            density: 'compact'
          }
        },
        chart: {
          component: 'ChartView',
          baseScore: 2,
          traits: {
            defaultView: 'chart',
            chartAffinity: 1,
            layoutBias: 'compare'
          }
        }
      }
    }
  }
});

const registry = {
  TableView: () => <div>Table view</div>,
  ChartView: () => <div>Chart view</div>
};

export function App() {
  return (
    <AdaptiveProvider
      engine={engine}
      initialContext={{
        surfaceId: 'dashboard.home',
        route: '/dashboard',
        viewport: { width: 1280, height: 800 }
      }}
    >
      <AdaptiveSurface
        surface="dashboard.home"
        schema={dashboardSurface}
        components={registry}
      >
        <AdaptiveSlot name="mainContent" />
      </AdaptiveSurface>
    </AdaptiveProvider>
  );
}
```

## Core Data Model

### User profile

The user profile has three major layers:

- `explicit`
- `learned`
- `metadata`

Representative fields:

- `theme`
- `density`
- `motion`
- `contrast`
- `navMode`
- `expertise`
- `contentMode`
- `defaultView`
- `layoutBias`
- `pinnedModules`
- `hiddenOptionalModules`

### Context snapshot

The context snapshot describes the current runtime environment without depending on a network round trip:

- viewport size
- container size
- device category
- pointer type
- input modality
- locale
- timezone
- route
- surface id
- feature flags
- server hints
- system preferences

### Surface schema

Each surface declares:

- `id`
- `label`
- `zones`
- `defaults`
- `policies`
- `hardConstraints`

Each zone declares:

- `label`
- `kind`
- `defaultVariant`
- `variants`

Each variant declares:

- `component`
- `baseScore`
- `tokenOverrides`
- `traits`
- `eligibility`
- `rules`

### Adaptation plan

The plan is the final output of the engine.
It includes:

- selected variant per zone
- token overrides
- layout mode
- disclosure level
- transition mode
- confidence
- reasoning trace
- stability metadata
- exposure ids

## Plan-Based Rendering

The engine does not manipulate DOM trees directly.
This is intentional.

Advantages of plan-based rendering:

- SSR and hydration can share the same initial plan
- tests can assert on plan outputs without a renderer
- analytics can attach to exposure ids and reasons
- adapters can remain thin
- devtools can inspect the same object the renderer uses

## Why Trace

Every plan exposes explainability data:

- preference source per resolved dimension
- per-zone score contributions
- blocked variants and reasons
- stability decisions
- strategy decisions

This lets both product teams and end users answer:

- why is this layout compact?
- why is the chart view selected?
- why did the nav not switch?
- which rule was blocked by policy or eligibility?

## Runtime Pipeline

### 1. Bootstrap

The runtime loads:

- explicit preferences
- persisted learned state
- initial system preferences
- initial runtime context

### 2. Observe

Collectors normalize browser state:

- media query state
- viewport and container size
- visibility
- input modality
- performance timing
- storage changes

### 3. Infer

Raw events are aggregated into low-cost behavior summaries.
These summaries update learned preference scores deterministically.

### 4. Plan

The engine:

- resolves effective preferences
- checks hard constraints
- filters ineligible variants
- scores variants
- applies the strategy
- applies hysteresis and cooldown
- emits the plan and why trace

### 5. Apply

The adapter:

- picks the mapped component
- applies data attributes
- applies token overrides
- avoids imperative layout mutation

### 6. Persist

- explicit preferences save immediately
- learned state saves on a throttle

### 7. Measure

- plan resolution events
- plan exposure events
- behavior tracking events
- preference update events

## Design System Integration

This library is intentionally design-system friendly.

It integrates through:

- component registries
- zone-based composition
- token overrides
- CSS variables
- stable slot contracts

It does not require:

- one styling solution
- one CSS methodology
- one component library

You can integrate with Tailwind, vanilla CSS, CSS Modules, or CSS-in-JS as long as the app can render registered variants.

## React Integration

The React adapter provides:

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`
- `useAdaptivePlan`
- `useAdaptivePreference`
- `useAdaptiveActions`
- `useAdaptiveWhy`
- `useAdaptiveDevtools`

The intended pattern is:

1. mount one provider near the app shell
2. provide initial context or server hints
3. define one surface schema per domain screen
4. render registered variants through slots
5. keep business logic in the host app, not inside the adaptive runtime

## SSR And Hydration

The runtime is designed so the initial plan can be resolved on the server and reused on the client.

Important rules:

- use deterministic inputs on both sides
- do not rely on asynchronous network personalization during hydration
- refine post-hydration only when stability rules allow it
- preserve focus and semantic structure

The repo includes a React hydration test that checks deterministic initial markup behavior.

## Browser API Usage

Collectors currently cover:

- `matchMedia`
- `ResizeObserver`
- `visibilitychange`
- pointer and keyboard modality
- `localStorage` synchronization
- `performance.now()`
- View Transition support detection

These APIs are isolated to collectors so the planning core stays reusable in SSR and tests.

## Privacy And Storage

V1 is local-first and privacy-conscious.

Default behavior:

- explicit preferences: local storage
- learned preferences: local storage
- no user id required for event schema
- no PII collection by default

The storage contract is an interface, so server sync can be added later without changing core planner semantics.

## Accessibility Principles

Accessibility has priority over personalization.

Key guarantees:

- keyboard users keep reliable focus flow
- reduced motion overrides transition-heavy behavior
- contrast preferences are respected
- important actions are not hidden
- meaningfully equivalent task structure stays stable
- reset to defaults is always available

## Performance Principles

- no network dependency in initial personalization
- no runtime LLM calls
- deterministic rule-based scoring
- low-overhead collectors
- local-first persistence
- minimal adapter work on re-render
- token and data-attribute application instead of imperative layout hacks

## When Personalization Must Not Apply

Do not adapt away:

- legal disclosures
- policy-critical controls
- accessibility affordances
- user-locked settings
- focus location
- primary task semantics
- stable landmarks and heading structure

This library is intentionally conservative.

## Example App

The example app in `examples/saas-dashboard` demonstrates:

- novice manager mode
- expert analyst mode
- mobile quick-check mode
- theme and density persistence
- reduced motion handling
- devtools inspection
- plan freezing
- behavior-driven learned updates

## Public API Summary

### Core

- `createAdaptiveEngine(config)`
- `defineSurface(schema)`
- `resolvePlan(input)`
- `applyPlan(plan, target?)`
- `updateExplicitPreference(key, value)`
- `trackBehavior(event)`
- `explainPlan(plan)`
- `serializeProfile(profile)`
- `hydrateProfile(data)`
- `createBootstrapContext(partial)`

### React

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`
- `useAdaptivePlan(surfaceId)`
- `useAdaptivePreference(key)`
- `useAdaptiveActions()`
- `useAdaptiveWhy(surfaceId)`
- `useAdaptiveDevtools()`

### Devtools

- `AdaptiveDevtoolsPanel`
- `AdaptiveDevtoolsOverlay`

### OpenTelemetry

- `createOpenTelemetryAdapter(config)`

## Testing And Verification

This repository verifies the runtime at four different levels:

- pure core unit tests for scoring, precedence, persistence, serialization, explanation, and stability
- React integration tests for provider lifecycle, slot rendering, overrides, focus preservation, and hydration safety
- Playwright E2E coverage against the example dashboard
- a consumer-style smoke test in [tests/usage/README.md](./tests/usage/README.md) that imports the built workspace packages like an external app would

The consumer smoke test exists for a specific reason:

- unit and integration tests prove internal correctness
- example app tests prove the demo works
- `tests/usage` proves that a downstream consumer can install the built packages, define a surface, render with React SSR, and observe explicit plus learned adaptation behavior

The usage smoke test intentionally runs after `pnpm build`.
It should validate the published package contract, not internal source-path aliases.

The `tests/usage` workspace currently validates one concrete flow end-to-end:

1. a fresh profile resolves the summary-first variant
2. an explicit `defaultView = chart` override forces the chart variant
3. repeated chart interaction updates the learned profile enough for the chart variant to win again when `defaultView` is reset to `auto`

That test is intentionally small.
Its role is not to replace unit or E2E coverage, but to catch packaging and consumer-entrypoint regressions that those layers often miss.

## Development Commands

```bash
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm install
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm lint
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm typecheck
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm build
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test:usage
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm --filter ./examples/saas-dashboard test:e2e
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm bench
```

## Documentation Map

- [Specification](./docs/specification.md)
- [Architecture](./docs/architecture.md)
- [Policy Model](./docs/policy-model.md)
- [Accessibility](./docs/accessibility.md)
- [API Reference](./docs/api.md)
- [Recipes](./docs/recipes.md)
- [Testing Guide](./docs/testing.md)
- [Roadmap](./docs/roadmap.md)
