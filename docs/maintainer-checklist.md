# Maintainer Checklist

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Use this checklist before merging meaningful changes into `main`.

## Product Safety

- personalization did not override explicit user intent
- accessibility constraints still win
- no critical task flow was hidden or destabilized

## Technical Safety

- core remains deterministic
- React remains a thin adapter
- no critical-path network dependence was introduced
- no runtime LLM call was introduced into render-critical logic

## Verification

- the relevant unit or integration tests were updated
- `./run all` or the equivalent focused verification was run
- docs were updated for public behavior changes

## Packaging And Docs

- package metadata is still coherent
- README and docs index still point to the new guides
- bilingual structure was preserved in user-facing docs

## 한국어 요약

머지 전 체크리스트:

- explicit intent를 personalization이 덮지 않았는가
- accessibility 우선순위가 유지되는가
- core deterministic, React thin adapter 원칙이 유지되는가
- 필요한 테스트를 돌렸는가
- public behavior 변경 시 docs를 갱신했는가
- 문서 bilingual 구조와 문서 맵 링크가 유지되는가
