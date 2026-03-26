# Rule Authoring Guide

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

Rules are the heart of the scoring model.
They should stay deterministic, explainable, and easy to audit.

## Good Rule Shape

A good rule is:

- narrow in scope
- easy to explain in one sentence
- based on stable input signals
- bounded in magnitude
- reversible when inputs change

## Good Examples

- expert users increase compact-density affinity
- high keyboard usage increases command-first affinity
- reduced motion forces low-motion transitions
- repeated panel collapse lowers optional panel priority

## Bad Examples

- giant rules that mix five dimensions at once
- opaque statistical outputs with no explanation
- rules that override explicit user settings
- rules that rewrite task semantics

## Authoring Checklist

Before adding a rule, ask:

1. Which exact input signals does it depend on?
2. Can I explain the rule to a user?
3. Can I test it with a deterministic fixture?
4. Does it need hysteresis or cooldown?
5. Could it hide important functionality?

## 한국어 요약

rule은 scoring의 핵심이지만, 복잡할수록 위험합니다.

좋은 rule의 조건:

- 범위가 좁다
- 한 문장으로 설명 가능하다
- 입력 신호가 안정적이다
- 영향력이 과도하지 않다
- 결정적 테스트가 가능하다

나쁜 rule의 예:

- explicit 설정을 덮어씀
- 너무 많은 차원을 한 번에 섞음
- 설명 불가능한 black-box 결과를 바로 사용함
