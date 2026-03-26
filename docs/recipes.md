# Recipes

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document shows concrete integration patterns for host applications.

## Add Adaptive UI To An Existing Dashboard

### Step 1: Define the surface

Create a schema that matches the host screen.

```ts
const surface = defineSurface({
  id: 'dashboard.home',
  label: 'Home dashboard',
  zones: {
    mainContent: {
      label: 'Main content',
      kind: 'content',
      defaultVariant: 'table',
      variants: {
        table: {
          component: 'TableView',
          traits: { defaultView: 'table' }
        },
        chart: {
          component: 'ChartView',
          traits: { defaultView: 'chart', chartAffinity: 1 }
        }
      }
    }
  }
});
```

### Step 2: Provide a registry

```tsx
const registry = {
  TableView: DashboardTable,
  ChartView: DashboardChart
};
```

### Step 3: Render with provider, surface, and slot

```tsx
<AdaptiveProvider
  engine={engine}
  initialContext={{ surfaceId: 'dashboard.home' }}
>
  <AdaptiveSurface
    surface="dashboard.home"
    schema={surface}
    components={registry}
  >
    <AdaptiveSlot name="mainContent" />
  </AdaptiveSurface>
</AdaptiveProvider>
```

## Persist Preferences Locally

Use the built-in local storage adapter:

```ts
import {
  createAdaptiveEngine,
  createLocalStorageAdapter
} from '@adaptive-ui/core';

const engine = createAdaptiveEngine({
  storage: createLocalStorageAdapter('my-product.adaptive-ui')
});
```

## Provide Custom Storage

Implement `StorageAdapter` if you need encrypted, cookie-based, or hybrid persistence:

```ts
const storage: StorageAdapter = {
  load() {
    return null;
  },
  save(state) {
    console.log('persisted', state);
  },
  clear() {}
};
```

## Track Behavior Without Spamming Raw Events

Prefer meaningful aggregated events:

```ts
actions.trackBehavior({
  type: 'chart_interaction',
  surfaceId: 'dashboard.home',
  zoneName: 'mainContent'
});
```

Good behavior events represent stable intent.
They should not mirror every DOM event.

## Render Why Trace In Product UI

```tsx
const why = useAdaptiveWhy('dashboard.home');

return (
  <aside>
    {why?.summary.map((line) => (
      <div key={line}>{line}</div>
    ))}
  </aside>
);
```

## Integrate Devtools

```tsx
import { AdaptiveDevtoolsOverlay } from '@adaptive-ui/devtools';

<AdaptiveDevtoolsOverlay surfaceId="dashboard.home" />;
```

This is useful in:

- development
- QA
- design reviews
- experimentation analysis

## Accept Natural-Language Screen Requests Safely

Use `@adaptive-ui/llm` when users or operators should be able to ask for the screen they want in plain language.

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

Important rules:

- compile intent into recommendations, not DOM
- keep the runtime as the final enforcement layer
- stay inside declared zones and variants
- keep explicit user settings higher priority than model suggestions

## Add A Server-Side OpenAI Intent Layer

Use the OpenAI transport on the server:

```ts
import { createOpenAIAdaptiveIntentCompiler } from '@adaptive-ui/llm/openai';

const compiler = createOpenAIAdaptiveIntentCompiler({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-5.4',
  reasoningEffort: 'medium'
});
```

Recommended placement:

- route handler
- server action
- edge function

Avoid using this in:

- first paint
- hydration-critical logic
- browser-side secret-bearing code

## Validate As A Real Consumer

This repository includes a consumer-style smoke package in `tests/usage`.

Use it when you want to verify that:

- the built workspace packages can be imported by a downstream app
- server-side rendering works with `@adaptive-ui/react`
- explicit preferences still win over learned behavior
- learned behavior still changes the selected variant when the relevant preference is `auto`

Run it with:

```bash
./run usage
```

Important detail:

- this test should consume the built package entrypoints
- it should not alias `@adaptive-ui/core` or `@adaptive-ui/react` directly to `src/*`
- if you alias to source files, you are testing local source transpilation semantics instead of the package contract that users actually install

The current smoke scenario covers:

1. summary-first rendering from an explicit profile
2. chart-first rendering after an explicit override
3. chart-first rendering after repeated chart interaction updates the learned profile
4. natural-language intent compilation and safe recommendation application through `@adaptive-ui/llm`

## Use The Runtime On The Server

Use the pure resolver directly:

```ts
const plan = resolvePlan({
  surface,
  userProfile,
  context: createBootstrapContext({
    surfaceId: 'dashboard.home',
    route: '/dashboard',
    viewport: { width: 1280, height: 800 }
  })
});
```

Then pass the same profile and context into the client provider.

## Use OpenTelemetry Export

```ts
import { createAdaptiveEngine } from '@adaptive-ui/core';
import { createOpenTelemetryAdapter } from '@adaptive-ui/otel';

const telemetry = createOpenTelemetryAdapter({
  serviceName: 'dashboard-web',
  traceUrl: 'https://collector.example.com/v1/traces',
  metricsUrl: 'https://collector.example.com/v1/metrics'
});

const engine = createAdaptiveEngine({
  telemetry
});
```

## Simulate Personas In Development

The React adapter exposes simulation helpers through provider actions.

Useful presets in the current implementation:

- novice
- expert
- mobile
- high-contrast
- reduced-motion

These presets are intended for:

- manual QA
- design review
- demos

## Demo The Product To Stakeholders

Recommended short sequence:

