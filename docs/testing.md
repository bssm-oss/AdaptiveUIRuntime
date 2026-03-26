# Testing Guide

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
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test
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
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm --filter ./examples/saas-dashboard test:e2e
```

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
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test:usage
```

This command intentionally runs `pnpm build` first.

## Recommended verification sequence before release

Use this order when validating packaging or release changes:

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
