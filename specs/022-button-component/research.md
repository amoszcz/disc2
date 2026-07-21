# Research: Shared Tactile Button Component

## Decision: Use one shared UI renderer for button markup

**Rationale**: The application builds its UI through HTML-rendering helpers. A shared renderer keeps each screen responsible for its label, action identity, and state while centralizing the base semantics and presentation classes. Existing controllers can continue to find controls through their current identifiers and test hooks.

**Alternatives considered**:

- Duplicate a common class list in each screen: rejected because it leaves markup and accessibility behavior distributed and prone to drift.
- Introduce a full third-party component library: rejected because the existing UI needs a small, local abstraction and no dependency is necessary.

## Decision: Preserve existing controls by passing configuration rather than changing event wiring

**Rationale**: Existing event handlers and tests identify controls by IDs, test hooks, and action data. Treating those as configuration ensures visual consolidation does not change gameplay or menu behavior.

**Alternatives considered**:

- Rebind controls using new selectors: rejected because it adds avoidable behavioral risk to a presentation-focused feature.

## Decision: Use native button semantics and browser-supported interaction states

**Rationale**: Native button behavior provides keyboard and touch compatibility. Distinct rest, hover where available, pressed, focus, disabled, busy, and selected states can be layered on top without altering the underlying action model.

**Alternatives considered**:

- Simulate buttons with non-button elements: rejected because it would require recreating native accessibility and keyboard behavior.
- Make hover feedback the sole active affordance: rejected because touch-only users do not hover.

## Decision: Validate the contract and representative UI flows

**Rationale**: A focused contract catches loss of properties and semantic states; existing screen contracts and user flows catch migration regressions. Browser-level checks are reserved for states that require a real browser to observe.

**Alternatives considered**:

- Test only implementation internals: rejected because it does not prove current controls remain usable.
