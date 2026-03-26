# Policy Model

> This document is bilingual. English content comes first, and a Korean summary appears later in the file.
> 이 문서는 영어와 한국어를 함께 제공합니다. 영어 본문이 먼저 나오고, 뒤쪽에 한국어 요약이 이어집니다.

This document defines how the runtime makes decisions, how conflicts are resolved, and how stability is preserved.

## Decision Hierarchy

The runtime resolves conflicts in the following strict order:

1. hard safety and accessibility constraints
2. explicit user preferences
3. account or organization policy
4. persisted learned preferences
5. session-level heuristics
6. defaults

This order is part of the product contract.

## Hard Constraints

Hard constraints are not advisory.
They remove a candidate from consideration entirely.

Typical examples:

- a variant is invalid for the current device form factor
- a variant conflicts with reduced motion
- a policy requires a specific variant in a zone
- a variant would remove a required control

Hard constraints should answer:

- can this variant be used safely at all?

They should not answer:

- is this variant preferable?

Preference belongs in scoring, not in hard guards.

## Explicit Preferences

Explicit preferences represent direct user intent.

Examples:

- `theme`
- `density`
- `navMode`
- `defaultView`
- `contentMode`
- `expertise`

If a user has chosen a value, the runtime should not silently override it with learned behavior.

### Why explicit settings win

Without this rule, the system becomes untrustworthy.
A user who changes density to `comfortable` expects that choice to stay in effect until they change it again.

## Account And Org Policy

Policy exists to support host product requirements such as:

- regulated environments
- tenant-specific defaults
- rollout controls
- required modules or navigation structures

Policy is below safety and explicit user intent but above learned inference.

## Learned Preferences

Learned preferences are deterministic scores, not opaque model predictions.

Examples:

- heavy chart interaction increases chart affinity
- repeated keyboard shortcut usage increases keyboard-flow affinity
- repeated detail expansion increases detailed mode affinity
- repeated widget collapse reduces the priority of that optional module

### Learned preference constraints

Learned inference should be conservative when:

- confidence is weak
- the affected dimension is high impact
- the change would affect navigation structure
- the user is early in the session

## Session Heuristics

Session heuristics capture short-lived context that should not necessarily become a long-term preference.

Examples:

- mobile or coarse pointer nudges touch-friendly spacing
- current session depth may favor summary-first onboarding for new users
- visibility state or active route context may affect whether a support panel is useful

These are intentionally lower precedence than persisted learned state.

## Defaults

Defaults are the final fallback.

Defaults should be:

- stable
- accessible
- broadly useful
- design-system aligned

Defaults must never depend on hidden server state in a way that causes hydration mismatch.

## Scoring Semantics

Scoring is rule-based and weighted.
The current model combines:

- base score
- preference match or mismatch
- learned affinity adjustments
- zone-specific weighting
- rule contributions
- default-variant tie support

Score contributions are preserved so a plan can be explained later.

## Stability Semantics

Scoring alone is not enough.
A system that always picks the current numerical winner will visibly oscillate.

The runtime therefore applies stability after scoring.

### Hysteresis

Hysteresis keeps the previous variant if the score improvement of a challenger is below a configured threshold.

Use hysteresis for:

- density-sensitive layout changes
- default view changes
- optional support modules
- navigation changes

### Cooldown

Cooldown prevents certain categories of changes from occurring too frequently.

The current implementation is especially conservative for navigation zones.

### Freeze

Freeze is a devtools-oriented override that locks a surface to its current plan.
It is useful for:

- debugging
- demos
- usability studies
- regression reproduction

## Why Navigation Is More Conservative

Navigation changes are high impact because they affect:

- learned motor memory
- orientation
- discoverability
- tab order and focus expectations

For this reason, the runtime treats navigation as a special category:

- harder to change
- protected by cooldown
- expected to remain stable within a session

## Manual Locks

A user lock is stronger than inference.
If a user has explicitly selected:

- a nav mode
- a density mode
- a theme
- a default view

the runtime should not reinterpret behavior to override that choice.

## Explainability Contract

Every final plan should make it possible to answer:

- what was selected?
- what was blocked?
- what preference source mattered?
- did stability stop a change?
- was the change driven by explicit input, policy, learning, or defaults?

This is why the plan stores:

- score contributions
- blocked reasons
- preference sources
- strategy trace
- stability reasons

## Unsafe Adaptation Patterns

The following are considered invalid uses of the policy model:

