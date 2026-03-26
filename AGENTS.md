# AGENTS.md

> This document is written primarily for coding agents and automation assistants working in this repository.
> 이 문서는 이 저장소에서 작업하는 코딩 에이전트와 자동화 도구를 위한 지침 문서입니다.

Adaptive UI Runtime is not a generative UI project.
It is a constrained personalization runtime layered on top of existing product surfaces and existing design systems.

Any agent working in this repository must preserve that distinction in code, docs, tests, and examples.

## 1. Repository Mission

The repository exists to help application teams:

- adapt approved surfaces safely per user
- preserve explicit user intent
- stay deterministic and testable
- keep accessibility and stability above optimization
- integrate with existing design systems instead of replacing them

The repository does **not** exist to:

- generate arbitrary HTML from prompts
- call LLMs in the critical render path
- hide or obscure why the UI changed
- ship unstable, surprising, or dark-pattern behavior

## 2. Non-Negotiable Product Constraints

These rules are not optional:

1. Accessibility wins over personalization.
2. Explicit preferences win over learned preferences.
3. The planning engine outputs an `AdaptationPlan`, not DOM mutations.
4. The planning path must stay deterministic for identical inputs.
5. The initial render path must not depend on runtime network personalization.
6. React remains a thin adapter over the core planner.
7. The core package remains framework-agnostic.
8. Do not hide critical actions or legal/policy UI through adaptation.
9. Do not break SSR safety or hydration stability.
10. Do not move user focus automatically as a side effect of adaptation.

## 3. Repository Shape

Important areas:

- `packages/core`
  Pure planning engine, types, strategies, collectors, guards, scoring, persistence interfaces.
- `packages/react`
  Thin React integration layer for providers, surfaces, slots, and hooks.
- `packages/devtools`
  Explainability and debugging surfaces.
- `packages/otel`
  OpenTelemetry bridge package.
- `examples/saas-dashboard`
  Example application showing constrained adaptation.
- `tests/usage`
  Consumer-style smoke verification using built packages.
- `docs`
  Product, architecture, integration, and maintenance documentation.

Agents should not collapse package boundaries for convenience.

## 4. Change Strategy By Area

### If you edit `packages/core`

You are working in the most sensitive layer.

You must:

- preserve deterministic outputs
- keep browser APIs out of planner logic
- keep heuristics explainable
- keep constants configurable instead of scattering magic numbers
- add or update unit tests when behavior changes

You must not:

- add React or framework assumptions
- add network dependencies into plan resolution
- hide rule effects from explainability output

### If you edit `packages/react`

You must:

- keep it thin
- preserve SSR-safe bootstrap behavior
- render selected variants from a plan instead of re-implementing planning logic
- preserve focus and semantic structure

You must not:

- introduce planner forks in React
- embed browser collectors into component render logic
- fix core behavior by silently compensating in the adapter

### If you edit `packages/devtools`

You should improve visibility, not change planner semantics.

Devtools should help users answer:

- what plan is active
- why it was selected
- which rules were blocked
- whether stability guards prevented a change

### If you edit `packages/otel`

Keep the core vendor-neutral.
This package is allowed to depend on OpenTelemetry libraries, but the rest of the repository should not become observability-framework-specific.

### If you edit the example app

Remember that the example exists to demonstrate constrained adaptation, not aesthetic novelty for its own sake.

The example should show:

- persona differences
- explicit override precedence
- learned preference accumulation
- devtools explainability
- accessibility and stability behavior

## 5. Preferred Workflow

Use this order unless the task is clearly documentation-only:

1. Inspect the relevant package, tests, and docs.
2. Confirm existing patterns before introducing new ones.
3. Make the smallest complete change.
4. Add or update tests at the appropriate layer.
5. Run verification commands.
6. Update docs if public behavior changed.

## 6. Verification Matrix

Use the smallest layer that proves the change, but do not skip the layer that catches the real regression.

### For planner logic changes

- unit tests in `packages/core/src/__tests__`
- optionally the benchmark if performance risk exists

### For React behavior changes

- React integration tests in `packages/react/src/__tests__`
- usage smoke if the consumer contract changed

### For example-app changes

- Playwright coverage when user-visible behavior changed

### For docs and packaging changes

- lint and formatting checks at minimum
- `tests/usage` when package entrypoints or consumer-facing docs changed materially

Useful commands:

```bash
./run install
./run lint
./run typecheck
./run test
./run build
./run usage
./run e2e
./run all
```

## 7. Documentation Policy

This repository intentionally keeps user-facing documentation bilingual.

When adding or updating docs:

- keep English content first
- keep Korean guidance or summary in the same file
- preserve links in `README.md` and `docs/README.md`
- do not leave new public docs undocumented in the doc index

If you add a major new maintenance guide, also consider linking it from:

- `README.md`
- `docs/README.md`
- `CONTRIBUTING.md`

## 8. Review Standards

Agents reviewing or editing code should prioritize:

1. correctness regressions
2. accessibility regressions
3. SSR or hydration regressions
4. stability regressions
5. performance regressions
6. packaging and consumer-contract regressions
7. documentation drift

When something looks clever but is harder to reason about, prefer the more conservative implementation.

## 9. Stability And Safety Rules

The repository favors conservative adaptation.

If a proposed change could:

- cause layout oscillation
- increase surprise within a session
- hide a primary action
- change landmarks or heading structure
- create hydration mismatch
- make reasoning harder to inspect

the change should be reconsidered or blocked.

## 10. Commit And PR Expectations

When preparing changes for review:

- split unrelated work into separate commits
- keep commit messages specific
- avoid mixing tooling, runtime logic, and docs in one commit when practical
- include verification results in the PR body

Preferred commit grouping patterns:

- `chore(...)` for tooling or packaging
- `feat(core)` / `fix(core)` for planner behavior
- `feat(react)` / `fix(react)` for adapter changes
- `test(...)` for new coverage
- `docs(...)` for documentation-only changes

## 11. Forbidden Shortcuts

Do not:

- introduce runtime LLM calls into render-critical logic
- bypass tests for behavior changes
- solve core issues with adapter-only hacks
- store raw clickstream history in the user profile
- depend on unstable network timing for first-plan computation
- remove docs links when adding new public guides

## 12. Good Agent Output

A good agent change in this repository is:

- scoped
- deterministic
- explainable
- tested
- documented
- conservative about user disruption

## 13. Korean Summary

이 저장소에서 가장 중요한 규칙은 아래와 같습니다.

1. 이 프로젝트는 생성형 UI 엔진이 아니라 constrained personalization runtime입니다.
2. accessibility가 personalization보다 항상 우선입니다.
3. explicit preference가 learned preference보다 항상 우선입니다.
4. core는 framework-agnostic하게 유지해야 합니다.
5. React는 thin adapter로 유지해야 합니다.
6. 엔진의 출력은 DOM이 아니라 `AdaptationPlan`이어야 합니다.
7. 초기 렌더 경로에 네트워크 personalization이나 runtime LLM 호출을 넣으면 안 됩니다.
8. 문서는 영어/한국어 구조를 유지해야 합니다.
9. public behavior가 바뀌면 테스트와 문서가 같이 바뀌어야 합니다.
10. 커밋은 가능하면 작고 목적별로 나누어야 합니다.
