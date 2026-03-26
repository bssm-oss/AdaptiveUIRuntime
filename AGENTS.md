# AGENTS.md

> This document is the primary instruction file for coding agents, automation assistants, and repository-maintenance tooling working in this repository.
> 이 문서는 이 저장소에서 작업하는 코딩 에이전트, 자동화 도구, 유지보수 보조 도구가 가장 먼저 따라야 하는 기본 지침 문서입니다.

Adaptive UI Runtime is not a generative UI project.
It is a constrained personalization runtime layered on top of existing product surfaces and existing design systems.

Any agent working in this repository must preserve that distinction in code, docs, tests, examples, and release behavior.

## 1. Repository Identity

Adaptive UI Runtime exists to help application teams:

- personalize approved surfaces safely per user
- preserve explicit user intent
- keep accessibility and focus stability above optimization
- remain deterministic and testable
- integrate with an existing design system instead of replacing it
- add explainability to runtime UI adaptation
- support natural-language control only through safe, validated control-plane inputs

Adaptive UI Runtime does not exist to:

- generate arbitrary HTML, JSX, or DOM from prompts
- replace a design system
- use an LLM as the render-time planner
- hide why the UI changed
- ship unstable or opaque adaptive behavior
- optimize engagement through dark patterns

If a proposed change pushes the repository toward free-form generation, black-box adaptation, or render-path model dependence, that change is wrong by default.

## 2. Product Truths And Non-Negotiable Constraints

These rules outrank local convenience:

1. Accessibility wins over personalization.
2. Explicit preferences win over learned preferences.
3. Safety and policy constraints win over optimization.
4. The planning engine outputs an `AdaptationPlan`, not direct DOM mutations.
5. Identical inputs must resolve to identical plans.
6. The initial render path must not depend on runtime network personalization.
7. `@adaptive-ui/core` must remain framework-agnostic.
8. `@adaptive-ui/react` must remain a thin adapter over the core planner.
9. The runtime must preserve SSR safety and hydration stability.
10. Adaptation must never steal user focus.
11. Adaptation must not remove legal, policy-critical, or task-critical UI.
12. The LLM layer, when used, belongs on the control plane and must not bypass validation.

If a change would break one of these rules, stop and redesign it.

## 3. Priority Order For Decision-Making

When multiple concerns conflict, use this order:

1. safety, accessibility, and policy requirements
2. explicit user intent
3. SSR and hydration correctness
4. deterministic planning semantics
5. stability and cooldown behavior
6. consumer package correctness
7. performance
8. developer convenience
9. demo polish

Do not invert this order to make a demo look more magical.

## 4. Repository Map

Important top-level areas:

- `packages/core`
  Deterministic planner, types, scoring, guards, stability rules, preferences, behavior aggregation, collectors, storage interfaces.
- `packages/react`
  Thin React integration layer for provider, surface, slot, and hooks.
- `packages/devtools`
  Explainability, debugging, freeze, simulation, and inspection UI.
- `packages/otel`
  OpenTelemetry bridge package.
- `packages/llm`
  Safe intent compiler layer and OpenAI transport for control-plane usage.
- `examples/saas-dashboard`
  The main product demo showing constrained adaptation, Korean UX copy, and intent-driven screen requests.
- `tests/usage`
  Consumer-style smoke verification using built packages, not source aliases.
- `docs`
  Product, architecture, integration, operational, and maintenance documentation.
- `.github`
  GitHub-specific repository instructions and workflow support files.

Agents must not collapse package boundaries for convenience.
If code seems easier to write by moving logic into the wrong package, that is a design smell.

## 5. First Files To Read By Task Type

Before changing code, read the smallest relevant set of files.

### Planner or scoring work

Read first:

- `docs/specification.md`
- `docs/policy-model.md`
- `docs/stability-model.md`
- `packages/core/src/types.ts`
- `packages/core/src/planner.ts`
- `packages/core/src/scoring.ts`
- `packages/core/src/guards.ts`
- `packages/core/src/stability.ts`

### React integration work

Read first:

- `docs/react-integration.md`
- `docs/ssr-and-hydration.md`
- `packages/react/src/AdaptiveProvider.tsx`
- `packages/react/src/AdaptiveSurface.tsx`
- `packages/react/src/AdaptiveSlot.tsx`
- `packages/react/src/hooks.ts`

