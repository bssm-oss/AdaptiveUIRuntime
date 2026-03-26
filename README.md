# Adaptive UI Runtime

> This document is bilingual. English content comes first, and a Korean guide appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 안내가 이어집니다.

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
- [한국어 안내](#한국어-안내)
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
./run install
```

If you just want the shortest local commands, use the root runner:

```bash
./run dev
./run usage
./run check
```

The same shortcuts are also exposed as pnpm scripts:

```bash
pnpm bootstrap
pnpm dev
pnpm check
pnpm usage
pnpm verify
```

## Quick Start

To run the example app quickly from this repository:

```bash
./run dev
```

Then open [http://localhost:5173](http://localhost:5173).

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

Fast path:

```bash
./run install
./run dev
./run usage
./run e2e
./run check
./run all
```

Same shortcuts through `pnpm`:

```bash
pnpm bootstrap
pnpm dev
pnpm usage
pnpm e2e
pnpm verify
```

Equivalent pnpm commands:

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

- [Documentation Index](./docs/README.md)
- [Getting Started](./docs/getting-started.md)
- [Contributing](./CONTRIBUTING.md)
- [Specification](./docs/specification.md)
- [Architecture](./docs/architecture.md)
- [Policy Model](./docs/policy-model.md)
- [User Profile Model](./docs/user-profile.md)
- [Context Snapshot Model](./docs/context-model.md)
- [Adaptation Plan](./docs/adaptation-plan.md)
- [Stability Model](./docs/stability-model.md)
- [Server Hints](./docs/server-hints.md)
- [Manual Overrides](./docs/manual-overrides.md)
- [Accessibility](./docs/accessibility.md)
- [API Reference](./docs/api.md)
- [React Integration](./docs/react-integration.md)
- [SSR And Hydration](./docs/ssr-and-hydration.md)
- [Surface Schema Guide](./docs/surface-schema.md)
- [Storage And Privacy](./docs/storage-and-privacy.md)
- [Recipes](./docs/recipes.md)
- [Testing Guide](./docs/testing.md)
- [QA Checklist](./docs/qa-checklist.md)
- [Example Walkthrough](./docs/example-walkthrough.md)
- [Surface Authoring](./docs/surface-authoring.md)
- [Rule Authoring](./docs/rule-authoring.md)
- [Anti-Patterns](./docs/anti-patterns.md)
- [Collectors Guide](./docs/collectors.md)
- [Performance Guide](./docs/performance.md)
- [Browser Support](./docs/browser-support.md)
- [Adoption Playbook](./docs/adoption-playbook.md)
- [Security And Trust Boundaries](./docs/security-and-trust-boundaries.md)
- [Devtools Guide](./docs/devtools.md)
- [Telemetry Guide](./docs/telemetry.md)
- [Experimentation Guide](./docs/experimentation.md)
- [Design System Integration](./docs/design-system-integration.md)
- [Publishing Guide](./docs/publishing.md)
- [Release Process](./docs/release-process.md)
- [Versioning And Migrations](./docs/versioning-and-migrations.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Next.js Integration](./docs/frameworks/nextjs.md)
- [Contributing Guide](./docs/contributing.md)
- [FAQ](./docs/faq.md)
- [Glossary](./docs/glossary.md)
- [Roadmap](./docs/roadmap.md)

## 한국어 안내

### 이 프로젝트는 무엇인가

Adaptive UI Runtime은 기존 도메인 앱 위에 붙는 적응형 UI 런타임 라이브러리입니다.
프롬프트로 HTML을 만들어내는 엔진이 아니라, 제품 팀이 미리 선언한 `surface`, `zone`, `variant`, `token` 안에서 사용자별로 가장 적합한 조합을 계산하는 계층입니다.

대상 제품 예시는 다음과 같습니다.

- SaaS 대시보드
- 운영 콘솔
- 내부 업무툴
- 교육용 제품
- 분석 제품
- 커머스 백오피스

### 이 프로젝트가 하지 않는 것

다음 영역은 의도적으로 범위 밖입니다.

- 자유 생성형 UI
- 런타임 prompt-to-DOM 생성
- 첫 렌더 경로의 네트워크 의존 personalization
- explicit preference를 무시하는 자동화
- 접근성, focus, 법적 UI를 깨뜨리는 최적화

즉, 이 라이브러리는 “무엇이든 그리는 엔진”이 아니라 “안전하게 조합하는 엔진”입니다.

### 왜 constrained adaptation인가

실제 제품 환경에서는 예측 가능성과 검증 가능성이 더 중요합니다.
적응형 UI가 매번 흔들리거나 설명이 안 되면, 개인화 자체가 사용자 신뢰를 해칠 수 있습니다.

그래서 이 프로젝트는 다음 원칙을 택합니다.

- 생성보다 선언
- 추정보다 explicit 설정 우선
- 큰 변화보다 안정성 우선
- DOM 조작보다 plan 기반 렌더 우선
- personalization보다 accessibility 우선

### 핵심 원칙

1. 같은 입력이면 같은 계획이 나와야 합니다.
2. 접근성 제약은 personalization보다 우선합니다.
3. 사용자의 명시적 설정은 learned signal보다 우선합니다.
4. 작은 신호 변화로 UI가 세션 중 흔들리면 안 됩니다.
5. 초기 personalization은 local-first로 동작해야 합니다.
6. 엔진의 출력은 DOM이 아니라 `AdaptationPlan`이어야 합니다.

### v1 적응 범위

현재 버전은 다음처럼 “제약된 적응”만 다룹니다.

- density: `compact | comfortable | auto`
- content mode: `summary | detailed | progressive | auto`
- navigation mode: `sidebar | tabs | bottom | command | auto`
- default view: `table | chart | cards | auto`
- layout bias: `focus | overview | compare | auto`
- expertise mode: `novice | regular | expert | auto`
- quick action prominence
- onboarding hint visibility
- optional panel 또는 widget 우선순위
- theme, contrast, motion, spacing과 연계된 token override

### explicit preference와 learned preference

`explicit` preference는 사용자가 직접 고른 값입니다.
예를 들어 density, theme, nav mode, default view 같은 값이 여기에 해당합니다.
이 값은 직접 의도이므로 learned signal보다 항상 강합니다.

`learned` preference는 low-cost behavior aggregation으로 얻는 수치형 신호입니다.
예를 들어 chart affinity, keyboard flow 선호, summary 선호, quick action 선호가 여기에 해당합니다.
다만 이 값은 해당 항목이 `auto`일 때만 영향을 미쳐야 합니다.

이 둘을 같이 두는 이유는 다음과 같습니다.

- explicit만 있으면 단순 설정 패널이 됩니다.
- learned만 있으면 신뢰하기 어려운 자동화가 됩니다.
- 둘을 같이 두면 제어권과 최적화를 같이 가져갈 수 있습니다.

### 아키텍처 개요

런타임의 기본 흐름은 아래와 같습니다.

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

핵심 패키지 역할은 다음과 같습니다.

- `@adaptive-ui/core`: 순수 계획 엔진, 타입, 전략, storage, collector, explainability
- `@adaptive-ui/react`: React용 thin adapter
- `@adaptive-ui/devtools`: 현재 plan과 score breakdown을 보는 개발자 도구
- `@adaptive-ui/otel`: telemetry를 OpenTelemetry로 내보내는 브리지
- `examples/saas-dashboard`: 동작 예시와 E2E 검증용 예제 앱

### 설치와 빠른 실행

리포지토리 내부에서 가장 빠른 실행 경로는 다음입니다.

```bash
./run install
./run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173) 를 열면 예제 앱이 뜹니다.

