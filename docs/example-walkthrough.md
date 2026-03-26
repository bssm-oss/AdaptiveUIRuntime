# Example Walkthrough

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This walkthrough explains what the example dashboard is demonstrating and where to look in the code.

## Personas

### Novice manager

Expected qualities:

- summary-first layout
- onboarding hints visible
- comfortable density
- strong CTA emphasis

### Expert analyst

Expected qualities:

- compact density
- quick actions promoted
- chart and table power views
- keyboard-friendly bias

### Mobile quick-check user

Expected qualities:

- reduced chrome
- touch-friendly spacing
- quick stats first
- optional panels collapsed

### Intent-driven screen request

Expected qualities:

- the UI accepts a natural-language screen request
- the request applies immediately
- only approved variants are used
- the result remains explainable in devtools

## Files To Inspect

- `examples/saas-dashboard/src/App.tsx`
- `examples/saas-dashboard/src/dashboardSchema.ts`
- `examples/saas-dashboard/src/components.tsx`
- `packages/llm/src/heuristics.ts`

## What To Try

1. switch personas
2. change density manually
3. change theme manually
4. open devtools
5. freeze the current plan
6. trigger behavior updates and watch optional module priority change
7. type a Korean screen request into the intent input and confirm that the screen changes immediately without leaving the declared variants

## 한국어 요약

예제 앱은 세 가지 persona를 보여줍니다.

- novice manager
- expert analyst
- mobile quick-check user

추가로 자연어 화면 요청도 시연합니다.

- 사용자가 한국어로 원하는 화면을 입력
- recommendation이 즉시 생성
- adaptive runtime이 안전한 variant만 다시 선택
- devtools에서 why trace 확인 가능

코드에서 먼저 볼 파일은 아래입니다.

- `examples/saas-dashboard/src/App.tsx`
- `examples/saas-dashboard/src/dashboardSchema.ts`
- `examples/saas-dashboard/src/components.tsx`

직접 해볼 것은 persona 전환, density/theme 수동 변경, devtools 열기, freeze, behavior 누적 확인입니다.
여기에 더해 자연어 화면 요청 입력창에 문장을 넣고 즉시 반영되는 흐름도 확인하면 좋습니다.