### Devtools work

Read first:

- `docs/devtools.md`
- `packages/devtools/src/panel.tsx`
- `packages/devtools/src/overlay.tsx`

### LLM integration work

Read first:

- `docs/llm-integration.md`
- `docs/security-and-trust-boundaries.md`
- `packages/llm/src/types.ts`
- `packages/llm/src/compiler.ts`
- `packages/llm/src/validate.ts`
- `packages/llm/src/openai.ts`

### Example or demo work

Read first:

- `docs/example-walkthrough.md`
- `docs/demo-script.md`
- `docs/product-positioning.md`
- `examples/saas-dashboard/src/App.tsx`
- `examples/saas-dashboard/src/dashboardSchema.ts`
- `examples/saas-dashboard/src/components.tsx`

### Packaging or publish work

Read first:

- `docs/publishing.md`
- `docs/release-process.md`
- `package.json`
- `packages/*/package.json`
- `tests/usage/*`

### Docs-only work

Read first:

- `README.md`
- `docs/README.md`
- `CONTRIBUTING.md`

## 6. Working Defaults

Unless the task is explicitly docs-only, use this working order:

1. inspect the relevant package, tests, and docs
2. confirm existing patterns before introducing a new one
3. make the smallest complete change
4. add or update the smallest useful test layer
5. run focused verification
6. run broader verification if package boundaries or user-visible behavior changed
7. update docs if public behavior, commands, or architecture changed

Default assumptions:

- prefer conservative implementations over clever ones
- prefer explicit data flow over hidden magic
- prefer pure functions in core
- prefer validated input over optimistic assumptions
- prefer consumer-contract verification over monorepo-only convenience

## 7. Package-Level Rules

### `packages/core`

This is the most sensitive package.

You must:

- preserve deterministic plan resolution
- preserve the precedence model
- keep browser APIs out of planner logic
- keep heuristics explainable
- keep constants configurable instead of scattering magic numbers
- update explainability output if reasoning semantics changed
- add or update unit tests when behavior changes

You must not:

- add React assumptions
- add framework-specific types
- depend on runtime network calls during planning
- hide rule effects from explainability
- mutate DOM or use browser globals in planner logic
- “fix” planner behavior by moving hidden compensations into React

### `packages/react`

This package is an adapter, not a second planner.

You must:

- keep it thin
- preserve SSR-safe bootstrap behavior
- render selected variants from a plan
- preserve focus and semantic structure
- keep surface rendering declarative

You must not:

- fork planner semantics in React
- re-score variants in components
- put collectors into render paths
- use imperative DOM hacks as the main solution

### `packages/devtools`

Devtools should improve visibility, not change semantics.

It should help answer:

- what plan is active
- why it was selected
- which rules were blocked
- which score contributions applied
- whether cooldown or freeze prevented a change
- whether the current behavior came from explicit, learned, or simulated inputs

Do not let devtools silently mutate planner behavior beyond explicit user controls like simulation or freeze.

### `packages/otel`

This package can depend on OpenTelemetry libraries.
The rest of the repository should remain vendor-neutral.

When editing it:

- keep the bridge thin
- do not leak OTel-specific assumptions into core types unless necessary
- preserve optional adoption

### `packages/llm`

This package is a control-plane integration layer.

You must:

- compile natural-language intent into safe recommendations
- validate model output before applying it
- stay inside declared surfaces, zones, and variants
- preserve explicit-over-model precedence
- keep server-side model usage separate from render-critical flows

You must not:

- generate arbitrary DOM or JSX
- let model output bypass validation
- treat model output as trusted by default
- use browser-side secrets
- call the model in first paint or hydration-critical logic

### `examples/saas-dashboard`

The example exists to explain the product clearly.

It should show:

- the same app adapting for different users
- explicit override precedence
- learned preference accumulation
- devtools explainability
- Korean product copy for the main demo path
- natural-language screen requests mapped into safe recommendations

Avoid changing the example only for visual novelty if it weakens clarity.

### `tests/usage`

This package is a downstream-consumer contract test.

It must:

- consume built workspace packages
- avoid monorepo `src/*` shortcuts
- validate external installation semantics
- catch `exports`, `types`, SSR import, and packaging regressions