1. show novice, expert, and mobile simulation on the same dashboard
2. change explicit theme or density settings
3. use the natural-language intent input
4. open devtools and show the why trace

The key sentence to repeat is:

- the screen can change immediately
- but the system still stays inside approved variants and explainable rules

## Migrate From One Static Surface To Adaptive Surface

Recommended sequence:

1. start with one surface only
2. define one or two adaptive zones, not every region
3. keep the default variant equal to the current production UI
4. add one learned dimension at a time
5. validate with devtools and E2E before widening the scope

## 한국어 요약

### 기존 대시보드에 붙이는 방법

가장 먼저 해야 할 일은 현재 화면을 `surface schema`로 선언하는 것입니다.
화면 전체를 한 번에 적응시키려고 하지 말고, `mainContent`, `quickActions`, `sidePanel`처럼 명확한 zone부터 나누는 것이 좋습니다.

그다음 schema 안에서 쓰는 component key를 실제 React component에 연결하는 registry를 만듭니다.
이후 `AdaptiveProvider`, `AdaptiveSurface`, `AdaptiveSlot`으로 렌더 트리를 감싸면 됩니다.

### preference 로컬 저장

기본 local storage adapter를 쓰면 explicit preference를 즉시 저장하고 복원할 수 있습니다.
로컬 우선 전략을 쓰면 첫 렌더 personalization이 네트워크에 묶이지 않습니다.

### custom storage 제공

보안 요구사항이나 서버 동기화 요구사항이 있으면 `StorageAdapter`를 직접 구현하면 됩니다.
핵심은 planner 자체를 바꾸는 것이 아니라 persistence boundary만 교체하는 것입니다.

### raw event 남발하지 않기

behavior는 DOM 이벤트를 그대로 저장하는 대신, 의미 있는 aggregation 이벤트로 변환해야 합니다.
예를 들어 `chart_interaction`, `detail_expansion`, `keyboard_navigation` 같은 단위가 적합합니다.

### why trace를 제품 UI에 보여주기

운영이나 QA 단계에서는 why trace를 제품 화면 옆에 노출하는 것이 유용합니다.
왜 특정 variant가 선택되었는지, 어떤 rule이 적용되었는지 바로 확인할 수 있기 때문입니다.

### devtools 통합

devtools overlay는 개발, QA, 디자인 리뷰, 실험 분석에 특히 유용합니다.
현재 plan, selected variant, frozen state, score breakdown, simulation preset을 빠르게 확인할 수 있습니다.

### 자연어 화면 요청을 안전하게 받기

`@adaptive-ui/llm`을 쓰면 사용자가 원하는 화면을 자연어로 요청하고, 그 요청을 safe recommendation으로 바꿔 runtime에 즉시 적용할 수 있습니다.

핵심 원칙은 아래와 같습니다.

- 자연어를 DOM이 아니라 recommendation으로 변환
- runtime이 마지막 enforcement layer 역할 유지
- declared zone과 variant 밖으로 나가지 않기
- explicit user setting이 모델 추천보다 우선

### 서버에서 OpenAI intent layer 붙이기

실제 모델 해석이 필요하면 `@adaptive-ui/llm/openai`를 route handler, server action, edge function 같은 서버 위치에 두는 것이 좋습니다.
첫 렌더나 hydration 핵심 경로에 두는 것은 피해야 합니다.

### 실제 소비자처럼 검증하기

`tests/usage`는 monorepo 내부 테스트와 다르게 built package entrypoint를 실제 소비자처럼 불러옵니다.
그래서 package export, SSR import, downstream usage contract를 확인하는 데 적합합니다.

실행은 루트에서 아래처럼 합니다.

```bash
./run usage
```

현재 smoke 시나리오는 아래를 확인합니다.

1. explicit profile 기반 summary-first 렌더
2. explicit override 이후 chart-first 렌더
3. learned preference 누적으로 chart-first 재선택
4. `@adaptive-ui/llm`을 통한 자연어 recommendation 생성과 적용

### 서버에서 사용하기

server-side에서도 `resolvePlan()`을 직접 호출할 수 있습니다.
서버가 계산한 초기 plan과 클라이언트 provider가 같은 bootstrap input을 쓰면 hydration mismatch를 줄일 수 있습니다.

### OpenTelemetry 연동

OTel 브리지를 붙이면 adaptive runtime event를 기존 telemetry 파이프라인으로 넘길 수 있습니다.
서비스 이름, trace endpoint, metrics endpoint만 연결하면 기본 통합이 가능합니다.

### 개발 중 persona simulation

novice, expert, mobile, high-contrast, reduced-motion 같은 preset을 개발 중 바로 시뮬레이션하면 QA가 빨라집니다.
이 기능은 “같은 앱이 사용자별로 어떻게 달라지는지”를 설명하는 데도 유용합니다.

### 제품 시연 순서

짧은 시연에서는 아래 순서가 가장 전달력이 좋습니다.

1. novice, expert, mobile simulation
2. theme와 density explicit override
3. 자연어 화면 요청 입력
4. devtools에서 why trace 확인

핵심 메시지는 “즉시 바뀌지만 자유 생성은 아니고, 승인된 variant 안에서만 재계획한다”입니다.

### 정적 화면에서 adaptive surface로 옮기는 순서

추천 순서는 다음과 같습니다.

1. surface 하나만 시작
2. zone 하나 또는 둘만 적응 대상으로 선택
3. 현재 프로덕션 UI를 default variant로 유지
4. learned dimension을 하나씩 추가
5. devtools와 E2E로 검증하며 점진적으로 확대
