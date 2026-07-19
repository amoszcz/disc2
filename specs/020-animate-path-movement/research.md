# Research: Animate Path Movement

## Decision 1: Separate route planning from timed route execution

- **Decision**: Preserve the existing pathfinding and route-validation rules, but expose route progress as an ordered step sequence that a focused traversal controller executes immediately or at one-second intervals.
- **Rationale**: `confirmRoutePreview` currently validates and applies every affordable step synchronously. Separating execution lets the controller apply the existing one-step movement rules at each interval, preserving cost, pickup, travel-link, guarded-location, and route-continuation behavior.
- **Alternatives considered**:
  - Animate only the rendered sprite while committing the whole route at once. Rejected because map events and visible state would disagree during the animation.
  - Add timing directly to the renderer. Rejected because rendering should not own movement legality or state transitions.

## Decision 2: Use a browser-native timer with a cancellable traversal state

- **Decision**: Use a single browser timer controlled by a traversal state owned by the app scene layer; each tick advances exactly one already-planned legal step, then triggers a normal state refresh.
- **Rationale**: The project is a browser-only Vite app and needs no dependency for a one-second cadence. One active traversal makes input locking, cleanup, and forced stops explicit.
- **Alternatives considered**:
  - A request-animation-frame loop. Rejected because it adds time-accumulation complexity without improving the required one-step-per-second behavior.
  - Multiple scheduled timers for every route step. Rejected because cancellation and event-driven stops would be error-prone.

## Decision 3: Persist only validated user preferences in local browser storage

- **Decision**: Read persisted settings during application startup, validate the stored movement behavior and visual-template identifier, and write a normalized settings record whenever the player changes either preference.
- **Rationale**: The clarified specification requires settings to survive reloads and later sessions. Browser storage is available on the target platform and requires no backend or dependency.
- **Alternatives considered**:
  - Keep preferences only in `GameState`. Rejected because they would disappear on reload.
  - Persist the entire game state. Rejected because saved games are out of scope and introduce unrelated lifecycle complexity.

## Decision 4: Add a dedicated settings scene and reuse the template catalog

- **Decision**: Add a `settings` scene mode and settings overlay, reachable from the main menu and map UI; reuse the established ready-template catalog and selector binding in that overlay, removing the map-HUD selector.
- **Rationale**: This meets the dedicated-page requirement while retaining the single template catalog and existing invalid-template safeguards. A scene mode preserves the established menu/storybook/sprite-mapping navigation pattern.
- **Alternatives considered**:
  - A modal layered over the map. Rejected because the specification calls for a dedicated page and a distinct scene better isolates focus and input.
  - A separate catalog exclusively for settings. Rejected because it would violate the established shared-template source of truth.

## Decision 5: Treat forced stops as authoritative after each tile

- **Decision**: After every completed route step, check the same world-transition, encounter, blocked-location, and route-continuation conditions as normal movement; end the traversal immediately when any requires it.
- **Rationale**: This maintains game correctness and prevents a timer from advancing a hero after an encounter, world-map transition, invalidation, or the end of affordable movement.
- **Alternatives considered**:
  - Defer all event checks until the final tile. Rejected because it permits illegal or misleading intermediate movement.
