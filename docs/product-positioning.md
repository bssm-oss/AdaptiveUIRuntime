# Product Positioning

> This document is bilingual. English content comes first, and a Korean guide appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 안내가 이어집니다.

This document explains how to position Adaptive UI Runtime in product, engineering, and open-source conversations.

## Short Positioning

Adaptive UI Runtime is a JavaScript and TypeScript runtime for safe, deterministic, explainable personalization on top of an existing design system.

## What It Is

- a personalization runtime
- a surface planner
- a slot-and-variant selector
- a bridge between explicit preferences, learned behavior, and runtime context
- a control-plane-friendly runtime that can accept safe LLM recommendations

## What It Is Not

- a text-to-UI generator
- an arbitrary DOM generator
- a replacement for a design system
- a visual editor
- a black-box personalization engine

## The Key Product Message

Old pattern:

- teams guess what users want
- designers and engineers ship one default screen
- every user gets the same interface

New pattern:

- users can ask for the screen they want
- the system can learn from stable behavior signals
- the runtime re-plans the interface immediately
- the result still stays inside approved slots, variants, policies, and accessibility rules

## Why Teams Would Adopt It

- they want personalization without losing control
- they need explainability for product, design, or compliance reviews
- they need SSR-safe adaptation
- they want to preserve accessibility and focus stability
- they want a path to natural-language control without making the runtime unsafe

## Best Fit Scenarios

- SaaS dashboards
- operations consoles
- admin tools
- internal productivity tools
- education products with novice and expert modes
- analytics surfaces with table, chart, and card variations

## Wrong Fit Scenarios

- marketing landing pages
- experimental free-form UI generation products
- products with no stable component or layout system
- experiences where every request should create an all-new interface from scratch

## One-Line Alternatives

Use these depending on the audience:

- For engineers: `Adaptive UI Runtime is a deterministic planner for adaptive interfaces.`
- For product teams: `Adaptive UI Runtime makes one product surface feel different for different users without turning the UI into chaos.`
- For OSS readers: `Adaptive UI Runtime brings constrained, explainable personalization to existing apps.`

## 한국어 안내

이 문서는 Adaptive UI Runtime을 어떤 식으로 소개하면 좋은지 정리한 포지셔닝 문서입니다.

## 짧은 소개

Adaptive UI Runtime은 기존 design system 위에서 안전하고 결정적이며 설명 가능한 personalization을 제공하는 JavaScript/TypeScript 런타임입니다.

## 이것이 무엇인가

- personalization runtime
- surface planner
- slot과 variant를 고르는 엔진
- explicit preference, learned behavior, runtime context를 연결하는 계층
- safe LLM recommendation을 받을 수 있는 control-plane 친화 runtime

## 이것이 아닌 것

- text-to-UI generator
- arbitrary DOM generator
- design system 자체를 대신하는 도구
- visual editor
- black-box personalization engine

## 핵심 메시지

예전 방식:

- 팀이 사용자가 뭘 원하는지 추측
- 기본 화면 하나를 만들어 모두에게 동일하게 제공

새 방식:

- 사용자가 원하는 화면을 직접 요청할 수 있음
- 시스템이 안정적인 행동 신호를 학습할 수 있음
- runtime이 즉시 다시 계획함
- 그래도 결과는 approved slot, variant, policy, accessibility 경계 안에 머무름

## 잘 맞는 제품

- SaaS dashboard
- 운영 콘솔
- admin tool
- 내부 업무툴
- novice/expert 모드가 필요한 교육 제품
- table/chart/card 변형이 중요한 analytics 화면

## 잘 맞지 않는 제품

- 마케팅 랜딩 페이지
- 자유 생성형 UI 제품
- 안정적인 component/layout 시스템이 없는 경우
- 요청마다 완전히 새로운 인터페이스를 즉석에서 만들어야 하는 경우
