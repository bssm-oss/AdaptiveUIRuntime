# Demo Script

> This document is bilingual. English content comes first, and a Korean guide appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 안내가 이어집니다.

This document gives a short demo script for explaining Adaptive UI Runtime to stakeholders, contributors, or evaluators.

## Core Message

The one-sentence message is:

Adaptive UI Runtime lets users ask for the screen they want right now, while the system still stays inside a safe, deterministic, explainable design-system contract.

## 3-Minute Demo

### 1. Start with the same app

Open the example app and say:

- this is one dashboard, not three separate apps
- the runtime changes how the screen is composed per user
- the app still uses a declared surface schema and approved variants

### 2. Switch personas

Use:

- `초보 관리자`
- `숙련 분석가`
- `모바일 빠른 확인`

Explain:

- the screen changes immediately
- the layout becomes more summary-first, denser, or more mobile-friendly
- this is runtime adaptation, not route switching

### 3. Show explicit overrides

Change:

- theme
- density
- navigation

Explain:

- explicit user settings win over automatic inference
- the system is adaptive, but it is not allowed to fight the user

### 4. Show the intent input

Type a request such as:

- `차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.`

Explain:

- the request is compiled into a safe recommendation
- the screen updates immediately
- the runtime still uses only approved slots and variants

### 5. Open devtools

Show:

- current plan
- why trace
- score breakdown
- simulation state

Explain:

- every change remains explainable
- the system can tell you why a variant was selected

## What To Emphasize

- immediate change does not require free-form DOM generation
- personalization remains bounded by the design system
- explicit preferences outrank heuristics
- accessibility and stability outrank optimization
- LLM use belongs on the control plane, not the critical render path

## Common Questions To Prepare For

### Is this a text-to-UI generator?

No. The runtime does not generate arbitrary DOM from prompts.
It re-plans a known surface using approved variants.

### Why is this better than a static preferences page?

Because it combines:

- explicit user control
- deterministic learned preferences
- runtime context
- explainable planning

### Why not let the LLM generate the whole interface?

Because product teams still need:

- accessibility guarantees
- SSR safety
- predictable semantics
- safe experimentation
- stable tests

## 한국어 안내

이 문서는 Adaptive UI Runtime을 빠르게 시연할 때 쓰는 짧은 데모 스크립트입니다.

## 핵심 한 문장

Adaptive UI Runtime은 사용자가 원하는 화면을 바로 요청하고 즉시 바뀌게 만들 수 있지만, 내부 구조는 계속 안전하고 결정적이며 설명 가능한 design-system 계약 안에 머무는 런타임입니다.

## 3분 시연 순서

### 1. 같은 앱이라는 점부터 보여주기

- 지금 보이는 것은 서로 다른 세 앱이 아니라 하나의 대시보드
- runtime이 사용자별로 다른 조합을 선택
- 그래도 모두 surface schema와 approved variant 안에서만 동작

### 2. persona 전환 보여주기

버튼:

- `초보 관리자`
- `숙련 분석가`
- `모바일 빠른 확인`

설명 포인트:

- 화면이 바로 달라진다
- summary 중심, dense 중심, mobile 친화 형태로 바뀐다
- 하지만 라우트를 갈아타는 것이 아니라 runtime adaptation이다

### 3. explicit override 보여주기

직접 바꿀 것:

- theme
- density
- navigation

설명 포인트:

- 사용자가 직접 고른 값은 자동 추정보다 항상 우선
- adaptive system이지만 사용자를 거스르지 않는다

### 4. 자연어 화면 요청 보여주기

예시 문장:

- `차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.`

설명 포인트:

- 입력 문장은 safe recommendation으로 변환된다
- 화면이 즉시 바뀐다
- 그래도 승인된 slot과 variant만 사용한다

### 5. devtools 열기

보여줄 것:

- current plan
- why trace
- score breakdown
- simulation state

설명 포인트:

- 모든 변화는 설명 가능하다
- 왜 특정 variant가 선택됐는지 추적할 수 있다

## 꼭 강조할 점

- 즉시 바뀌는 경험이 곧 자유 생성은 아니다
- personalization은 design system 경계 안에서만 일어난다
- explicit preference가 heuristic보다 우선한다
- accessibility와 stability가 optimization보다 우선한다
- LLM은 control plane에 두고, critical render path에는 두지 않는다
