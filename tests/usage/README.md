# Usage Smoke Test

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This folder is a consumer-style smoke test for the built packages.

It is not the same as the internal unit tests or the example app.
It must behave like an external app, so it should consume built package entrypoints rather than monorepo source aliases.

Its purpose is to validate that a consumer can:

- import `@adaptive-ui/core`
- import `@adaptive-ui/react`
- define a surface
- resolve plans
- render with React
- observe explicit and learned adaptation changes

Run it with:

```bash
./run usage
```

Run that from the repository root.

Expected validation flow:

1. Initial profile renders the summary-first variant.
2. Explicit `defaultView = chart` renders the chart-first variant.
3. Repeated chart interactions with `defaultView = auto` make the learned profile prefer the chart-first variant.

If this test ever starts importing `packages/*/src/*` directly, it stops being a true consumer-contract test and should be corrected.

## 한국어 요약

이 폴더는 일반 unit test나 example app test와 다른 목적을 가집니다.
핵심은 “실제 소비자처럼 built package를 import했을 때도 라이브러리가 제대로 동작하는가”를 확인하는 것입니다.

이 smoke test가 확인하는 내용은 다음과 같습니다.

- `@adaptive-ui/core` import 가능 여부
- `@adaptive-ui/react` import 가능 여부
- surface 정의와 plan 계산
- React SSR 렌더링 가능 여부
- explicit preference 적용
- learned preference에 따른 variant 변경

실행은 루트에서 아래처럼 합니다.

```bash
./run usage
```

현재 시나리오는 다음 순서로 검증합니다.

1. 초기 상태에서 summary-first variant가 렌더됨
2. explicit `defaultView = chart`를 주면 chart-first variant가 렌더됨
3. explicit override를 제거한 뒤 chart interaction을 반복하면 learned preference가 올라가 chart-first variant가 다시 선택됨

중요한 점은 이 테스트가 monorepo 내부 `src/*`를 직접 import하면 안 된다는 것입니다.
그렇게 되면 실제 패키지 소비자 계약을 검증하는 테스트가 아니라, 내부 개발 환경 테스트로 바뀌기 때문입니다.
