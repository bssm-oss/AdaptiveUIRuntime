# Versioning And Migrations

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Adaptive systems need clear migration rules because profile and telemetry schemas evolve over time.

## Recommended Strategy

- keep semantic versioning for package APIs
- version persisted profile payloads
- version telemetry schemas when shape changes
- provide migration paths for storage adapters

## 한국어 요약

adaptive system은 profile과 telemetry schema가 바뀔 수 있기 때문에 migration 전략이 중요합니다.

권장 원칙:

- 패키지는 semver 유지
- persisted profile payload는 version 포함
- telemetry schema 변경 시 version 관리
- storage adapter migration 경로 제공
