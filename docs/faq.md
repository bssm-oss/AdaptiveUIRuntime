# FAQ

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

## Is this a text-to-UI generator?

No.
It does not generate arbitrary HTML from prompts.

## Does it call an LLM at runtime?

No.
The critical render path is designed to remain deterministic and network-independent.

## Can it hide important product features?

It should not.
The policy model is intentionally conservative about hiding or removing important affordances.

## Is SSR supported?

Yes, as long as the same bootstrap inputs are used on the server and client.

## Is React required?

No.
The core planner is framework-agnostic.
React is just the first adapter.

## 한국어 요약

자주 나오는 질문에 대한 짧은 답은 아래와 같습니다.

- text-to-UI 생성기인가? 아니오.
- 런타임에 LLM을 호출하나? 아니오.
- 중요한 기능을 숨기나? 그러면 안 됩니다.
- SSR 가능한가? 예, 같은 bootstrap input을 쓰면 가능합니다.
- React 필수인가? 아니오. core는 framework-agnostic입니다.
