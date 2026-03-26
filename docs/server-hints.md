# Server Hints

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Server hints are bounded inputs that help the server compute a better initial plan without waiting for client-side collectors.

## Good Uses

- locale
- timezone
- org policy flags
- coarse viewport bucket
- a serialized explicit preference snapshot

## Bad Uses

- large opaque recommendation payloads
- personalized content fetched during hydration
- unversioned blobs that clients cannot interpret safely

## Rules

1. Keep hints serializable.
2. Keep hints versioned.
3. Keep hints optional.
4. Treat hints as inputs, not commands.

## 한국어 요약

server hint는 서버가 첫 plan을 조금 더 잘 계산할 수 있게 도와주는 제한된 입력입니다.

좋은 예:

- locale
- timezone
- org policy
- coarse viewport bucket
- explicit preference snapshot

나쁜 예:

- 거대한 opaque recommendation payload
- hydration 중 가져오는 personalization 데이터