Do not turn it into a second full integration suite.
Keep it small, package-focused, and consumer-realistic.

### `docs`

Public docs are part of the product.

They must:

- remain bilingual
- remain consistent with actual commands and files
- describe constrained adaptation honestly
- avoid overselling free-form generation

## 8. UI, UX, And Demo Guidance

When editing user-facing example UI:

- keep the product message explicit
- do not present the project as “AI draws any screen”
- show that different users get different plans on the same product surface
- show that explicit settings override automatic behavior
- show that why trace explains the result

When demoing natural-language control:

- frame the LLM as a safe recommendation layer
- frame the runtime as the enforcement layer
- emphasize immediate change without unrestricted generation

Preferred demo sequence:

1. switch between novice, expert, and mobile simulations
2. change theme, density, or nav explicitly
3. use the natural-language intent input
4. open devtools and inspect why trace
5. explain the approved-variant boundary

## 9. Testing And Verification Matrix

Use the smallest test layer that can prove the change, but do not skip the layer that catches the actual regression.

### Core logic changes

Run:

- relevant unit tests in `packages/core/src/__tests__`
- broader `pnpm test` if multiple planner modules changed
- the benchmark if performance risk exists

### React behavior changes

Run:

- React integration tests in `packages/react/src/__tests__`
- `./run usage` if the consumer contract changed

### Example app changes

Run:

- Playwright coverage when visible behavior changed
- `./run e2e` or `./run all`

### LLM package changes

Run:

- `packages/llm` unit tests
- `./run usage` because the consumer smoke now includes LLM flow
- docs verification if public guidance changed

### Packaging or metadata changes

Run:

- `./run build`
- `./run usage`
- `pnpm publish --dry-run` if publication behavior may have changed

### Docs-only changes

Run at minimum:

- `pnpm lint`

If docs describe consumer setup, commands, or package entrypoints, also run:

- `./run usage`

### Full safety net

Use when multiple layers changed:

