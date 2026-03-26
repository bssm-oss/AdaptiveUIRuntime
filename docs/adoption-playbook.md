# Adoption Playbook

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide explains how to adopt the runtime incrementally in a real product.

## Recommended Rollout

1. choose one surface only
2. start with one or two adaptive zones
3. keep the current production UI as the default variant
4. run in shadow mode conceptually before enabling visible changes
5. add manual override controls early

## Success Metrics

Track:

- override rate
- task completion stability
- engagement with promoted variants
- support complaints about confusion or drift

## Rollback Triggers

Be ready to freeze or disable adaptation if:

- focus behavior regresses
- task completion drops
- support burden spikes
- users repeatedly override the same dimension

## 한국어 요약

실제 제품 도입은 한 번에 전체 화면에 적용하지 않는 것이 좋습니다.

추천 순서는 다음과 같습니다.

1. surface 하나만 선택
2. adaptive zone은 한두 개만 시작
3. 현재 프로덕션 UI를 default variant로 유지
4. visible rollout 전에 shadow mode처럼 내부 검증
5. manual override를 초기에 제공

성공 지표로는 override rate, task completion 안정성, promoted variant engagement를 보고, focus regression이나 support 증가가 있으면 freeze 또는 rollback해야 합니다.
