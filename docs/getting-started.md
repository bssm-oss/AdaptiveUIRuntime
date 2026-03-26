# Getting Started

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide focuses on the fastest path to running and understanding the repository.

## 1. Install

From the repository root:

```bash
./run install
```

## 2. Start the Example App

```bash
./run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## 3. Explore the Demo

The example dashboard demonstrates:

- novice manager mode
- expert analyst mode
- mobile quick-check mode
- explicit overrides for theme, density, and navigation
- Korean intent-driven screen request input
- devtools inspection

Suggested first walkthrough:

1. switch between novice, expert, and mobile personas
2. change density or navigation manually
3. type a Korean screen request into the intent input
4. open devtools and compare the why trace

## 4. Run Validation

Use these commands when you want confidence beyond the interactive demo:

```bash
./run usage
./run e2e
./run check
./run all
```

## 5. Read the Core Concepts

To understand the runtime quickly, read in this order:

1. `README.md`
2. `docs/specification.md`
3. `docs/architecture.md`
4. `docs/policy-model.md`
5. `docs/testing.md`

## 6. Understand the Example Files

The most useful files for first-time readers are:

- `examples/saas-dashboard/src/App.tsx`
- `examples/saas-dashboard/src/dashboardSchema.ts`
- `examples/saas-dashboard/src/components.tsx`
- `packages/llm/src/heuristics.ts`
- `packages/core/src/planner.ts`
- `packages/react/src/AdaptiveSurface.tsx`

## 7. Recommended Next Documents

After the first run, the most useful next documents are:

1. `docs/product-positioning.md`
2. `docs/demo-script.md`
3. `docs/llm-integration.md`
4. `docs/testing.md`

## 한국어 요약

가장 빠른 시작 경로는 아래 두 줄입니다.

```bash
./run install
./run dev
```

그 다음 [http://localhost:5173](http://localhost:5173) 를 열면 예제 앱이 뜹니다.

처음 볼 때는 아래 순서로 눌러보는 것이 좋습니다.

1. `초보 관리자`, `숙련 분석가`, `모바일 빠른 확인`
2. 테마, 밀도, 탐색 직접 변경
3. 한국어 자연어 요청 입력
4. devtools에서 why trace 확인

추가로 확인하고 싶으면:

```bash
./run usage
./run e2e
./run check
./run all
```

처음 읽을 문서 순서는 아래가 좋습니다.

1. `README.md`
2. `docs/specification.md`
3. `docs/architecture.md`
4. `docs/policy-model.md`
5. `docs/testing.md`

그다음에는 아래 문서를 읽으면 전달력이 좋아집니다.

1. `docs/product-positioning.md`
2. `docs/demo-script.md`
3. `docs/llm-integration.md`
