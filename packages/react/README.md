# @adaptive-ui/react

Thin React adapter for plan-driven adaptive surfaces.

> English first, Korean summary below.
> 영어 설명이 먼저 나오고 아래에 한국어 요약이 이어집니다.

## What it provides

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`
- React hooks for plan and preference access

## Typical usage

Install:

```bash
pnpm add @adaptive-ui/core @adaptive-ui/react
```

Main components:

- `AdaptiveProvider`
- `AdaptiveSurface`
- `AdaptiveSlot`

Main hooks:

- `useAdaptivePlan`
- `useAdaptivePreference`
- `useAdaptiveActions`
- `useAdaptiveWhy`
- `useAdaptiveDevtools`

## Package role

`@adaptive-ui/react` should remain a thin adapter over `@adaptive-ui/core`.
It should not own scoring policy or browser collectors.
Its job is to turn a resolved plan into React rendering.

## 한국어 요약

`@adaptive-ui/react`는 core planner 위에 얹는 얇은 React adapter입니다.
Provider, Surface, Slot, 그리고 관련 hook을 제공합니다.
