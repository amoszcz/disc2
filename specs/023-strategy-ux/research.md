# Research: Strategy UX Clarity

## Decision: Derive decision feedback from existing state

**Rationale**: Route previews, terrain feedback, target state, turn state, and transitions already contain known consequences. Presentation will explain that state rather than duplicate it.

**Alternatives considered**: A separate UI-only store was rejected because it could become stale or diverge from game rules.

## Decision: Make recovery explicit before committing

**Rationale**: Replacing a destination is natural, but visible cancel and target-reset paths make reversibility discoverable on touch and keyboard input.

**Alternatives considered**: Undo after resolved movement or combat was rejected because it changes game rules.

## Decision: Keep unavailable-action explanations in context

**Rationale**: Disabled controls alone are ambiguous. Map and battle panels can state the blocking condition without relying on hover.

## Decision: Validate real desktop and mobile flows

**Rationale**: Focus, touch, and responsive placement need browser proof in addition to state contracts.
