# Agent Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide explains how an AI coding agent or automation assistant should approach work in this repository.

## Core Mental Model

The repository is building a safe personalization runtime for existing product surfaces.
That means agents should think in terms of:

- declared surfaces
- approved zones
- approved variants
- explicit policies
- deterministic scoring
- explainable outputs

The wrong mental model is:

- "generate any UI"
- "optimize everything automatically"
- "fix behavior by mutating DOM until it looks right"

## Decision Tree

### If the task changes planner semantics

Read:

- `docs/specification.md`
- `docs/policy-model.md`
- `docs/stability-model.md`
- `packages/core/src/*`

Then:

- update tests in core
- update explainability output if reasoning changed
- update docs if the public model changed

### If the task changes rendering behavior

Read:

- `docs/react-integration.md`
- `docs/ssr-and-hydration.md`
- `packages/react/src/*`

Then:

- preserve plan-driven rendering
- add React tests
- verify hydration safety if initial markup can differ

### If the task changes docs or packaging

Read:

- `README.md`
- `docs/README.md`
- `CONTRIBUTING.md`

Then:

- keep bilingual structure
- keep documentation map links current
- verify consumer commands still match repository scripts

## Change Heuristics

When two solutions are possible, prefer the one that is:

- easier to explain
- easier to test
- less coupled across packages
- less likely to create session instability

## Agent Checklist

Before finishing, ask:

1. Did I preserve accessibility priority?
2. Did I preserve explicit-over-learned precedence?
3. Did I avoid adding hidden magic or black-box behavior?
4. Did I update the right tests?
5. Did I update the relevant docs?

## 한국어 요약

에이전트는 이 저장소를 "생성형 UI 프로젝트"로 보면 안 됩니다.
"기존 surface 안에서 안전하게 personalization하는 런타임"으로 봐야 합니다.

작업 유형별로 접근이 달라집니다.

- planner semantics 변경: specification, policy, stability 문서와 core 코드를 먼저 읽기
- rendering 변경: react integration, SSR 문서와 react 패키지 먼저 보기
- docs/packaging 변경: README, docs index, CONTRIBUTING 먼저 보기

마무리 전에는 accessibility, precedence, explainability, tests, docs를 반드시 확인해야 합니다.
