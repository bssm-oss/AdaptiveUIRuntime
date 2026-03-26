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
- devtools inspection

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
- `packages/core/src/planner.ts`
- `packages/react/src/AdaptiveSurface.tsx`

## 한국어 요약

가장 빠른 시작 경로는 아래 두 줄입니다.

```bash
./run install
./run dev
```

그 다음 [http://localhost:5173](http://localhost:5173) 를 열면 예제 앱이 뜹니다.

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
