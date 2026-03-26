# Surface Schema Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Surfaces are the core modeling unit of the runtime.

## What a Surface Represents

A surface is a known product screen or screen-like region, such as:

- `dashboard.home`
- `reports.analytics`
- `admin.users`

Each surface contains declared zones and approved variants.

## Zones

A zone is an adaptive slot with a stable semantic purpose.

Examples:

- `primaryNav`
- `hero`
- `summaryPanel`
- `mainContent`
- `quickActions`

## Variants

Variants are pre-approved render options for a zone.

Variants can differ in:

- density
- disclosure
- default view
- emphasis
- token override

Variants should not differ in:

- fundamental task availability
- legal or compliance UI presence
- unsafe semantic structure changes

## Modeling Guidance

- Use one surface per meaningful workflow screen.
- Keep zone names stable and semantic.
- Start with a few important adaptive zones only.
- Keep one variant close to the current production UI as the default.

## 한국어 요약

surface는 이 런타임의 핵심 모델 단위입니다.
하나의 surface는 보통 하나의 화면이나 화면 수준의 작업 영역을 뜻합니다.

zone은 적응 가능한 slot이고, variant는 그 zone에서 허용된 미리 정의된 렌더 옵션입니다.

좋은 modeling 원칙은 다음과 같습니다.

- workflow 단위로 surface를 나누기
- zone 이름은 의미 있게 유지하기
- 처음에는 중요한 zone 몇 개만 적응 대상으로 잡기
- 현재 프로덕션 UI와 가까운 variant를 default로 두기

variant는 density, disclosure, emphasis 정도는 바꿀 수 있지만, 핵심 기능 가용성이나 법적 UI를 바꾸면 안 됩니다.
