# LLM Integration

> This document is bilingual. English content comes first, and a Korean guide appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 안내가 이어집니다.

`@adaptive-ui/llm` connects natural-language user intent to the adaptive runtime without turning the runtime into a free-form UI generator.

## What The LLM Layer Is For

The LLM layer belongs on the control plane.

Good uses:

- translating natural-language screen requests into explicit preference updates
- suggesting approved variant hints
- drafting an initial profile from onboarding or support context
- helping operators steer an existing surface safely

Bad uses:

- generating arbitrary DOM or JSX
- bypassing declared zones and variants
- overriding accessibility, policy, or stability constraints
- running on the critical render path

## Architecture

```text
User request
  -> @adaptive-ui/llm compiler
  -> validation and sanitization
  -> safe recommendation
  -> adaptive runtime
  -> approved slot / variant render
```

The runtime still makes the final decision.
The LLM layer can recommend, but it cannot escape the surface contract.

## Package Entry Points

- `@adaptive-ui/llm`
  Generic compiler contracts, heuristic compiler, prompt helpers, validation, and application helpers.
- `@adaptive-ui/llm/openai`
  OpenAI Responses API transport for server-side use.

## Recommendation Shape

The compiler returns a recommendation object with bounded fields:

- `summary`
- `messageToUser`
- `reasoning`
- `confidence`
- `preferenceUpdates`
- `contextPatch`
- `variantHints`
- `unsupportedRequests`
- `suggestedPrompts`

These fields are validated before they reach the runtime.
Unknown zones, unknown variants, and invalid preference values are dropped.

## Heuristic Compiler For Demos And Offline Usage

Use the heuristic compiler when you want:

- zero-network demos
- local-first prototypes
- deterministic behavior in tests

```ts
import {
  applyAdaptiveIntentRecommendation,
  createHeuristicAdaptiveIntentCompiler
} from '@adaptive-ui/llm';

const compiler = createHeuristicAdaptiveIntentCompiler();

const recommendation = await compiler.compile({
  surface,
  userRequest: 'Show charts first and let me move quickly with the keyboard.',
  userProfile,
  context,
  currentPlan,
  language: 'en-US'
});

applyAdaptiveIntentRecommendation(recommendation, {
  currentContext: context,
  updateExplicitPreference,
  patchContext
});
```

## OpenAI Server Integration

Use the OpenAI transport on the server, not in the browser render path.

```ts
import { createOpenAIAdaptiveIntentCompiler } from '@adaptive-ui/llm/openai';

const compiler = createOpenAIAdaptiveIntentCompiler({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-5.4',
  reasoningEffort: 'medium'
});

const recommendation = await compiler.compile({
  surface,
  userRequest,
  userProfile,
  context,
  currentPlan,
  language: 'ko-KR'
});
```

Recommended placement:

- server action
- route handler
- edge function
- operator console backend

Not recommended:

- first paint
- hydration-critical logic
- direct browser-side secret usage

## Trust Boundaries

Treat the LLM output as untrusted until validation completes.

Required safeguards:

- validate every preference update
- validate every zone and variant hint
- keep explicit user settings higher priority than LLM recommendations
- never let recommendations remove required actions or legal UI
- preserve accessibility and stability guards

## Immediate Screen Changes Without Free Generation

If your product promise is “tell us the screen you want and see it immediately,” the right implementation is:

1. let the user describe the screen in natural language
2. compile that request into safe adaptive inputs
3. re-run the deterministic planner immediately
4. render only approved variants

That produces an immediate result, but it is still constrained generation inside your design system and surface contract.

## Example App

The example dashboard demonstrates this directly:

- the UI is Korean
- the user can type a screen request in natural language
- the app applies the recommendation immediately
- the runtime still stays inside approved slots and variants

See:

- `examples/saas-dashboard/src/App.tsx`
- `packages/llm/src/heuristics.ts`
- `tests/usage/llm-smoke.ts`

## 한국어 안내

`@adaptive-ui/llm`은 자연어 요청을 adaptive runtime이 이해할 수 있는 안전한 recommendation으로 바꾸는 control-plane 패키지입니다.

### 이 패키지가 하는 일

- “차트를 먼저 보고 싶다”
- “모바일에서 승인만 빨리 하고 싶다”
- “초보 관리자용으로 더 쉽게 보여 달라”

같은 요청을 받아서 다음처럼 변환합니다.

- explicit preference update
- bounded context patch
- approved variant hint
- 사용자에게 보여줄 설명 문구

### 이 패키지가 하지 않는 일

- DOM 직접 생성
- JSX 직접 생성
- surface에 없는 zone/variant 임의 생성
- 접근성, 정책, 안정성 제약 무시
- 첫 렌더 경로에서 실시간 LLM 호출

### 권장 흐름

```text
자연어 요청
  -> @adaptive-ui/llm
  -> 검증된 recommendation
  -> adaptive runtime
  -> 승인된 화면 조합 렌더
```

즉, 사용자 입장에서는 “원하는 화면을 바로 말하면 바로 바뀌는” 경험을 만들 수 있습니다.
하지만 내부 구현은 자유 생성이 아니라, 기존 디자인 시스템과 surface 계약 안에서 즉시 재계획하는 방식입니다.

### 언제 heuristic compiler를 쓰나

- 네트워크 없이 데모를 만들 때
- 테스트에서 deterministic 동작이 필요할 때
- 로컬 prototype에서 빠르게 흐름을 확인할 때

### 언제 OpenAI transport를 쓰나

- 실제 자연어 해석 품질이 더 필요할 때
- 운영자나 지원 도구에서 더 풍부한 요청을 처리할 때
- 서버에서 의도를 recommendation으로 바꾸고 싶을 때

이 경우에도 브라우저 렌더 경로가 아니라 서버 action, route handler, edge function 같은 위치에 두는 것이 맞습니다.

### 신뢰 경계

LLM 출력은 검증 전까지 신뢰하면 안 됩니다.
반드시 다음을 지켜야 합니다.

- preference update 검증
- zone / variant hint 검증
- explicit user setting 우선
- 접근성 / 정책 / 안정성 guard 유지
- 법적 필수 UI나 핵심 액션 제거 금지

### 예제에서 보는 방법

예제 대시보드 상단의 `원하는 화면 요청` 입력창이 이 흐름을 보여줍니다.
입력한 문장은 `@adaptive-ui/llm` recommendation으로 바뀌고, adaptive runtime이 즉시 다시 plan을 계산해 승인된 variant만 렌더합니다.
