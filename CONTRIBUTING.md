# Contributing

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Thank you for contributing to Adaptive UI Runtime.

## Goals

This repository prioritizes:

- deterministic behavior
- accessibility over personalization
- explicit preference over inference
- plan-based rendering over DOM mutation
- small, reviewable changes

## Development Flow

1. Install dependencies.
2. Run the example app when needed.
3. Add or update tests for any behavior change.
4. Run the validation commands before opening a PR.

## Helpful Commands

```bash
./run install
./run dev
./run test
./run usage
./run e2e
./run all
```

## Change Design Guidelines

- Keep `@adaptive-ui/core` framework-agnostic.
- Keep `@adaptive-ui/react` thin.
- Prefer adding rules and configuration over hidden heuristics.
- Do not introduce runtime LLM calls into the critical path.
- Preserve SSR safety and focus stability.

## Testing Expectations

Choose the smallest test layer that proves the change, but do not skip the layer that can catch the real regression.

- core logic changes should add unit tests
- React behavior changes should add integration tests
- consumer-contract changes should update `tests/usage`
- visible dashboard changes should consider Playwright coverage

## Pull Request Guidance

Good pull requests in this repo are:

- scoped
- explainable
- tested
- stability-aware

When possible, split work into small commits that reflect:

- tooling
- core planner
- adapters
- tests
- docs

## Documentation Expectations

This repository is documented in both English and Korean.
When adding or editing user-facing docs, keep the bilingual structure intact.

For agent or automation-specific guidance, read:

- `AGENTS.md`
- `docs/agent-guide.md`
- `docs/change-playbook.md`
- `docs/review-standards.md`

## 한국어 요약

Adaptive UI Runtime에 기여할 때는 다음 원칙을 우선합니다.

- deterministic behavior
- personalization보다 accessibility 우선
- inference보다 explicit preference 우선
- DOM mutation보다 plan-based rendering 우선
- 작은 단위의 리뷰 가능한 변경

추천 작업 순서는 다음과 같습니다.

1. `./run install`
2. 필요하면 `./run dev`
3. 관련 테스트 추가 또는 수정
4. `./run all` 또는 필요한 검증 실행
5. 작은 커밋 단위로 PR 작성

기여 시 특히 중요한 점은 다음입니다.

- `@adaptive-ui/core`는 framework-agnostic하게 유지
- `@adaptive-ui/react`는 thin adapter로 유지
- runtime critical path에 LLM 호출 금지
- SSR safety와 focus stability 유지
- 문서는 영어/한국어 bilingual 구조 유지
