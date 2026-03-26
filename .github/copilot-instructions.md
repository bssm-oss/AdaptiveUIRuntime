# Copilot Instructions

Use [AGENTS.md](../AGENTS.md) as the primary repository instruction file.

Key rules:

- This repo is a constrained adaptive UI runtime, not a generative UI project.
- Keep `@adaptive-ui/core` framework-agnostic and deterministic.
- Keep `@adaptive-ui/react` as a thin adapter over core.
- Do not add runtime LLM calls to the critical render path.
- Preserve accessibility, focus stability, SSR safety, and explainability.
- Prefer plan-based rendering over imperative DOM mutation.
- Add the smallest relevant tests for behavior changes.
- Keep public docs bilingual and update `README.md` plus `docs/README.md` when adding important guides.

Quick validation commands:

```bash
./run lint
./run test
./run usage
./run e2e
./run all
```
