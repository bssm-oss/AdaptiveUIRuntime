# Release Process

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document explains the intended release flow for the monorepo.

## Goals

- keep published packages coherent
- avoid broken workspace dependency versions
- validate package entrypoints before publishing
- make releases easy to audit

## Suggested Flow

1. land small reviewed pull requests
2. add or update changesets
3. run `./run all`
4. run package `pnpm publish --dry-run`
5. verify tarballs in a clean consumer project
6. publish from an authenticated npm session
7. tag and announce the release

## Important Checks

- package `exports`
- generated `dist`
- `files` allowlist
- repository metadata
- README presence
- cross-package version rewriting

## Current Practical Constraint

This repository can only complete real npm publication when the machine is authenticated to npm and the publishing account owns the target scope.

## 한국어 요약

릴리스의 기본 흐름은 다음과 같습니다.

1. 작은 PR로 병합
2. changeset 정리
3. `./run all` 실행
4. `publish --dry-run` 검증
5. 깨끗한 소비자 프로젝트에서 tarball 설치 확인
6. npm 로그인된 환경에서 실제 publish

현재 저장소는 npm 인증과 scope 소유권이 있어야 실제 publish가 가능합니다.
