# Surface Authoring

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document explains how to design high-quality `SurfaceSchema` definitions for adaptive products.

## Start With Tasks, Not Layout Toys

A surface should represent a meaningful product screen or sub-surface.
Define it around stable user tasks rather than around arbitrary containers.

Good examples:

- `dashboard.home`
- `analytics.report`
- `orders.detail`
- `lesson.overview`

## Choose Zones Carefully

Zones should map to stable semantic regions.

Common zone types include:

- primary navigation
- summary panel
- main content
- side rail
- quick actions
- onboarding help

Avoid making every visual sub-block its own zone.

## Design Variants As Safe Alternatives

Variants should be pre-approved alternatives for the same task.
They should differ in density, emphasis, disclosure, or default view, not in whether the task is possible at all.

## Traits Should Be Explainable

Each variant trait should correspond to a clear semantic preference or context factor.

Examples:

- `defaultView: chart`
- `contentMode: summary`
- `density: compact`
- `layoutBias: compare`

Avoid hidden magic traits that are not meaningful to product teams.

## Keep Defaults Conservative

Default variants should match the safest broadly useful experience.
Adaptation should be an optimization, not a dependency for usability.

## Guard High-Risk Changes

Use policy and stability rules to make the following changes conservative:

- navigation pattern changes
- large disclosure changes
- landmark or heading structure changes
- optional module removal

## Token Overrides Should Stay Inside The Design System

Prefer token-based variation over ad hoc inline styling.
A surface should connect to an existing token pack or CSS variable strategy.

## Common Authoring Mistakes

Avoid:

- making important actions optional
- hiding critical modules in low-confidence cases
- creating too many nearly identical variants
- letting zone boundaries follow CSS structure instead of task structure

## Review Checklist

Before shipping a new surface, ask:

1. Are the zones semantically stable?
2. Are the variants equivalent in task completion power?
3. Can the chosen variant be explained to a human?
4. Will explicit preference still win?
5. Could any change hurt accessibility or discoverability?

## 한국어 요약

### surface는 task 중심으로 정의해야 한다

surface는 단순한 레이아웃 덩어리가 아니라 의미 있는 제품 화면 단위여야 합니다.
예를 들어 `dashboard.home`, `orders.detail`, `analytics.report`처럼 task와 목적이 드러나는 이름이 좋습니다.

### zone은 안정적인 의미 영역이어야 한다

zone은 CSS 박스 하나하나를 따라가면 안 되고, 사용자 관점에서 의미가 있는 영역이어야 합니다.

대표 예시는 다음과 같습니다.

- primary navigation
- summary panel
- main content
- side rail
- quick actions
- onboarding help

### variant는 안전한 대안이어야 한다

variant는 같은 task를 수행하는 다른 표현 방식이어야 합니다.
density, emphasis, disclosure, default view는 달라질 수 있지만, task completion 자체가 불가능해지면 안 됩니다.

### trait는 설명 가능해야 한다

variant trait는 제품팀이 이해할 수 있는 의미를 가져야 합니다.
예를 들어 `defaultView: chart`, `contentMode: summary`, `density: compact` 같은 값은 설명 가능하지만, 의미 불명확한 내부 magic flag는 피하는 것이 좋습니다.

### 기본값은 보수적으로

default variant는 가장 안전하고 넓게 통하는 UX여야 합니다.
적응은 usability를 위한 최적화여야지, 사용 가능성을 겨우 유지하는 의존성이 되면 안 됩니다.

### 자주 생기는 실수

다음은 피해야 합니다.

- 중요한 액션을 optional zone으로 만드는 것
- low-confidence 상태에서 핵심 모듈을 숨기는 것
- 거의 같은 variant를 너무 많이 만드는 것
- zone 경계를 CSS 구조 위주로 자르는 것