```bash
./run all
```

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
pnpm publish --dry-run
```

## 10. Documentation Policy

This repository intentionally keeps user-facing documentation bilingual.

When adding or updating docs:

- keep English content first
- keep Korean guidance or summary in the same file
- preserve links in `README.md` and `docs/README.md`
- keep commands copy-pasteable
- keep file paths accurate
- do not leave new public docs undocumented in the index

When adding a major new public guide, also consider linking it from:

- `README.md`
- `docs/README.md`
- `CONTRIBUTING.md`

When changing product behavior, check whether these need updates:

- `README.md`
- `docs/specification.md`
- `docs/architecture.md`
- `docs/example-walkthrough.md`
- `docs/testing.md`

## 11. Packaging And Release Rules

When editing package manifests or release behavior:

- keep `name`, `exports`, `types`, `files`, and `publishConfig` coherent
- keep repository, homepage, and bugs URLs current
- keep entrypoints aligned with built output
- verify downstream imports through `tests/usage`

Before a real publish:

1. run build
2. run usage smoke
3. run publish dry-run
4. verify package contents
5. only then perform a real publish

Never claim npm publication succeeded unless the actual publish command succeeded against the real registry.

## 12. Branch, Commit, And PR Expectations

Default branch prefix:

- `codex/`

Preferred behavior:

- keep commits small and purpose-specific
- separate docs, tests, runtime logic, and tooling when practical
- keep commit messages concrete
- include verification in the PR body
- merge only after the intended verification passes

Preferred commit prefixes:

- `feat(...)`
- `fix(...)`
- `test(...)`
- `docs(...)`
- `chore(...)`

Good grouping examples:

- planner behavior in one commit
- React adapter wiring in another
- tests in another
- docs in another

Avoid giant mixed commits when the work can be split cleanly.

## 13. Review Standards

When reviewing or editing code, prioritize:

1. correctness regressions
2. accessibility regressions
3. SSR or hydration regressions
4. stability regressions
5. performance regressions
6. packaging and consumer-contract regressions
7. documentation drift
8. demo clarity regressions

If something looks clever but harder to reason about, prefer the more conservative implementation.

## 14. Stability And Safety Rules

The repository favors conservative adaptation.

If a proposed change could:

- cause layout oscillation
- increase surprise within a session
- hide a primary action
- change landmarks or heading structure
- create hydration mismatch
- make reasoning harder to inspect
- reduce user trust in explicit settings

the change should be reconsidered, guarded, or blocked.

## 15. When To Ask Versus When To Decide

Agents should make reasonable assumptions by default.
Do not stop for clarification unless the answer materially changes semantics or safety.

Ask or pause when:

- a change could break a non-negotiable product constraint
- a package boundary is unclear
- a change would overwrite or invalidate user work
- a security-sensitive integration needs a missing secret or credential
- two possible implementations would create materially different public behavior

Do not ask when:

- the repository already establishes the pattern
- the change is docs-only and the intended structure is obvious
- the answer can be discovered from local code or docs

## 16. Forbidden Shortcuts

Do not:

- introduce runtime LLM calls into render-critical logic
- bypass tests for meaningful behavior changes
- solve core issues with adapter-only hacks
- store raw clickstream history in the user profile
- depend on unstable network timing for first-plan computation
- remove docs links when adding new public guides
- treat local state as an authorization boundary
- let demos imply unrestricted UI generation if the product is constrained

## 17. Definition Of Done By Change Type

### Done for core changes

- planner behavior is deterministic
- unit tests cover the changed semantics
- explainability still reflects the decision path
- docs updated if public semantics changed

### Done for React changes

- provider or adapter behavior remains thin
- hydration assumptions remain safe
- integration tests cover the visible behavior

### Done for example changes

- the demo still explains the product clearly
- Playwright covers visible changes
- walkthrough docs remain accurate

### Done for LLM changes

- recommendation validation is preserved
- model output cannot escape approved contracts
- consumer smoke covers the package boundary if public behavior changed
- docs explain the trust boundary

### Done for docs changes

- bilingual structure preserved
- commands and paths verified
- index links updated

## 18. Good Agent Output In This Repository

A good change in this repository is:

- scoped
- deterministic
- explainable
- tested
- documented
- conservative about user disruption
- honest about trust boundaries

## 19. Korean Summary

이 저장소에서 가장 중요한 규칙은 아래와 같습니다.

1. 이 프로젝트는 생성형 UI 엔진이 아니라 constrained personalization runtime입니다.
2. accessibility가 personalization보다 항상 우선입니다.
3. explicit preference가 learned preference보다 항상 우선입니다.
4. safety, policy, SSR, hydration 안정성이 데모 편의보다 앞섭니다.
5. core는 framework-agnostic하게 유지해야 합니다.
6. React는 thin adapter로 유지해야 합니다.
7. 엔진의 출력은 DOM이 아니라 `AdaptationPlan`이어야 합니다.
8. 초기 렌더 경로에 네트워크 personalization이나 runtime LLM 호출을 넣으면 안 됩니다.
9. `@adaptive-ui/llm`은 control-plane recommendation 계층이지 자유 생성 계층이 아닙니다.
10. model output은 검증 전까지 신뢰하면 안 됩니다.
11. `tests/usage`는 built package 기준 consumer contract를 검증해야 하므로 `src/*` alias로 대체하면 안 됩니다.
12. 문서는 영어 먼저, 한국어 요약 또는 안내를 같은 파일 안에 유지해야 합니다.
13. public behavior가 바뀌면 테스트와 문서가 같이 바뀌어야 합니다.
14. 커밋은 가능하면 작고 목적별로 나누어야 합니다.
15. 예제 앱은 “마법처럼 뭐든 생성하는 데모”가 아니라 “같은 앱이 사용자에 따라 안전하게 달라지는 데모”여야 합니다.

작업 유형별 기본 원칙도 기억해야 합니다.

- core 변경: deterministic, explainable, pure function 중심 유지
- react 변경: planning logic를 다시 만들지 말고 thin adapter 유지
- llm 변경: recommendation 생성과 검증에 집중하고 DOM 생성 금지
- example 변경: 제품 메시지와 시연 흐름을 더 명확하게 만들 것
- docs 변경: README, docs index, 관련 가이드를 같이 갱신할 것
- packaging 변경: `exports`, `types`, `files`, `publishConfig`, usage smoke까지 확인할 것

검증도 작업 유형에 맞게 해야 합니다.

- core semantics: unit test
- react behavior: integration test
- example UX: Playwright
- packaging / entrypoint / publish 영향: `./run usage`
- 여러 층이 동시에 바뀌면 `./run all`
