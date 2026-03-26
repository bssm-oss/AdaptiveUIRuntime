# Review Standards

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide defines what maintainers and agents should flag during review.

## Highest Priority Findings

Flag immediately if a change:

- breaks deterministic planning
- changes explicit-preference precedence
- risks accessibility regressions
- creates SSR or hydration mismatch risk
- weakens focus stability
- hides critical actions or policy UI

## Medium Priority Findings

Flag if a change:

- makes reasoning traces less useful
- introduces cross-package coupling
- adds magic numbers without configuration
- weakens package entrypoints or publish metadata
- leaves example behavior inconsistent with docs

## Documentation Findings

Flag if:

- a new public capability has no docs
- a guide is English-only or Korean-only
- README and docs index are missing links
- commands in docs do not match the actual repo scripts

## Review Style

Prefer:

- precise file references
- concrete regression descriptions
- small reproducible examples
- explicit test gaps

## 한국어 요약

리뷰에서 가장 먼저 잡아야 하는 것은 아래입니다.

- deterministic planning 깨짐
- explicit precedence 변경
- accessibility / focus / SSR 위험
- 중요한 액션이나 정책 UI 숨김

그 다음으로는 explainability 저하, 패키지 경계 약화, 문서 누락, 실제 스크립트와 맞지 않는 안내를 봐야 합니다.
