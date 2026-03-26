# Accessibility

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Accessibility is a primary constraint of the runtime, not a follow-up concern after personalization.

## Accessibility Position

The runtime must never improve “personalization” by degrading:

- keyboard access
- focus stability
- semantic structure
- contrast legibility
- motion safety
- task discoverability

Adaptive behavior is only valid when it preserves these fundamentals.

## Non-Negotiable Rules

### Keyboard access

- all interactive controls remain reachable by keyboard
- personalization must not remove the only keyboard-accessible route to a task
- command-first modes must not trap users who do not rely on keyboard shortcuts

### Focus preservation

- plan changes must not steal focus
- plan changes must not unexpectedly relocate the active control
- post-hydration refinement must keep the active element stable

### Structure stability

- landmarks should remain stable across variants
- headings should remain meaningful and ordered
- the same task should not radically change semantic structure per user

### Reduced motion

- system reduced-motion preference takes priority
- transition-heavy variants must fall back safely
- animation is never required to complete a task

### Contrast

- higher contrast preferences must be respected
- token overrides must preserve text/control contrast
- decorative theming must not reduce readability

## Why Personalization Is Risky For Accessibility

Adaptive systems are uniquely risky because they can:

- change layout at runtime
- reorder content
- alter prominence
- hide optional modules
- introduce motion

If not constrained, those behaviors can break accessibility even when each individual component is accessible in isolation.

## Surface Design Guidance

When authoring a surface schema:

- keep primary task controls present across variants
- preserve semantic equivalence between variants
- avoid variants whose only difference is structural chaos
- define eligibility conditions for risky variants

Good adaptation changes emphasis, density, and default state.
Bad adaptation changes whether the task is understandable.

## Slot And Variant Guidance

Each variant should be reviewed for:

- keyboard tab flow
- focus-visible styling
- heading structure
- touch target size
- contrast
- screen-reader labels where necessary

If one variant is materially less accessible than another, it should not be eligible.

## Devtools And Explainability

Explainability improves accessibility operations because it lets a team inspect:

- which variant was chosen
- why it won
- whether motion or contrast preferences changed the output
- whether stability blocked a risky change

This is especially useful when debugging accessibility regressions that appear only for specific user profiles.

## Host App Responsibilities

The library helps, but the host app still owns:

- semantic component implementation
- accessible labels and names
- keyboard bindings
- focus-visible styling
- content clarity
- legal and policy UI presence

The runtime cannot make inaccessible components accessible by itself.

## Testing Strategy

Recommended accessibility validation includes:

- keyboard-only walkthroughs
- focus preservation assertions
- reduced-motion checks
- contrast audits for token packs
- screen-reader landmark sanity checks
- E2E verification of explicit preference persistence

This repository currently includes:

- React focus-preservation tests
- reduced-motion E2E coverage
- devtools exposure of plan and reasons

## Examples Of Safe Adaptation

- novice users see more onboarding hints without losing access to expert workflows
- expert users see denser layout while preserving headings and controls
- mobile users see bottom navigation and collapsed support rails without losing core actions

## Examples Of Unsafe Adaptation

- hiding a destructive or high-priority action because the user rarely used it
- removing a support rail that contains the only explanation for a workflow
- moving focus to a different panel when the plan changes
- replacing clear navigation with command-only behavior for non-keyboard users

## 한국어 요약

### 접근성의 위치

이 런타임에서 접근성은 personalization 이후에 확인하는 체크리스트가 아닙니다.
접근성은 계획 엔진이 결정을 내리기 전에 먼저 적용되는 제약입니다.

### 절대 깨지면 안 되는 것

다음 요소는 personalization보다 항상 우선합니다.

- 키보드 접근
- focus 안정성
- heading과 landmark 같은 의미 구조
- 대비 가독성
- reduced motion 존중

### 왜 adaptive UI가 접근성에 위험할 수 있는가

적응형 UI는 편의를 높일 수 있지만, 잘못 설계하면 다음과 같은 문제가 생깁니다.

- 사용 중 focus가 예기치 않게 이동함
- 의미 구조가 사용자마다 달라져 학습 비용이 커짐
- contrast나 motion preference를 무시함
- novice에게 도움말을 보여주다가 expert 시나리오에서 핵심 경로를 숨김

따라서 “더 개인화된 화면”보다 “안전한 화면”이 우선입니다.

### surface 설계 가이드

surface를 설계할 때는 적응 가능한 범위와 고정해야 하는 범위를 구분해야 합니다.

- landmark 구조는 가급적 고정
- 핵심 task completion 경로는 사용자마다 지나치게 달라지지 않게 유지
- 중요한 버튼과 법적 UI는 optional zone으로 만들지 않음
- density나 disclosure는 바꿔도 의미 구조는 유지

### slot과 variant 설계 가이드

variant를 추가할 때는 다음을 확인해야 합니다.

- 같은 task를 수행할 수 있는가
- heading, label, tab order가 유지되는가
- reduced motion, contrast 환경에서도 안전한가
- hidden state가 discoverability를 과하게 해치지 않는가

### devtools와 explainability

접근성 관점에서도 why trace와 devtools는 중요합니다.
현재 plan이 왜 선택되었고, 어떤 rule이 막혔는지 보여줘야 QA와 리뷰가 가능합니다.

### 호스트 앱 책임

라이브러리가 모든 접근성 문제를 대신 해결해주지는 않습니다.
호스트 앱도 다음을 보장해야 합니다.

- semantic HTML 사용
- 올바른 label과 name 계산
- component variant 간 의미 동등성 유지
- optional panel collapse 시에도 핵심 task 접근성 유지

### 테스트 전략

접근성 검증은 한 종류의 테스트만으로 충분하지 않습니다.

- unit 테스트로 규칙과 guard 검증
- React integration 테스트로 focus preservation 검증
- E2E로 실제 상호작용 경로 검증
- 필요하면 시각 회귀 또는 수동 스크린 리더 점검 추가

### 안전한 적응 예시

- novice에게 onboarding hint를 추가로 보여주되 expert workflow 접근은 그대로 유지
- expert에게 dense layout을 주되 동일한 heading과 control 구조를 유지
- mobile에서 side rail을 접되 핵심 action은 계속 보이게 유지

### 위험한 적응 예시

- 사용 빈도가 낮다고 중요한 destructive action을 감춤
- 설명이 필요한 support rail을 통째로 제거함
- plan 변경 시 focus를 다른 패널로 이동시킴
- 비키보드 사용자에게 command-only navigation을 강제함
