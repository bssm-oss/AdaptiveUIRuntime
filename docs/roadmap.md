# Roadmap

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This roadmap describes likely evolution areas for the runtime after the current v1 implementation.

## Current V1 Scope

The current repository already includes:

- deterministic core engine
- React adapter
- devtools overlay and panel
- OTLP-capable OTel bridge
- Vite example app
- unit, integration, and E2E coverage

## Next Iteration

Focus areas:

- move Vitest workspace config to the newer root-project configuration
- add visual regression coverage
- add richer token pack authoring patterns
- add import/export UI examples for profiles
- expand docs with more framework-specific guides

## Near-Term Feature Growth

### Better subscriptions in React

Current provider state is intentionally simple.
Future improvements may include:

- more selective subscriptions
- reduced rerender fan-out
- surface-level memoization helpers

### More surface examples

Potential examples:

- admin CRUD workspace
- analytics workstation
- education lesson dashboard
- commerce operations console

### Better experimentation support

The strategy interface already exists.
Next steps could include:

- experiment adapters with assignment metadata
- safer per-zone exploration controls
- audit logging for explored selections

## Medium-Term Direction

### Additional framework adapters

Potential adapters:

- Vue
- Svelte
- Web Components

### Server sync adapters

Possible future adapters:

- cookie-backed profile sync
- organization policy fetchers
- server-merged profile storage

### Richer telemetry and reporting

Potential additions:

- plan-resolution latency histograms
- behavior aggregation summaries
- exposure-to-outcome correlation helpers

## Longer-Term Direction

### Visual policy authoring tools

Potential future tooling:

- schema editors
- policy inspectors
- rule simulators

### More advanced strategies

Only after preserving explainability and safety:

- safer contextual bandits
- offline-learned but runtime-deterministic scorers
- experiment-aware stable ranking

### Accessibility review tooling

Potential additions:

- variant-diff accessibility audits
- semantic structure regression checks
- automated focus-path validation

## What Should Remain Stable

Even as the project grows, the following principles should remain unchanged:

- constrained adaptation, not free generation
- no runtime LLM calls in the critical path
- explicit preference over inference
- accessibility over optimization
- plan-based rendering over imperative mutation

## 한국어 요약

### 현재 v1 범위

현재 저장소는 이미 다음을 포함합니다.

- deterministic core engine
- React adapter
- devtools panel / overlay
- OTLP 지원 OTel 브리지
- SaaS dashboard 예제 앱
- unit / integration / E2E / usage smoke 검증

즉, 아이디어 수준이 아니라 실제 vertical slice가 있는 상태입니다.

### 다음 반복에서 다룰 것

다음 단계에서는 experiment adapter, richer telemetry analysis, 더 많은 collector, 시각 회귀 테스트 같은 실용적 확장을 다룰 수 있습니다.

### 단기 확장 방향

가까운 시기에는 아래가 자연스러운 후보입니다.

- 더 다양한 surface recipe
- Next.js 같은 SSR example 추가
- storage adapter 확장
- 실험 플랫폼과 연결되는 vendor-neutral integration
- docs 보강과 release automation 정리

### 중기 방향

중기적으로는 personalization 품질을 높이되 core 철학은 유지해야 합니다.
예를 들어 epsilon-greedy나 bandit 전략은 넣을 수 있지만, deterministic fallback과 explainability를 함께 가져가야 합니다.

### 장기 방향

장기적으로는 다음 같은 확장이 가능합니다.

- React 외 framework adapter
- server-side policy orchestration
- richer design-system bridge
- automated accessibility regression checks
- focus-path validation tooling

### 앞으로도 바뀌지 않아야 할 것

프로젝트가 커져도 아래 원칙은 유지되어야 합니다.

- constrained adaptation이지 free generation이 아님
- critical path에서 runtime LLM 호출 금지
- explicit preference가 inference보다 우선
- accessibility가 optimization보다 우선
- imperative mutation보다 plan-based rendering 우선
