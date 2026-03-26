# Experimentation Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

The runtime is rule-based first, but experimentation can be layered on carefully.

## Safe Experiment Targets

Good experiment targets:

- optional emphasis
- default view preference under `auto`
- non-critical module ordering

Bad experiment targets:

- required legal UI
- focus behavior
- accessibility overrides
- critical task availability

## Adapter Boundary

Use `ExperimentAdapter` to keep experimentation vendor-neutral.

## 한국어 요약

이 런타임은 기본적으로 rule-based 이지만, 실험은 신중하게 추가할 수 있습니다.

실험하기 좋은 대상:

- optional emphasis
- `auto` 상태의 default view
- 비핵심 module ordering

실험하면 안 되는 대상:

- 법적 필수 UI
- focus behavior
- accessibility override
- 핵심 task availability
