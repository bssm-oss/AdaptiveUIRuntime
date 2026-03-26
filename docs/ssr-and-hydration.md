# SSR And Hydration Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Adaptive UI only works in production frameworks when SSR and hydration stay deterministic.

## Goal

The server and client should agree on the initial plan for the first paint.

## Rules

1. Use serializable bootstrap inputs.
2. Keep server hints bounded and versioned.
3. Do not fetch personalization data during hydration.
4. Avoid browser-only branches before hydration finishes.
5. Allow post-hydration refinement only behind stability guards.

## Bootstrap Inputs

Good bootstrap inputs include:

- explicit preferences from a cookie or embedded payload
- a serialized learned profile snapshot
- viewport or device bucket hints
- route and surface id

## After Hydration

Post-hydration collectors may discover richer client state.
That does not mean the UI should immediately jump.

The runtime should first check:

- is the difference material
- is the confidence high enough
- is the user actively interacting
- would the change break focus or structure

## 한국어 요약

SSR 환경에서 adaptive UI의 핵심은 서버와 클라이언트가 첫 plan을 동일하게 계산하는 것입니다.

중요 규칙:

1. bootstrap input은 직렬화 가능해야 함
2. hydration 중 네트워크 personalization 금지
3. 브라우저 전용 분기는 hydration 이후로 미룰 것
4. hydration 후 refinement도 stability guard 아래에서만 허용할 것
