# Testing Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document explains how the repository verifies the adaptive runtime and why there is a separate `tests/usage` workspace package.

## Why there are multiple test layers

Adaptive UI libraries can fail in different ways:

- the core scoring logic can be wrong
- React wiring can break hydration or focus safety
- the example app can regress in real browser flows
- published package entrypoints can be wrong even if internal tests pass

Because of that, this repository uses layered verification instead of relying on a single test suite.

## Test layers

### 1. Core unit tests

Located under the package test files in `packages/core`.

These tests cover:

- scoring behavior
- precedence ordering
- hysteresis and cooldown
- serialization and hydration
- persistence
- explanation output

Run with:

```bash
./run test
```

## 2. React integration tests

Located under the package test files in `packages/react`.

These tests cover:

- provider bootstrap
- slot rendering
- manual overrides
- hydration safety
- focus preservation

These also run through the main `pnpm test` command.

## 3. Example app E2E tests

Located in `examples/saas-dashboard/e2e`.

These tests cover:

- theme and density persistence
- reduced-motion behavior
- novice and expert simulation
- devtools visibility
- focus safety during adaptation

Run with:

```bash
./run e2e
```

Run that from the repository root.

## 4. Consumer smoke test

Located in `tests/usage`.

This is a separate workspace package that behaves like a downstream application.

It is important because a library can pass all internal tests and still fail for real users if:

- package entrypoints are wrong
- `exports` fields are incomplete
- SSR imports resolve incorrectly
- the built package behaves differently from source-path aliases used inside the monorepo

### What `tests/usage` validates

The smoke test imports the built workspace packages:

- `@adaptive-ui/core`
- `@adaptive-ui/react`

Then it:

- defines its own surface schema
- resolves plans outside the example app
- renders through `react-dom/server`
- verifies explicit preference behavior
- verifies learned behavior promotion after repeated interactions

### Why this package must not alias to `src/*`

If `tests/usage` aliases package names directly to source files, it stops behaving like a real consumer.

That would only prove that local source transpilation works in this monorepo.
It would not prove that the package contract users install from npm is correct.

For that reason, the `tests/usage` workspace is configured to consume the built package entrypoints after `pnpm build`.

### Current smoke flow

The current smoke scenario proves three concrete states:

1. Initial profile renders `summaryCards`.
2. Explicit `defaultView = chart` renders `chartBoard`.
3. Repeated `chart_interaction` events raise the learned chart preference enough for `chartBoard` to win again when the explicit override is removed.

### Run it

```bash
./run usage
```

This command intentionally runs `pnpm build` first.
Run it from the repository root.

## Recommended verification sequence before release

Use this order when validating packaging or release changes:

```bash
./run all
```

If you want the underlying commands instead of the wrapper:

```bash
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm lint
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm typecheck
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm build
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test:usage
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm --filter ./examples/saas-dashboard test:e2e
```

## When to extend `tests/usage`

Add new smoke scenarios when you change:

- package exports or bundling
- SSR behavior
- React public APIs
- serialization or bootstrap semantics
- cross-package type contracts

Do not turn `tests/usage` into a second full integration suite.
Keep it small, consumer-shaped, and focused on package-contract failures.

## 한국어 요약

### 왜 테스트 레이어가 여러 개인가

adaptive UI 런타임은 한 종류의 테스트만으로는 충분하지 않습니다.
core 로직은 맞아도 React wiring이 깨질 수 있고, 예제 앱은 돌아도 실제 패키지 소비자가 import에 실패할 수 있기 때문입니다.

### core unit test

core 테스트는 다음을 검증합니다.

- scoring
- precedence
- hysteresis / cooldown
- serialization / hydration
- persistence
- explanation output

빠르게 돌릴 때는 루트에서 아래처럼 실행합니다.

```bash
./run test
```

### React integration test

React 테스트는 provider bootstrap, slot rendering, manual override, hydration safety, focus preservation을 검증합니다.
즉, adapter가 core planner 위에 얇게 얹히되 안전하게 동작하는지 확인하는 층입니다.

### example app E2E

예제 앱 E2E는 사용자 관점에서 실제 상호작용을 검증합니다.

- theme / density persistence
- reduced motion behavior
- persona simulation
- devtools visibility
- focus safety

실행은 아래처럼 합니다.

```bash
./run e2e
```

### consumer smoke test

`tests/usage`는 실제 다운스트림 앱처럼 built package를 import합니다.
이 레이어가 중요한 이유는 monorepo 내부 alias 경로가 아니라, 실제 배포 계약이 맞는지 확인하기 위해서입니다.

현재 smoke test는 다음 세 상태를 검증합니다.

1. 초기 상태에서 `summaryCards`
2. explicit override 후 `chartBoard`
3. 반복 chart interaction 후 learned preference로 다시 `chartBoard`

실행은 아래처럼 합니다.

```bash
./run usage
```

### 릴리스 전 권장 순서

릴리스 전 전체 검증은 한 번에 아래처럼 실행하면 됩니다.

```bash
./run all
```

개별 명령을 직접 쓰고 싶다면 `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm test:usage`, `pnpm --filter ./examples/saas-dashboard test:e2e`를 순서대로 실행하면 됩니다.

### `tests/usage`를 언제 확장할까

다음이 바뀔 때는 smoke scenario를 추가하는 것이 좋습니다.

- package export / bundling
- SSR behavior
- React public API
- serialization 또는 bootstrap semantics
- cross-package type contract

다만 `tests/usage`는 작은 consumer-contract 테스트로 유지하는 것이 좋고, 두 번째 통합 테스트 모음으로 키우는 것은 피해야 합니다.
