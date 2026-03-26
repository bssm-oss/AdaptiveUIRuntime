# User Profile Model

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

The user profile is the runtime's durable view of user intent and accumulated preference signals.

## Purpose

The profile exists to answer one question safely:

Which parts of the surface can be adapted for this user without violating explicit settings, accessibility, or policy?

## Layers

### Explicit

Explicit fields capture direct user or policy intent.

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

Explicit values always win over learned signals for the same dimension.

### Learned

Learned fields are bounded numeric affinities.

Representative fields:

- `prefersDenseUI`
- `prefersSummary`
- `prefersCharts`
- `prefersKeyboardFlow`
- `prefersQuickActions`
- `prefersCommandPalette`
- `prefersExploration`
- `prefersStableLayout`

These values should only influence dimensions still set to `auto`.

### Metadata

Metadata answers where a profile value came from and how fresh it is.

Representative fields:

- `lastUpdated`
- `version`
- `source`

## Design Rules

1. Keep explicit state small and understandable.
2. Keep learned values normalized and deterministic.
3. Do not store raw event streams in the profile.
4. Do not require user identifiers.
5. Prefer migration-safe serialized data.

## Good Patterns

- Use explicit settings for durable user choices.
- Use learned preferences for soft ranking only.
- Store optional module visibility as stable intent, not as transient UI state.

## Bad Patterns

- writing opaque model outputs directly into the profile
- using learned signals to overwrite locked values
- mixing server-only private data into the default local profile

## 한국어 요약

`UserProfile`은 사용자 intent와 누적된 선호 신호를 담는 런타임 상태입니다.

- `explicit`: 사용자가 직접 고른 값
- `learned`: 행동 집계에서 나온 수치형 선호
- `metadata`: 버전, 갱신 시점, 출처

핵심 규칙은 간단합니다.

- explicit는 learned보다 항상 우선합니다.
- learned는 `auto` 항목에만 영향 줘야 합니다.
- raw event를 프로필에 쌓지 말고, 설명 가능한 집계값만 저장해야 합니다.
