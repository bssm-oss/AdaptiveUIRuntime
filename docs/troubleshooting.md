# Troubleshooting

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

## Hydration Mismatch

Check that server and client use the same bootstrap profile and context.

## Plan Never Changes

Check:

- the relevant preference may be explicitly locked
- the signal may be too weak
- stability guards may be keeping the current plan

## Plan Changes Too Often

Check:

- cooldown thresholds
- hysteresis settings
- collector noise

## Persistence Does Not Restore

Check:

- storage adapter wiring
- local storage namespace
- reset logic

## Devtools Looks Empty

Check that:

- an `AdaptiveProvider` is mounted
- a surface is active
- the devtools component is rendered inside the provider tree

## 한국어 요약

자주 겪는 문제와 기본 확인 포인트는 다음과 같습니다.

- hydration mismatch: 서버/클라이언트 bootstrap input이 같은지 확인
- plan이 안 바뀜: explicit lock, 약한 신호, stability guard 확인
- plan이 너무 자주 바뀜: cooldown, hysteresis, collector noise 확인
- persistence가 복원 안 됨: storage adapter와 key namespace 확인
- devtools가 비어 보임: Provider, active surface, devtools mount 위치 확인
