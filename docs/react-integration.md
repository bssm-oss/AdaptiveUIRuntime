# React Integration

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide explains how `@adaptive-ui/react` should be used in host applications.

## Core Components

### `AdaptiveProvider`

Provides runtime state, actions, and current plans.

Use it near the app shell or near the part of the app that owns adaptive surfaces.

### `AdaptiveSurface`

Computes the active plan for a declared surface and exposes the result to child slots.

### `AdaptiveSlot`

Renders the approved component variant selected by the current plan.

## Recommended Pattern

1. Define a `SurfaceSchema`.
2. Register approved components in a registry.
3. Mount an `AdaptiveSurface`.
4. Render slots with `AdaptiveSlot`.
5. Update explicit settings and behavior through hooks.

## Hooks

Common hooks include:

- `useAdaptivePlan(surfaceId)`
- `useAdaptivePreference(key)`
- `useAdaptiveActions()`
- `useAdaptiveWhy(surfaceId)`
- `useAdaptiveDevtools()`

## SSR Guidance

For SSR:

- create the same bootstrap context on server and client
- avoid non-deterministic initial state
- defer refinement until after hydration and only under stability guards

## Focus Guidance

Do not use adaptation to:

- move focus automatically
- reorder critical controls during active keyboard interaction
- swap landmark structures without strong justification

## 한국어 요약

React 통합의 핵심은 `core`가 결정을 하고 `react`가 그 결정을 렌더하는 구조를 유지하는 것입니다.

주요 컴포넌트는 다음과 같습니다.

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`

추천 순서는 아래와 같습니다.

1. `SurfaceSchema` 정의
2. component registry 준비
3. `AdaptiveSurface` 마운트
4. `AdaptiveSlot`으로 zone 렌더
5. hook으로 explicit preference와 behavior 업데이트

SSR에서는 서버/클라이언트 bootstrap input을 동일하게 유지하는 것이 중요합니다.
또한 adaptation이 focus를 옮기거나 핵심 landmark 구조를 흔들지 않게 해야 합니다.
