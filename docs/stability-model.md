# Stability Model

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Adaptive interfaces fail when they feel unstable.
This document explains how the runtime stays conservative.

## Core Mechanisms

### Hysteresis

The next candidate should beat the current choice by a meaningful margin before a switch is allowed.

### Cooldown

Some categories of change, especially navigation changes, should be rate-limited within a session.

### Low-Confidence No-Op

When the evidence is weak, the correct decision is often to keep the current plan.

### Manual Locks

If a user explicitly selects a value, automatic logic should stop competing on that dimension.

### Focus Preservation

The runtime should avoid changes that interfere with active keyboard or assistive technology flow.

## Examples

- A slight increase in chart usage should not immediately switch the home surface from table-first to chart-first.
- A mobile hint arriving after hydration should not rebuild the landmark structure mid-task.
- A user-selected dense layout should not drift back to comfortable because of one long reading session.

## Practical Rule

Prefer one stable layout that is slightly suboptimal over a layout that changes often and is theoretically more optimal.

## 한국어 요약

적응형 UI는 "잘 맞는 것"보다 먼저 "안 흔들리는 것"이 중요합니다.

이를 위해 런타임은 다음을 사용합니다.

- `hysteresis`: 바꾸려면 현재 선택보다 충분히 좋아야 함
- `cooldown`: 같은 세션에서 큰 변화는 자주 못 일어나게 함
- `low-confidence no-op`: 신호가 약하면 그냥 유지
- `manual lock`: 사용자가 고른 값은 자동 변경 금지
- `focus preservation`: 키보드/보조기술 흐름을 깨는 변화 금지
