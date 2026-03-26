# Security And Trust Boundaries

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Adaptive personalization changes what users see, so trust boundaries matter.

## Inputs to Treat Carefully

- cookie hints
- server-provided profile fragments
- organization policy payloads
- local storage state
- LLM-generated recommendations

## Security Guidance

- treat client storage as mutable and untrusted
- validate policy input before using it
- do not treat personalization state as an authorization boundary
- never let adaptation remove required security or legal UI
- treat LLM output as untrusted until the recommendation is validated
- never allow an LLM to invent new zones, variants, or privileged actions
- keep LLM usage outside first paint and hydration-critical paths
- keep explicit user settings higher priority than model suggestions

## 한국어 요약

personalization 입력은 신뢰 경계를 분명히 해야 합니다.

주의해서 다뤄야 할 입력:

- cookie hint
- 서버에서 내려온 profile 조각
- 조직 정책 payload
- local storage 상태
- LLM이 생성한 recommendation

중요 원칙:

- 클라이언트 저장소는 변조 가능하다고 가정
- policy input은 검증 후 사용
- personalization state를 권한 모델로 사용하지 않기
- 보안 또는 법적 필수 UI를 adaptation으로 제거하지 않기
- LLM 출력은 recommendation 검증 전까지 신뢰하지 않기
- LLM이 surface 밖의 zone, variant, privileged action을 새로 만들지 못하게 막기
- LLM은 첫 렌더나 hydration 핵심 경로가 아니라 control-plane에서 사용하기
- explicit user setting이 모델 추천보다 항상 우선하도록 유지하기