짧은 검증 명령은 아래처럼 쓸 수 있습니다.

```bash
./run usage
./run e2e
./run check
./run all
```

같은 명령은 `pnpm` 별칭으로도 제공합니다.

```bash
pnpm bootstrap
pnpm dev
pnpm usage
pnpm check
pnpm verify
```

### 핵심 데이터 모델

`UserProfile`은 세 부분으로 나뉩니다.

- `explicit`: 사용자가 직접 선택한 값
- `learned`: 행동 기반 추정값
- `metadata`: 갱신 시간, 버전, source 정보

`ContextSnapshot`은 다음 같은 runtime 조건을 담습니다.

- viewport
- device category
- pointer type
- input modality
- route / surface id
- system color scheme
- contrast / reduced motion
- locale / timezone
- session phase
- feature flag
- server bootstrap hint

`SurfaceSchema`는 한 화면을 설명합니다.
각 surface는 `zones`, `variants`, `policy`, `constraint`, `token override`를 가집니다.

`AdaptationPlan`은 최종 DOM이 아니라 “이번에 어떤 variant를 어떤 이유로 골랐는지”를 담는 결과물입니다.

### plan 기반 렌더링

이 프로젝트의 중요한 철학은 “엔진이 직접 DOM을 만들지 않는다”는 점입니다.
엔진은 `AdaptationPlan`만 반환하고, React adapter나 호스트 앱이 그 plan을 읽어 slot 기반으로 렌더합니다.

