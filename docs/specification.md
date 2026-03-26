# Specification

This document is the detailed v1 product and technical specification for Adaptive UI Runtime.

## Product Definition

Adaptive UI Runtime is an open-source JavaScript/TypeScript library that enables safe, deterministic, per-user UI adaptation for existing domain applications.

The runtime adapts existing surfaces.
It does not generate arbitrary new interfaces.

## Product Goals

- let one product surface adapt to multiple user profiles safely
- combine explicit preference and deterministic learned behavior
- keep host apps inside a known design system boundary
- provide explainability for every selected variant
- preserve accessibility, determinism, and performance
- support SSR-safe initial plans
- support experimentation and telemetry without coupling core to a single vendor

## Non-Goals

- free-form HTML generation
- runtime LLM generation
- network-bound first paint personalization
- black-box model-based adaptation in v1
- removal of required product structure

## Adaptation Scope

The runtime may adapt:

- density
- disclosure level
- navigation mode
- default content view
- layout bias
- CTA prominence
- quick action emphasis
- optional module priority
- onboarding visibility
- contrast and motion-compatible token overrides

The runtime must not adapt:

- legal or policy-critical UI away
- explicit user locks away
- focus position
- stable semantic task structure in a destructive way

## User Profile Model

The runtime profile is composed of:

### Explicit preferences

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

### Learned preferences

- `prefersDenseUI`
- `prefersSummary`
- `prefersCharts`
- `prefersKeyboardFlow`
- `prefersQuickActions`
- `prefersCommandPalette`
- `prefersExploration`
- `prefersStableLayout`

### Metadata

- `lastUpdated`
- `version`
- `source`

## Context Snapshot Model

The runtime context is intentionally network-independent at resolve time.

Fields include:

- viewport dimensions
- container sizes
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

## Surface Schema Model

Each surface declares:

- id
- label
- zones
- defaults
- token packs
- policies
- hard constraints

Each zone declares:

- label
- kind
- defaultVariant
- variants

Each variant declares:

- component
- baseScore
- tokenOverrides
- traits
- eligibility
- rules

## Adaptation Plan Contract

The plan must contain:

- chosen variant per zone
- token overrides
- layout mode
- disclosure level
- transition mode
- confidence
- reasoning trace
- stability metadata
- exposure ids
- resolved preference sources

The plan is the only contract that should be consumed by renderers.

## Resolution Pipeline

### Bootstrap

- load stored profile
- load stored behavior summary
- merge initial context
- compute the first plan

### Observe

- collect system preferences
- collect viewport and interaction modality
- collect performance and storage synchronization state

### Infer

- aggregate raw behavior into stable counters
- update learned scores without overriding explicit settings

### Plan

- resolve effective preferences
- check constraints
- rank variants
- run selection strategy
- apply stability guards
- emit explainability

### Apply

- render selected components
- apply CSS variable overrides
- apply data attributes

### Persist

- save explicit changes immediately
- save learned state on throttle

### Measure

- emit plan and exposure events
- emit preference update events
- emit behavior tracking events

## Scoring Requirements

The scoring system must be:

- deterministic
- explainable
- low cost
- easy to test

The current v1 implementation uses:

- base scores
- preference match/mismatch scoring
- source-strength-aware weighting
- learned affinity adjustments
- explicit rule contributions
- default-variant tie support

## Stability Requirements

The runtime must avoid visual oscillation.

Required controls:

- hysteresis
- cooldown for navigation
- freeze support
- conservative treatment of low-confidence changes

## Storage Requirements

V1 defaults:

- local-first
- no PII requirement
- explicit settings persisted
- learned settings persisted locally
- import/export possible through serialized profile APIs

## Telemetry Requirements

Telemetry must remain vendor-neutral in core.

Core emits:

- `plan_resolved`
- `plan_applied`
- `plan_exposure`
- `preference_updated`
- `behavior_tracked`

Vendor-specific transport belongs outside core.

## SSR Requirements

The server must be able to compute an initial plan from:

- supplied profile
- supplied or request-derived context
- surface schema

The client must be able to hydrate using equivalent inputs.

## Devtools Requirements

Devtools should expose:

- current surface
- current plan
- explicit vs learned vs system preference split
- selected variants
- zone score breakdowns
- blocked rules
- stability state
- exposure log preview
- freeze current plan
- simulation presets

## Testing Requirements

V1 requires:

- unit coverage for scoring, precedence, persistence, serialization, explanation, and stability
- React integration coverage for provider, slot rendering, manual override, focus preservation, and hydration
- Playwright E2E coverage for persistence, reduced motion, persona simulation, devtools visibility, and focus safety
- consumer-package smoke coverage that imports the built packages, resolves a plan, renders with React SSR, and verifies both explicit and learned adaptation paths

## Acceptance Criteria

The v1 implementation is complete when:

- workspace install succeeds
- lint passes
- typecheck passes
- tests pass
- build passes
- consumer smoke verification passes
- example app runs
- devtools are usable
- explicit preferences persist
- learned preferences influence at least several scenarios
- why trace is inspectable
