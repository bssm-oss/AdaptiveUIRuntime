# Manual Overrides

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Manual overrides are the clearest form of user intent in the runtime.

## Why They Matter

Adaptive behavior becomes frustrating when it competes with explicit user action.
Overrides exist to establish a durable preference boundary.

## Typical Override Dimensions

- theme
- density
- nav mode
- default view
- motion
- contrast

## Runtime Behavior

When a user sets an override:

- the change should apply immediately
- the value should persist
- learned signals for that dimension should stop competing
- why trace should show the explicit source

## Reset Behavior

Users should be able to return a dimension to `auto` or reset the whole profile to defaults.

## 한국어 요약

manual override는 사용자 의도가 가장 강하게 드러나는 입력입니다.

사용자가 값을 직접 바꾸면:

- 즉시 반영되어야 하고
- 저장되어야 하며
- 같은 차원에서 learned signal이 경쟁하면 안 되고
- why trace에서 explicit source가 보여야 합니다.