이 방식의 장점은 다음과 같습니다.

- SSR이 쉬워집니다.
- hydration mismatch를 줄일 수 있습니다.
- 테스트가 쉬워집니다.
- why trace를 만들기 쉽습니다.
- design system과의 연결점이 명확해집니다.

### why trace

각 plan에는 “왜 이런 선택을 했는지”를 설명하는 trace가 붙습니다.
여기에는 다음 정보가 포함됩니다.

- 어떤 explicit preference가 적용됐는지
- 어떤 rule이 점수에 기여했는지
- 어떤 후보가 guard에 막혔는지
- stability나 cooldown이 어떤 결정을 유지시켰는지

이 정보는 `explainPlan()`과 devtools 패널에서 같이 활용됩니다.

### 런타임 파이프라인

런타임은 대략 다음 단계로 동작합니다.

1. bootstrap
   local storage, system preference, server hint를 읽어 초기 상태를 만듭니다.
2. observe
   interaction, visibility, resize, media query 같은 low-cost signal을 수집합니다.
3. infer
   explicit 설정이 없는 축에 한해 deterministic heuristic으로 learned preference를 갱신합니다.
4. plan
   후보 제거, scoring, tie-break, hysteresis, cooldown을 거쳐 plan을 계산합니다.
5. apply
   adapter가 plan에 맞는 variant와 token override를 렌더합니다.
6. persist
   explicit 설정은 즉시 저장하고 learned profile은 throttled write로 저장합니다.
7. measure
   exposure, override, outcome, latency를 telemetry로 기록합니다.

### 디자인 시스템 통합

이 라이브러리는 기존 디자인 시스템 위에서 동작하도록 설계됐습니다.
핵심 연결 지점은 다음과 같습니다.

- slot-based composition
- variant registry
- token override
- CSS variable 친화 구조
- styling solution 비종속성

즉, Tailwind, vanilla CSS, CSS-in-JS 중 무엇을 쓰더라도 core 철학은 바뀌지 않습니다.

### React 통합

