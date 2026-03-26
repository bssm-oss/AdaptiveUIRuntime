# Performance Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Adaptive UI must not become a performance tax on the host application.

## Performance Goals

- no network dependency on first render
- fast plan resolution
- low-cost signal collection
- minimal layout thrash
- limited rerender propagation

## Practical Guidance

- prefer aggregated behavior summaries over raw events
- avoid recomputing plans on every tiny signal change
- keep token application declarative
- scope provider state carefully

## Benchmarks

This repository includes a micro-benchmark for `resolvePlan`.
Use it as a sanity check, not as a replacement for real app profiling.

## 한국어 요약

adaptive UI는 편리함을 주더라도 성능 세금을 크게 만들면 안 됩니다.

성능 목표는 다음과 같습니다.

- 첫 렌더에서 네트워크 의존성 없음
- 빠른 plan resolution
- 저비용 signal collection
- layout thrash 최소화
- rerender 전파 제한

`resolvePlan` 마이크로 벤치마크는 참고용이고, 실제 앱 프로파일링을 대신하지는 않습니다.
