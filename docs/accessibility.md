# Accessibility

Accessibility is a primary constraint of the runtime, not a follow-up concern after personalization.

## Accessibility Position

The runtime must never improve “personalization” by degrading:

- keyboard access
- focus stability
- semantic structure
- contrast legibility
- motion safety
- task discoverability

Adaptive behavior is only valid when it preserves these fundamentals.

## Non-Negotiable Rules

### Keyboard access

- all interactive controls remain reachable by keyboard
- personalization must not remove the only keyboard-accessible route to a task
- command-first modes must not trap users who do not rely on keyboard shortcuts

### Focus preservation

- plan changes must not steal focus
- plan changes must not unexpectedly relocate the active control
- post-hydration refinement must keep the active element stable

### Structure stability

- landmarks should remain stable across variants
- headings should remain meaningful and ordered
- the same task should not radically change semantic structure per user

### Reduced motion

- system reduced-motion preference takes priority
- transition-heavy variants must fall back safely
- animation is never required to complete a task

### Contrast

- higher contrast preferences must be respected
- token overrides must preserve text/control contrast
- decorative theming must not reduce readability

## Why Personalization Is Risky For Accessibility

Adaptive systems are uniquely risky because they can:

- change layout at runtime
- reorder content
- alter prominence
- hide optional modules
- introduce motion

If not constrained, those behaviors can break accessibility even when each individual component is accessible in isolation.

## Surface Design Guidance

When authoring a surface schema:

- keep primary task controls present across variants
- preserve semantic equivalence between variants
- avoid variants whose only difference is structural chaos
- define eligibility conditions for risky variants

Good adaptation changes emphasis, density, and default state.
Bad adaptation changes whether the task is understandable.

## Slot And Variant Guidance

Each variant should be reviewed for:

- keyboard tab flow
- focus-visible styling
- heading structure
- touch target size
- contrast
- screen-reader labels where necessary

If one variant is materially less accessible than another, it should not be eligible.

## Devtools And Explainability

Explainability improves accessibility operations because it lets a team inspect:

- which variant was chosen
- why it won
- whether motion or contrast preferences changed the output
- whether stability blocked a risky change

This is especially useful when debugging accessibility regressions that appear only for specific user profiles.

## Host App Responsibilities

The library helps, but the host app still owns:

- semantic component implementation
- accessible labels and names
- keyboard bindings
- focus-visible styling
- content clarity
- legal and policy UI presence

The runtime cannot make inaccessible components accessible by itself.

## Testing Strategy

Recommended accessibility validation includes:

- keyboard-only walkthroughs
- focus preservation assertions
- reduced-motion checks
- contrast audits for token packs
- screen-reader landmark sanity checks
- E2E verification of explicit preference persistence

This repository currently includes:

- React focus-preservation tests
- reduced-motion E2E coverage
- devtools exposure of plan and reasons

## Examples Of Safe Adaptation

- novice users see more onboarding hints without losing access to expert workflows
- expert users see denser layout while preserving headings and controls
- mobile users see bottom navigation and collapsed support rails without losing core actions

## Examples Of Unsafe Adaptation

- hiding a destructive or high-priority action because the user rarely used it
- removing a support rail that contains the only explanation for a workflow
- moving focus to a different panel when the plan changes
- replacing clear navigation with command-only behavior for non-keyboard users