React 쪽 public API는 다음처럼 작게 유지됩니다.

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`
- `useAdaptivePlan`
- `useAdaptivePreference`
- `useAdaptiveActions`
- `useAdaptiveWhy`
- `useAdaptiveDevtools`

React adapter는 가볍게 유지하고, 실제 의사결정은 `@adaptive-ui/core`가 담당합니다.

### SSR과 hydration

SSR 안전성은 이 프로젝트의 핵심 요구사항입니다.
서버와 클라이언트가 같은 `profile + context + surface`를 받으면 같은 plan이 나와야 합니다.

그래서 다음 원칙을 지킵니다.

- 서버에서도 pure `resolvePlan()` 호출 가능
- hydration 전에 네트워크 personalization 금지
- hydration 이후 refinement도 stability guard 아래에서만 허용
- focus와 landmark 구조는 세션 중 함부로 바꾸지 않음

### 브라우저 API 사용

브라우저 전용 API는 core planner에 직접 들어가지 않고 collector 계층에 분리됩니다.
현재 다루는 수집기는 다음과 같습니다.

- media query collector
- resize collector
- visibility collector
- interaction collector
- performance collector
- storage sync
- view transition capability detection

### 개인정보와 저장소 원칙

기본 전략은 privacy-conscious local-first 입니다.

- explicit preference는 localStorage adapter를 기본 제공
- learned preference도 기본은 local-only
- server sync는 adapter로 분리
- user id 없이도 telemetry event가 동작하도록 설계
- reset, export, import 같은 운영 시나리오를 고려

### 접근성과 성능 원칙

접근성 쪽에서는 다음이 비타협 조건입니다.

- keyboard navigation 보장
- focus preservation
- landmark와 heading 안정성 유지
- reduced motion 준수
- contrast preference 준수
- 핵심 액션 은닉 금지

성능 쪽에서는 다음을 목표로 둡니다.

- 첫 렌더 경로에서 네트워크 요청 없이 동작
- runtime LLM 호출 없음
- plan resolution 경량화
- collector callback의 과도한 작업 방지
- layout thrash 방지
- hydration mismatch와 UI jump 최소화

### personalization을 하면 안 되는 경우

다음 경우에는 personalization이 명시적으로 차단되거나 매우 보수적으로 적용돼야 합니다.

- 접근성을 해칠 때
- focus를 움직일 가능성이 있을 때
- 법적 또는 정책상 필수 UI를 건드릴 때
- 핵심 기능을 숨기게 될 때
- 세션 중 navigation 구조를 과도하게 바꾸게 될 때
- 근거를 설명할 수 없는 자동화일 때

### 예제 앱

예제 앱은 세 가지 대표 시나리오를 보여줍니다.

- novice manager
  summary-first, onboarding hint, comfortable density, 명확한 CTA
- expert analyst
  compact density, quick actions, chart/table power view, keyboard bias
- mobile quick-check user
  reduced chrome, touch-friendly spacing, quick stats first

이 예제 앱은 same app, different plan이라는 프로젝트 핵심 메시지를 보여주기 위한 vertical slice입니다.

### API와 검증

Core API 예시는 다음과 같습니다.

- `createAdaptiveEngine(config)`
- `defineSurface(schema)`
- `resolvePlan(input)`
- `applyPlan(plan)`
- `updateExplicitPreference(...)`
- `serializeProfile(profile)`
- `hydrateProfile(data)`

검증은 여러 층으로 구성됩니다.

- core unit test
- React integration test
- Playwright E2E
- consumer smoke test

빠른 전체 검증은 아래처럼 실행하면 됩니다.

```bash
./run all
```

### 문서 안내

문서가 많아졌기 때문에 먼저 [Documentation Index](./docs/README.md) 를 보는 것이 좋습니다.

세부 문서는 아래 파일을 보면 됩니다.

- [Documentation Index](./docs/README.md)
- [Getting Started](./docs/getting-started.md)
- [Contributing](./CONTRIBUTING.md)
- [Specification](./docs/specification.md)
- [Architecture](./docs/architecture.md)
- [Policy Model](./docs/policy-model.md)
- [User Profile Model](./docs/user-profile.md)
- [Context Snapshot Model](./docs/context-model.md)
- [Adaptation Plan](./docs/adaptation-plan.md)
- [Stability Model](./docs/stability-model.md)
- [Server Hints](./docs/server-hints.md)
- [Manual Overrides](./docs/manual-overrides.md)
- [Accessibility](./docs/accessibility.md)
- [API Reference](./docs/api.md)
- [React Integration](./docs/react-integration.md)
- [SSR And Hydration](./docs/ssr-and-hydration.md)
- [Surface Schema Guide](./docs/surface-schema.md)
- [Storage And Privacy](./docs/storage-and-privacy.md)
- [Recipes](./docs/recipes.md)
- [Testing Guide](./docs/testing.md)
- [QA Checklist](./docs/qa-checklist.md)
- [Example Walkthrough](./docs/example-walkthrough.md)
- [Surface Authoring](./docs/surface-authoring.md)
- [Rule Authoring](./docs/rule-authoring.md)
- [Anti-Patterns](./docs/anti-patterns.md)
- [Collectors Guide](./docs/collectors.md)
- [Performance Guide](./docs/performance.md)
- [Browser Support](./docs/browser-support.md)
- [Adoption Playbook](./docs/adoption-playbook.md)
- [Security And Trust Boundaries](./docs/security-and-trust-boundaries.md)
- [Devtools Guide](./docs/devtools.md)
- [Telemetry Guide](./docs/telemetry.md)
- [Experimentation Guide](./docs/experimentation.md)
- [Design System Integration](./docs/design-system-integration.md)
- [Publishing Guide](./docs/publishing.md)
- [Release Process](./docs/release-process.md)
- [Versioning And Migrations](./docs/versioning-and-migrations.md)
- [Troubleshooting](./docs/troubleshooting.md)
- [Next.js Integration](./docs/frameworks/nextjs.md)
- [Contributing Guide](./docs/contributing.md)
- [FAQ](./docs/faq.md)
- [Glossary](./docs/glossary.md)
- [Roadmap](./docs/roadmap.md)
