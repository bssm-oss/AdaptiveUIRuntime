# Collectors Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Collectors are the browser-facing boundary of the runtime.

## Purpose

Collectors observe low-cost runtime signals and normalize them before they reach the planner.

They exist to keep:

- browser APIs out of planner logic
- signal gathering cheap
- SSR behavior predictable

## Current Collector Types

- media query collector
- resize collector
- visibility collector
- interaction collector
- performance collector
- storage sync collector
- view transition support detection

## Guidance

- batch and normalize rather than forward raw DOM events
- clean up listeners eagerly
- keep per-callback work small
- treat collector output as hints, not truth

## SSR Behavior

Collectors should not be required for initial server planning.
They refine client context after hydration when safe.

## Privacy Boundary

Collectors should describe interaction patterns, not identity.
Avoid capturing content payloads or user-entered text by default.

## 한국어 요약

collector는 브라우저 API와 planner 사이의 경계 계층입니다.

역할은 다음과 같습니다.

- low-cost signal 수집
- raw event를 정규화된 힌트로 변환
- planner를 DOM 세부사항에서 분리

현재 다루는 collector는 media query, resize, visibility, interaction, performance, storage sync, view transition support detection 입니다.
SSR에서는 collector가 초기 계획의 필수 입력이 아니라, hydration 이후 refinement용 힌트로 동작해야 합니다.
