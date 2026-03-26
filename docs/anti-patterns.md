# Anti-Patterns

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document collects patterns that look attractive in demos but are dangerous in production adaptive UI.

## Anti-Pattern: Free Generation In The Render Path

If the UI depends on live model output to determine the initial interface, it is no longer deterministic or testable enough for this library's goals.

## Anti-Pattern: Hidden Personalization

If users cannot understand why the layout changed, trust erodes quickly.

## Anti-Pattern: Overreacting To Weak Signals

A few incidental actions should not make the entire surface reconfigure.

## Anti-Pattern: Breaking Accessibility To Optimize Conversion

Removing structure, hiding controls, or increasing motion for engagement is out of scope.

## Anti-Pattern: Treating The Profile As An Event Dump

Profiles should store stable preferences and summaries, not raw click history.

## Anti-Pattern: Rebuilding Navigation Mid-Task

Navigation changes are some of the most destabilizing changes in a product.
They should be rare and strongly justified.

## 한국어 요약

피해야 할 대표 패턴은 다음과 같습니다.

- 렌더 경로에서 자유 생성형 UI 사용
- 이유를 보여주지 않는 hidden personalization
- 약한 신호에 과민 반응
- 접근성을 희생한 최적화
- profile을 raw event 저장소처럼 쓰기
- 작업 중 navigation 구조를 크게 바꾸기