- hiding critical controls because a user “rarely clicks” them
- removing legal disclosures
- changing semantic structure in a way that breaks assistive technology expectations
- moving focus automatically because a plan changed
- continuously reordering primary navigation
- overriding explicit user choices because heuristics disagree

## Guidance For Adding New Rules

When adding a rule, ask:

1. Is this a hard constraint or a score contribution?
2. Can the rule be explained in plain language?
3. Is the rule stable across a session?
4. Does it conflict with explicit user settings?
5. Could it harm accessibility or discoverability?

If the answer to the last question is yes, the rule should likely be blocked or demoted.

## 한국어 요약

### 결정 우선순위

이 런타임은 충돌이 생기면 아래 순서로 해결합니다.

1. hard safety / accessibility constraint
2. explicit user preference
3. account 또는 organization policy
4. persisted learned preference
5. session heuristic
6. default

이 순서는 반드시 유지되어야 합니다.
그렇지 않으면 personalization이 사용자 의도와 안전 제약을 덮어쓰게 됩니다.

### hard constraint

hard constraint는 scoring으로 뒤집을 수 없는 규칙입니다.
예를 들어 reduced motion, contrast safety, 필수 UI 유지, focus stability 같은 항목이 여기에 속합니다.

### explicit preference

explicit preference는 사용자가 직접 선택한 값입니다.
theme, density, nav mode, default view 같은 항목은 learned score보다 항상 우선합니다.

### account / org policy

조직 정책은 제품 전체에서 허용하지 않는 UI 상태를 제한할 수 있습니다.
예를 들어 어떤 navigation mode를 금지하거나 compliance 상 필수 패널을 항상 노출하도록 강제할 수 있습니다.

### learned preference

learned preference는 deterministic heuristic 결과입니다.
신호는 수치형으로 저장되지만, explicit 설정이 있는 축은 건드리면 안 됩니다.
또한 신호가 약한 상태에서 큰 구조 변화를 일으키면 안 됩니다.

### session heuristic

session heuristic은 현재 세션에서 관찰한 behavior를 반영합니다.
다만 persisted learned preference보다 더 아래에 두어야 세션 내 작은 잡음 때문에 UI가 흔들리지 않습니다.

### defaults

기본값은 마지막 fallback입니다.
적응 신호가 부족하거나 정책상 바꾸기 애매할 때는 default variant가 남는 것이 맞습니다.

### scoring 의미론

score는 rule-based weighted contribution으로 계산합니다.
중요한 점은 score 숫자 자체보다도 “왜 그 점수가 나왔는지”가 함께 남아야 한다는 것입니다.
그래서 zone별 contribution trace가 필요합니다.

### stability 의미론

stability는 personalization 품질의 핵심입니다.
현재 모델에서 중요한 장치는 다음과 같습니다.

- hysteresis
- cooldown
- low-confidence no-op
- manual freeze / lock

이 장치가 없으면 사용자가 매 상호작용마다 다른 화면을 보게 됩니다.

### navigation이 더 보수적이어야 하는 이유

navigation 패턴은 density보다 훨씬 무거운 변화입니다.
sidebar, tabs, command-first 같은 구조 변경은 muscle memory와 task routing에 영향을 주므로 같은 세션 안에서는 매우 신중해야 합니다.

### manual lock

사용자가 lock한 값은 자동 변경 대상이 아닙니다.
manual override의 존재 이유 자체가 “이 축은 내가 정한다”는 의도를 명시하기 위함이기 때문입니다.

### explainability 계약

정책 모델은 결과만 맞으면 되는 것이 아니라, 왜 그런 결과가 나왔는지 개발자와 제품팀이 설명할 수 있어야 합니다.
따라서 최소한 다음 정보는 남아야 합니다.

- 어떤 source가 이긴 결정인지
- 어떤 rule이 적용됐는지
- 어떤 후보가 막혔는지
- stability가 결과를 유지시켰는지

### 위험한 적응 패턴

다음은 피해야 합니다.

- 낮은 사용 빈도를 근거로 핵심 기능을 숨김
- 법적 또는 정책상 필요한 UI를 제거함
- 설명할 수 없는 black-box 조작
- accessibility 손상을 감수한 optimization

### 새 rule을 추가할 때 질문할 것

새로운 rule을 추가할 때는 다음을 먼저 확인해야 합니다.

1. hard constraint인가, score contribution인가
2. plain language로 설명 가능한가
3. 세션 내에서 안정적으로 유지되는가
4. explicit 설정과 충돌하지 않는가
5. 접근성이나 discoverability를 해치지 않는가
