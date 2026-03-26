# Context Snapshot Model

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

The context snapshot describes the current runtime environment that is relevant to adaptation.

## Purpose

Context is intentionally separate from the user profile.

- profile answers "what this user tends to prefer"
- context answers "what environment this surface is being rendered in right now"

## Typical Fields

- viewport width and height
- container dimensions
- device category
- pointer type
- input modality
- locale and timezone
- route and surface id
- feature flags
- prefers-color-scheme
- prefers-contrast
- prefers-reduced-motion
- visibility state
- optional server hints

## Constraints

Context should be:

- network-independent on the critical path
- serializable for SSR handoff
- deterministic enough for hydration safety
- cheap to collect

## Server Hints

Server hints are allowed, but they must be bounded.

Good examples:

- viewport class from a cookie
- preferred locale
- coarse device bucket
- org-level policy switches

Bad examples:

- late async personalization fetch in the hydration path
- opaque recommendation payloads with no stable schema

## Collector Relationship

Collectors are responsible for observing browser APIs and converting them into a normalized snapshot.
The planner should consume normalized context, not raw browser APIs.

## 한국어 요약

`ContextSnapshot`은 지금 이 순간의 실행 환경을 설명합니다.

- profile은 "이 사용자가 어떤 성향인가"
- context는 "지금 어떤 환경에서 렌더 중인가"

대표 값은 viewport, container size, pointer, locale, route, surface id, system preference입니다.

중요한 원칙:

- critical path에서 네트워크에 의존하지 말 것
- SSR에서 직렬화 가능할 것
- hydration mismatch를 만들지 않도록 결정적일 것
- planner는 raw browser API가 아니라 normalized context만 소비할 것
