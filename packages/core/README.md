# @adaptive-ui/core

Deterministic adaptive UI planning engine for constrained personalization.

> English first, Korean summary below.
> 영어 설명이 먼저 나오고 아래에 한국어 요약이 이어집니다.

## What it provides

- engine creation
- plan resolution
- surface modeling
- preference and behavior logic
- storage and telemetry interfaces

## Typical usage

Install:

```bash
pnpm add @adaptive-ui/core
```

Use it to:

- define surfaces and zones
- resolve plans from profile plus context
- update explicit preferences
- track bounded behavior signals
- explain why a plan was selected

## Main exports

- `createAdaptiveEngine`
- `defineSurface`
- `resolvePlan`
- `applyPlan`
- `serializeProfile`
- `hydrateProfile`

## Package role

`@adaptive-ui/core` should stay framework-agnostic.
It owns deterministic planning logic and contracts.
Browser APIs and rendering details should stay outside the core planner.

## 한국어 요약

`@adaptive-ui/core`는 적응형 UI의 핵심 planning 엔진입니다.
framework-agnostic하게 surface, profile, context를 받아 `AdaptationPlan`을 계산합니다.

주요 역할은 다음과 같습니다.

- surface 정의
- profile/context 기반 plan 계산
- explicit preference 업데이트
- behavior signal 추적
- why trace 제공
