# Change Playbook

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This playbook gives a step-by-step process for common change types in the repository.

## Planner Change Playbook

1. Read the relevant core types and planner code.
2. Confirm precedence and stability implications.
3. Implement the smallest deterministic change.
4. Add or update unit tests.
5. Update explainability if reasoning changed.
6. Update docs if the public behavior changed.

## React Adapter Change Playbook

1. Read the relevant provider, surface, and hook code.
2. Confirm whether SSR or hydration can be affected.
3. Preserve plan-driven rendering.
4. Add or update React integration tests.
5. Run consumer smoke if the public package contract moved.

## Example App Change Playbook

1. Confirm the demo still represents constrained adaptation.
2. Avoid changes that only improve visuals but reduce clarity.
3. Update Playwright coverage for visible behavior changes.
4. Update example walkthrough docs if the demo changes materially.

## Docs Change Playbook

1. Keep English first.
2. Add Korean guidance or summary.
3. Update the documentation map.
4. Verify commands and file paths are still valid.

## Packaging Change Playbook

1. Check `exports`, `types`, `files`, and `publishConfig`.
2. Run build.
3. Run `tests/usage` if consumer installation or imports may be affected.
4. Prefer `publish --dry-run` before any real publication.

## 한국어 요약

작업 유형별 기본 순서는 다음과 같습니다.

- planner 변경: core 읽기 → precedence/stability 확인 → 최소 수정 → unit test → docs
- react 변경: provider/surface/hook 확인 → SSR 영향 확인 → integration test
- example 변경: 데모 철학 유지 → Playwright 갱신 → walkthrough docs 갱신
- docs 변경: 영어 먼저, 한국어 요약 유지, 문서 맵 갱신
- packaging 변경: `exports`/`files`/`publishConfig` 확인 후 build와 usage smoke 검증
