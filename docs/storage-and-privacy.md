# Storage And Privacy

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide explains how the runtime stores preferences and how privacy boundaries should be handled.

## Default Model

The default model is local-first.

- explicit preferences are stored locally
- learned preferences are stored locally
- server sync is optional and adapter-based

## Why Local-First

Local-first supports:

- fast startup
- no network dependency on first render
- lower privacy risk
- easier SSR parity

## Data Minimization

The runtime should not require PII to function.

Good event payloads describe behavior and context, not identity.

## Reset / Export / Import

Operationally useful capabilities include:

- reset to defaults
- export preferences
- import preferences

These features are especially important in accessibility and enterprise settings.

## 한국어 요약

기본 저장 전략은 local-first 입니다.

- explicit preference는 로컬 저장
- learned preference도 로컬 저장
- 서버 동기화는 선택 사항이며 adapter로 분리

이 전략의 장점은 다음과 같습니다.

- 첫 렌더가 빠름
- 네트워크 의존성이 줄어듦
- 개인정보 위험이 낮아짐
- SSR과 클라이언트 초기 상태를 맞추기 쉬움

이 런타임은 PII 없이도 동작하는 것을 기본으로 해야 합니다.
또한 reset, export, import 같은 운영 기능을 고려하는 것이 좋습니다.
