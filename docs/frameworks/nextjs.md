# Next.js Integration

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Next.js is a natural host for the runtime because SSR and hydration safety are first-class concerns.

## Guidance

- compute bootstrap inputs in a server boundary
- pass the same initial profile and context to the client provider
- keep client-only collectors out of server code

## 한국어 요약

Next.js에서는 서버 경계에서 bootstrap input을 만들고, 같은 profile/context를 클라이언트 provider에 넘기는 것이 핵심입니다.
client-only collector는 서버 코드에 섞지 않는 것이 좋습니다.
