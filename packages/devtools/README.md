# @adaptive-ui/devtools

Devtools overlay and panel for inspecting adaptive UI plans.

> English first, Korean summary below.
> 영어 설명이 먼저 나오고 아래에 한국어 요약이 이어집니다.

## What it provides

- panel and overlay components
- why trace visibility
- score breakdown visibility
- current surface and variant inspection

## Typical usage

Install:

```bash
pnpm add @adaptive-ui/devtools
```

Use the package to inspect:

- active surface
- current profile
- selected variants
- score breakdown
- blocked rules
- stability state

`AdaptiveDevtoolsPanel` and `AdaptiveDevtoolsOverlay` also accept an optional
`labels` prop so example apps or host products can localize visible devtools
copy without changing the planner itself.

## Package role

This package is for explainability and debugging.
It should help teams trust adaptive behavior without changing core planning semantics.

## 한국어 요약

`@adaptive-ui/devtools`는 현재 adaptive plan을 시각적으로 확인하는 도구입니다.
why trace, score breakdown, selected variant를 빠르게 볼 수 있습니다.
