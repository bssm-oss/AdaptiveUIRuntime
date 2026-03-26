# Security And Trust Boundaries

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Adaptive personalization changes what users see, so trust boundaries matter.

## Inputs to Treat Carefully

- cookie hints
- server-provided profile fragments
- organization policy payloads
- local storage state

## Security Guidance

- treat client storage as mutable and untrusted
- validate policy input before using it
- do not treat personalization state as an authorization boundary
- never let adaptation remove required security or legal UI

## 한국어 요약

personalization 입력은 신뢰 경계를 분명히 해야 합니다.

주의해서 다뤄야 할 입력:

- cookie hint
- 서버에서 내려온 profile 조각
- 조직 정책 payload
- local storage 상태

중요 원칙:

- 클라이언트 저장소는 변조 가능하다고 가정
- policy input은 검증 후 사용
- personalization state를 권한 모델로 사용하지 않기
- 보안 또는 법적 필수 UI를 adaptation으로 제거하지 않기
