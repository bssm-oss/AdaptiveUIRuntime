# Roadmap

This roadmap describes likely evolution areas for the runtime after the current v1 implementation.

## Current V1 Scope

The current repository already includes:

- deterministic core engine
- React adapter
- devtools overlay and panel
- OTLP-capable OTel bridge
- Vite example app
- unit, integration, and E2E coverage

## Next Iteration

Focus areas:

- move Vitest workspace config to the newer root-project configuration
- add visual regression coverage
- add richer token pack authoring patterns
- add import/export UI examples for profiles
- expand docs with more framework-specific guides

## Near-Term Feature Growth

### Better subscriptions in React

Current provider state is intentionally simple.
Future improvements may include:

- more selective subscriptions
- reduced rerender fan-out
- surface-level memoization helpers

### More surface examples

Potential examples:

- admin CRUD workspace
- analytics workstation
- education lesson dashboard
- commerce operations console

### Better experimentation support

The strategy interface already exists.
Next steps could include:

- experiment adapters with assignment metadata
- safer per-zone exploration controls
- audit logging for explored selections

## Medium-Term Direction

### Additional framework adapters

Potential adapters:

- Vue
- Svelte
- Web Components

### Server sync adapters

Possible future adapters:

- cookie-backed profile sync
- organization policy fetchers
- server-merged profile storage

### Richer telemetry and reporting

Potential additions:

- plan-resolution latency histograms
- behavior aggregation summaries
- exposure-to-outcome correlation helpers

## Longer-Term Direction

### Visual policy authoring tools

Potential future tooling:

- schema editors
- policy inspectors
- rule simulators

### More advanced strategies

Only after preserving explainability and safety:

- safer contextual bandits
- offline-learned but runtime-deterministic scorers
- experiment-aware stable ranking

### Accessibility review tooling

Potential additions:

- variant-diff accessibility audits
- semantic structure regression checks
- automated focus-path validation

## What Should Remain Stable

Even as the project grows, the following principles should remain unchanged:

- constrained adaptation, not free generation
- no runtime LLM calls in the critical path
- explicit preference over inference
- accessibility over optimization
- plan-based rendering over imperative mutation
