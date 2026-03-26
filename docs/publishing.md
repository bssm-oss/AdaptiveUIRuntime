# Publishing

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This guide describes the current publishing expectations for the package set.

## Packages

The workspace currently prepares these publishable packages:

- `@adaptive-ui/core`
- `@adaptive-ui/react`
- `@adaptive-ui/devtools`
- `@adaptive-ui/otel`

## Pre-Publish Checklist

Before publishing:

1. run `./run all`
2. ensure package versions are correct
3. confirm npm authentication and scope permissions
4. confirm package manifests and tarballs look correct

## Useful Commands

```bash
pnpm build
pnpm publish --dry-run --no-git-checks --access public
pnpm pack --pack-destination /tmp/adaptive-ui-pack
```

## Current Known Constraint

Actual publish requires npm authentication for the `@adaptive-ui` scope.

If the machine is not logged in, `pnpm publish` will fail with `ENEEDAUTH`.

## Fresh Consumer Validation

A good publishing workflow validates installation from a clean directory or tarball consumer before shipping.

## 한국어 요약

현재 배포 대상 패키지는 다음 네 개입니다.

- `@adaptive-ui/core`
- `@adaptive-ui/react`
- `@adaptive-ui/devtools`
- `@adaptive-ui/otel`

배포 전 추천 체크리스트:

1. `./run all`
2. 버전 확인
3. npm 로그인과 scope 권한 확인
4. tarball 내용 확인

주의할 점:

- 실제 publish는 `@adaptive-ui` scope에 대한 npm 인증이 필요합니다.
- 로그인되지 않은 환경에서는 `ENEEDAUTH`로 실패합니다.

배포 전에는 tarball 또는 새 폴더 소비자 검증을 반드시 한 번 해보는 것이 좋습니다.
