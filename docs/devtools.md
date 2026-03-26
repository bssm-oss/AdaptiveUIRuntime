# Devtools Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

The devtools package exists so that adaptive behavior is inspectable instead of mysterious.

## Main Views

The devtools overlay and panel should help answer:

- which surface is active
- which profile values are explicit versus learned
- which variants were selected
- why each score was assigned
- which rules were blocked
- whether stability guards prevented a switch

## Intended Users

- application engineers debugging plans
- designers validating policy behavior
- product teams reviewing explainability
- QA verifying scenario simulations

## Simulation Features

The devtools can simulate:

- novice
- expert
- mobile
- high contrast
- reduced motion

These simulations should be bounded and reversible.

The panel and overlay also support localized UI copy through a `labels` prop.
This is useful when the host product is localized but the underlying runtime
contracts remain the same.

## Freeze Current Plan

The freeze control is meant for:

- screenshot capture
- bug repro isolation
- comparison against a live adaptive session

It should not be confused with a persisted user preference.

## 한국어 요약

devtools의 목적은 adaptive UI를 "자동으로 뭔가 바뀌는 검은 상자"가 아니라 "점검 가능한 시스템"으로 만드는 것입니다.

여기서 확인해야 하는 정보는 다음과 같습니다.

- 현재 surface
- explicit vs learned 값
- 선택된 variant
- score breakdown
- 막힌 rule 이유
- stability/cooldown 때문에 유지되었는지 여부

simulate와 freeze 기능은 디버깅과 QA를 위해 존재합니다.
패널과 오버레이는 `labels` prop으로 표시 문구를 현지화할 수도 있습니다.
