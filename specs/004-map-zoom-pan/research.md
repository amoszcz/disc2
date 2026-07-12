# Research: Map Zoom and Panning

## Decision 1: Introduce a dedicated viewport state instead of ad-hoc canvas offsets

- **Decision**: Represent map navigation through a dedicated viewport state that owns zoom level, pan offset, and derived visible bounds.
- **Rationale**: The feature must preserve view state across scene changes and keep input/remapping deterministic, which is much easier when navigation lives in one explicit state model.
- **Alternatives considered**:
  - Store temporary canvas offsets inside renderer locals: rejected because scene restoration and input translation would become fragile.
  - Recompute navigation state directly from DOM events only: rejected because it would not give the game a stable source of truth for testing and persistence.

## Decision 2: Use browser-native wheel and middle-mouse input without new libraries

- **Decision**: Implement mouse-wheel zooming and middle-mouse drag panning directly with DOM event listeners and browser-native canvas behavior.
- **Rationale**: The clarified input model is simple, desktop-focused, and well supported by the current stack, so a camera-control dependency would add unnecessary surface area.
- **Alternatives considered**:
  - Add a third-party pan/zoom helper: rejected because it increases dependency cost for behavior that can be implemented cleanly with existing APIs.
  - Use only on-screen controls: rejected because the spec clarifies wheel and middle-mouse as the primary inputs.

## Decision 3: Anchor zoom to the cursor by translating screen space through viewport math

- **Decision**: Keep the map location under the cursor as stable as possible during zoom changes by converting the pointer location into world coordinates before and after scaling.
- **Rationale**: Cursor-focused zooming is a core clarification, and explicit viewport math keeps this behavior deterministic and testable.
- **Alternatives considered**:
  - Zoom around the canvas center: rejected because it ignores the clarified UX decision and feels less precise on large maps.
  - Zoom around the selected hero: rejected because it makes inspection of distant map areas more awkward.

## Decision 4: Clamp viewport bounds after every pan and zoom mutation

- **Decision**: Re-normalize viewport state after every navigation change so the visible map never extends beyond scenario bounds.
- **Rationale**: Bound enforcement is a hard requirement and simpler to guarantee when every viewport mutation passes through the same clamp rules.
- **Alternatives considered**:
  - Clamp only during rendering: rejected because input and persistence could still carry invalid out-of-bounds state.
  - Allow overscroll and snap back later: rejected because it exposes non-map space and complicates interaction mapping.

## Decision 5: Persist viewport state in game state for map-scene restoration

- **Decision**: Store the active map view in `GameState` so it survives scene switches and re-renders within the same play session.
- **Rationale**: The spec explicitly requires that leaving and returning to the adventure map restores the prior zoom and pan state.
- **Alternatives considered**:
  - Reset the map view on every scene return: rejected because it contradicts the clarified behavior.
  - Keep viewport state only in a controller-local variable: rejected because it would be easier to lose during scene transitions and harder to validate in tests.

## Decision 6: Prove interaction accuracy through real click remapping tests

- **Decision**: Validate zoom/pan behavior with a mix of integration tests for transform math and acceptance tests that click visible map content after navigation.
- **Rationale**: The feature’s biggest risk is incorrect coordinate translation after navigation, so browser-level evidence is needed in addition to deterministic math tests.
- **Alternatives considered**:
  - Acceptance-only coverage: rejected because viewport math edge cases are easier and faster to prove in integration tests.
  - Math-only coverage: rejected because it would not prove real browser wheel/middle-mouse behavior and click targeting.
