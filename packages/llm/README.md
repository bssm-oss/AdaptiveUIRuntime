# @adaptive-ui/llm

LLM intent compiler for Adaptive UI Runtime.

> English content comes first. A Korean guide appears later in the file.
> 영어 설명이 먼저 나오고 아래에 한국어 안내가 이어집니다.

## What This Package Does

`@adaptive-ui/llm` turns natural-language screen requests into safe adaptive recommendations.

It does not generate raw HTML or JSX.
It produces validated inputs that the deterministic runtime can enforce safely.

## Entry Points

- `@adaptive-ui/llm`
  Compiler contracts, heuristic compiler, validation helpers, and recommendation application helpers.
- `@adaptive-ui/llm/openai`
  OpenAI Responses API transport for server-side use.

## Main APIs

- `createAdaptiveIntentCompiler(options)`
- `createHeuristicAdaptiveIntentCompiler()`
- `applyAdaptiveIntentRecommendation(recommendation, handlers)`
- `createOpenAIAdaptiveIntentCompiler(options)`
- `createOpenAIAdaptiveTransport(options)`

## Typical Flow

```text
Natural-language request
  -> compiler
  -> validated recommendation
  -> adaptive runtime
  -> approved surface update
```

## Recommendation Contents

- `summary`
- `messageToUser`
- `reasoning`
- `confidence`
- `preferenceUpdates`
- `contextPatch`
- `variantHints`
- `unsupportedRequests`
- `suggestedPrompts`

## Heuristic Example

```ts
import {
  applyAdaptiveIntentRecommendation,
  createHeuristicAdaptiveIntentCompiler
} from '@adaptive-ui/llm';

const compiler = createHeuristicAdaptiveIntentCompiler();
const recommendation = await compiler.compile({
  surface,
  userRequest: '차트를 먼저 보고 키보드로 빠르게 이동하고 싶어요.',
  userProfile,
  context,
  currentPlan,
  language: 'ko-KR'
});

applyAdaptiveIntentRecommendation(recommendation, {
  currentContext: context,
  updateExplicitPreference,
  patchContext
});
```

## OpenAI Example

```ts
import { createOpenAIAdaptiveIntentCompiler } from '@adaptive-ui/llm/openai';

const compiler = createOpenAIAdaptiveIntentCompiler({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-5.4',
  reasoningEffort: 'medium'
});
```

## Safety Rules

- never generate arbitrary DOM
- never invent undeclared zones or variants
- never outrank explicit user settings
- never bypass accessibility or policy constraints
- keep the LLM outside the critical render path

## Consumer Verification

This repository includes a consumer-style smoke test for the package:

- `tests/usage/llm-smoke.ts`

Run it from the repo root:

```bash
./run usage
```

## 한국어 안내

`@adaptive-ui/llm`은 자연어 화면 요청을 받아 adaptive runtime이 적용할 수 있는 안전한 recommendation으로 바꾸는 패키지입니다.

핵심 역할:

- 자연어 요청 해석
- explicit preference update 제안
- context patch 제안
- approved variant hint 제안
- 사용자용 설명 문구 생성

하지 않는 일:

- DOM 직접 생성
- surface 계약 밖의 UI 임의 생성
- accessibility / policy guard 무시
- critical render path에서 실시간 LLM 호출

권장 흐름:

```text
자연어 요청
  -> @adaptive-ui/llm
  -> 검증된 recommendation
  -> adaptive runtime
  -> 승인된 화면 갱신
```

즉, 사용자에게는 “원하는 화면을 바로 말하면 즉시 바뀌는” 경험을 줄 수 있지만, 내부 구현은 자유 생성이 아니라 안전한 추천과 재계획입니다.
