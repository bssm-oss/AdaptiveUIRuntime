# Adaptation Plan

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

The `AdaptationPlan` is the only output that the planning engine is allowed to produce.

## Why a Plan Exists

The runtime should not emit DOM mutations or arbitrary render instructions.
It should emit a stable, inspectable object that application adapters can render.

## Expected Contents

An adaptation plan should include:

- chosen variant per zone
- applied token overrides
- layout mode
- disclosure level
- transition mode
- confidence
- reasoning trace
- stability metadata
- exposure ids

## Benefits

- renderers stay thin
- SSR and hydration reuse the same output contract
- tests can assert on behavior without a browser
- telemetry can refer to a stable plan id
- devtools can show exactly what the renderer used

## Confidence

Confidence should be interpreted conservatively.
Low confidence should often produce "stay with the current layout" rather than "try a bigger change."

## Exposure IDs

Exposure identifiers should be stable enough to support:

- analytics
- experimentation
- plan change tracking
- debugging

They do not need to contain user identity.

## 한국어 요약

엔진의 출력은 DOM이 아니라 `AdaptationPlan`이어야 합니다.

이 plan 안에는 zone별 선택 variant, token override, layout/disclosure mode, confidence, why trace, stability metadata, exposure id가 들어가야 합니다.

이 구조의 장점은 다음과 같습니다.

- 렌더러가 얇아집니다.
- SSR과 hydration이 같은 계약을 공유합니다.
- 테스트가 쉬워집니다.
- devtools가 렌더에 실제 사용된 값을 그대로 보여줄 수 있습니다.
