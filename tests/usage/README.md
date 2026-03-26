# Usage Smoke Test

This folder is a consumer-style smoke test for the built packages.

It is not the same as the internal unit tests or the example app.
It must behave like an external app, so it should consume built package entrypoints rather than monorepo source aliases.

Its purpose is to validate that a consumer can:

- import `@adaptive-ui/core`
- import `@adaptive-ui/react`
- define a surface
- resolve plans
- render with React
- observe explicit and learned adaptation changes

Run it with:

```bash
PATH=/opt/homebrew/bin:/usr/bin:/bin:$PATH pnpm test:usage
```

Expected validation flow:

1. Initial profile renders the summary-first variant.
2. Explicit `defaultView = chart` renders the chart-first variant.
3. Repeated chart interactions with `defaultView = auto` make the learned profile prefer the chart-first variant.

If this test ever starts importing `packages/*/src/*` directly, it stops being a true consumer-contract test and should be corrected.
