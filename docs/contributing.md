# Contributing

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document explains how to contribute to Adaptive UI Runtime in a way that preserves determinism, accessibility, and publish quality.

## Core Contribution Principles

Contributions should preserve the following priorities:

- deterministic runtime behavior
- accessibility before optimization
- explicit preference before inference
- plan-based rendering instead of imperative mutation
- minimal public API surface
- framework-agnostic core

## Repository Workflow

Typical local workflow:

```bash
./run install
./run dev
./run check
```

Before opening a pull request, contributors should run:

```bash
./run all
```

## Branch And Commit Guidance

Prefer small, reviewable commits grouped by responsibility.

Good commit groupings include:

- repo tooling
- core engine
- react adapter
- devtools
- docs
- tests

Avoid mixing unrelated refactors into feature work.

## Code Quality Expectations

Changes should remain:

- type-safe
- explainable
- SSR-safe
- accessibility-aware
- testable with deterministic inputs

If a change makes plan output harder to explain, it should be reconsidered.

## Documentation Expectations

When changing behavior, update the docs that describe it.
For this repository, that usually means updating at least one of:

- `README.md`
- `docs/specification.md`
- `docs/architecture.md`
- `docs/policy-model.md`
- `docs/testing.md`

New concepts should usually include both English and Korean coverage.

## Testing Expectations

Choose the smallest meaningful verification set for the change, then widen if needed.

Common commands:

```bash
./run test
./run usage
./run e2e
./run all
```

## Packaging Expectations

If you touch package manifests, verify:

- `exports`
- `files`
- `publishConfig`
- internal dependency versions
- pack output size and contents

Use fresh-consumer checks when publish behavior might change.

## Pull Request Expectations

Good pull requests should explain:

- what changed
- why it changed
- how it was verified
- what risks remain

If a change affects scoring or stability semantics, call that out explicitly.

## 한국어 요약

### 기여 원칙

이 저장소에 기여할 때는 다음 우선순위를 유지해야 합니다.

- deterministic runtime
- 접근성 우선
- explicit preference 우선
- plan-based rendering 유지
- public API를 작고 명확하게 유지
- core는 framework-agnostic 유지

### 기본 작업 흐름

로컬에서는 보통 아래 순서로 작업하면 됩니다.

```bash
./run install
./run dev
./run check
```

PR 전 최종 검증은 아래처럼 합니다.

```bash
./run all
```

### 커밋과 PR 가이드

커밋은 가능한 한 작은 단위로 나누는 것이 좋습니다.
예를 들면 repo tooling, core engine, react adapter, docs, tests처럼 책임별로 분리하는 편이 좋습니다.

PR에는 다음이 분명히 들어가야 합니다.

- 무엇을 바꿨는가
- 왜 바꿨는가
- 어떻게 검증했는가
- 어떤 위험이 남았는가

### 문서와 테스트 기대사항

동작을 바꾸면 관련 문서도 같이 갱신해야 합니다.
새 개념은 영어와 한국어를 함께 제공하는 것이 좋습니다.

테스트는 변경 성격에 맞게 선택하되, publish나 consumer contract에 영향을 주는 변화라면 `./run usage` 같은 검증도 꼭 포함하는 것이 좋습니다.
