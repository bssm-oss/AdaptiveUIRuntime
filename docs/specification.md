# Specification

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

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

## 한국어 요약

### 제품 정의

Adaptive UI Runtime은 기존 도메인 앱을 위한 적응형 UI 라이브러리입니다.
이미 존재하는 surface를 사용자별로 다르게 조합하는 것이 목적이며, 임의의 새 인터페이스를 생성하는 도구는 아닙니다.

### 제품 목표

핵심 목표는 다음 다섯 가지입니다.

- personalization
- explainability
- accessibility
- performance
- determinism

즉, “개인화” 하나만 잘하는 라이브러리가 아니라 운영 가능한 제품 계층을 만드는 것이 목표입니다.

### 비목표

다음은 범위에 넣지 않습니다.

- free-form UI generation
- runtime LLM 의존 렌더링
- 핵심 기능 숨기기
- hydration mismatch를 유발하는 랜덤 personalization

### 적응 범위

현재 버전은 density, disclosure, navigation, default view, quick action prominence, onboarding 정도, panel 상태, widget priority, theme/contrast/motion 같은 영역만 다룹니다.
의미 구조 자체를 사용자마다 완전히 뒤집는 것은 허용하지 않습니다.

### User Profile 모델

profile은 `explicit`, `learned`, `metadata` 세 영역으로 구성됩니다.
explicit은 사용자의 직접 선택값, learned는 수치형 행동 추정값, metadata는 버전과 source를 담습니다.

### Context Snapshot 모델

context는 viewport, device, pointer, input modality, system preference, locale, route, session phase, feature flag, server hint를 포함합니다.
이 정보는 네트워크가 없어도 초기 personalization을 가능하게 하는 핵심 입력입니다.

### Surface Schema 모델

각 surface는 zone과 variant 묶음으로 정의됩니다.
variant는 eligibility, trait, token override, component mapping을 갖고, hard constraint와 soft policy는 surface 수준에서 제어됩니다.

### Adaptation Plan 계약

최종 산출물은 DOM이 아니라 plan입니다.
plan은 최소한 다음을 포함해야 합니다.

- zone별 chosen variant
- layout mode
- disclosure level
- token override
- transition mode
- reasoning trace
- confidence
- stability metadata
- exposure id

### resolution 파이프라인

런타임 파이프라인은 bootstrap, observe, infer, plan, apply, persist, measure의 순서로 생각하면 됩니다.
각 단계는 역할이 분리되어 있어야 하며, 특히 planner는 deterministic해야 합니다.

### scoring 요구사항

v1은 rule-based weighted scoring이 기본입니다.
다만 나중에 bandit이나 epsilon-greedy 전략을 꽂을 수 있도록 strategy interface는 열어둡니다.

### stability 요구사항

UI가 세션 중 계속 왔다 갔다 하지 않게 아래 장치가 필요합니다.

- hysteresis
- cooldown
- low-confidence no-op
- manual lock

특히 navigation 변경은 density 변경보다 훨씬 더 보수적으로 다뤄야 합니다.

### storage 요구사항

기본은 local-first 입니다.
explicit preference와 learned preference 모두 기본은 local storage 또는 local-only persistence를 사용하고, 서버 동기화는 adapter로 분리해야 합니다.

### telemetry 요구사항

event schema는 user id가 없어도 작동 가능해야 하며, exposure / override / outcome / latency 같은 핵심 이벤트를 담아야 합니다.
vendor lock-in 없이 `TelemetryAdapter`로 분리하는 것이 원칙입니다.

### SSR 요구사항

서버에서도 initial plan 계산이 가능해야 하고, 클라이언트 hydration 시 같은 입력이면 같은 결과가 나와야 합니다.
hydration 이후 refinement는 있더라도 안정성 제약 아래에서만 허용됩니다.

### devtools 요구사항

devtools는 현재 surface, plan, explicit vs learned vs system 구분, selected variant, score breakdown, blocked rule, stability state, freeze, simulation을 보여줘야 합니다.

### 테스트 요구사항

요구되는 테스트 층은 다음과 같습니다.

- core unit test
- React integration test
- Playwright E2E
- built package consumer smoke test

### 완료 조건

v1 완료 조건은 다음과 같습니다.

- install 성공
- lint / typecheck / test / build 통과
- consumer smoke 통과
- example app 동작
- devtools usable
- explicit preference persistence 동작
- learned preference 영향 확인 가능
- why trace 확인 가능
