# Policy Model

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
