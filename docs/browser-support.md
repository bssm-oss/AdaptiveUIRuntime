# Browser Support

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document describes the browser assumptions of the current implementation.

## Required Baseline

The current runtime targets modern evergreen browsers with:

- `matchMedia`
- `ResizeObserver`
- `localStorage`
- modern ES modules

## Optional Features

Optional capabilities include:

- View Transitions API
- higher-resolution performance instrumentation

These should degrade gracefully.

## Runtime Philosophy

If an optional browser capability is missing, the runtime should:

- keep the default plan stable
- skip the enhancement
- avoid breaking the host experience

## 한국어 요약

현재 구현은 현대적인 evergreen browser를 기준으로 합니다.
기본적으로 `matchMedia`, `ResizeObserver`, `localStorage`, ES module 환경을 가정합니다.

View Transitions 같은 기능은 선택적 기능이므로, 없어도 앱이 깨지지 않고 enhancement만 빠지는 방식으로 동작해야 합니다.
