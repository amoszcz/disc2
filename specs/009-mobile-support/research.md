# Research: Mobile Browser Support

## Decision 1: Keep one responsive app shell and switch layout based on viewport width

- **Decision**: Reuse the existing single-page browser app and adapt its root layout, sidebar placement, and canvas sizing for narrow viewports instead of creating a separate mobile-only interface.
- **Rationale**: The game already renders through one bootstrap path and one set of scene modes. A responsive shell keeps desktop and mobile behavior aligned while limiting the change surface to layout and interaction seams.
- **Alternatives considered**:
  - Create a second mobile-specific page shell: rejected because it would duplicate scene wiring and UI rendering.
  - Keep the fixed desktop shell and rely on browser zoom: rejected because it would not satisfy readable, operable phone-browser play.

## Decision 2: Add touch-capable gameplay input through shared pointer-oriented interaction handlers

- **Decision**: Replace mouse-only map and battle interaction assumptions with touch-capable input handlers that support tapping for selection and action, plus direct viewport navigation gestures that work on mobile.
- **Rationale**: Current gameplay input relies on click, wheel, and middle mouse button behavior. Shared input translation around touch-capable browser events is the smallest way to preserve the existing gameplay state machine while making the feature playable on phones.
- **Alternatives considered**:
  - Add separate mobile-only action buttons for every map interaction: rejected because it would duplicate too much of the existing input model.
  - Depend on a third-party gesture library: rejected because browser-native input events are sufficient and avoid unnecessary dependencies.

## Decision 2a: Support mobile map zoom through a two-finger in-canvas gesture

- **Decision**: Interpret two-finger touch movement on the main play surface as a map zoom gesture that updates the existing viewport zoom state without invoking browser page zoom.
- **Rationale**: The mobile spec now requires players to zoom the map directly with touch. Reusing the existing viewport zoom model keeps zoom behavior consistent across desktop and mobile while preserving one navigation system.
- **Alternatives considered**:
  - Rely only on explicit zoom buttons for mobile: rejected because it does not satisfy the direct two-finger gesture requirement.
  - Allow browser pinch zoom and treat it as sufficient navigation: rejected because page zoom breaks canvas hit testing, layout stability, and session usability.

## Decision 2b: Normalize zoom bounds to a scenario-independent Border Watch baseline

- **Decision**: Define the allowed minimum and maximum in-game zoom levels from the tile sizes already used by Border Watch, then apply those same tile-size endpoints to every scenario instead of deriving zoom limits from each map's total dimensions.
- **Rationale**: The current behavior makes small maps top out with oversized tiles and large maps top out with undersized tiles at the same nominal zoom limit. A shared baseline preserves a predictable visual scale and makes mobile zoom behavior consistent across scenario changes.
- **Alternatives considered**:
  - Keep per-scenario zoom bounds derived from map size: rejected because it preserves the inconsistency the feature is intended to remove.
  - Choose a brand-new arbitrary zoom range unrelated to existing scenarios: rejected because Border Watch already provides an accepted visual reference and reduces re-tuning risk.

## Decision 3: Make canvas dimensions responsive and normalize viewport state against the rendered canvas size

- **Decision**: Size the game canvas from the live container dimensions and re-normalize map viewport math whenever the available viewport changes.
- **Rationale**: Current viewport calculations assume a fixed `896x640` canvas, which is not robust on narrow screens or after orientation changes. Responsive canvas metrics are required to keep map visibility, hit testing, and zoom behavior consistent on mobile, including while a two-finger gesture is actively changing zoom level and while normalized zoom bounds are applied to different map sizes.
- **Alternatives considered**:
  - Keep a fixed internal canvas and only scale it with CSS: rejected because hit testing and readable tile sizing would drift on small screens.
  - Force landscape-only play: rejected because the feature requires mobile-browser playability, not a restricted orientation workaround.

## Decision 3a: Center the initial scenario viewport on the starting hero

- **Decision**: When a scenario session begins, initialize the map viewport so the selected starting hero appears at the center of the visible map area whenever bounds allow, and clamp that framing near edges or corners.
- **Rationale**: The spec now requires the player to begin with their controllable unit in focus instead of relying on a generic origin view. Applying hero-centered framing during scenario startup improves orientation immediately and fits naturally within the existing viewport normalization path.
- **Alternatives considered**:
  - Keep the current default top-left or map-derived framing: rejected because it can start the player away from their controllable unit.
  - Delay centering until the first user interaction: rejected because the requirement is for the initial scenario view itself.

## Decision 3b: Price diagonal route steps longer than orthogonal route steps

- **Decision**: Update route-distance calculation so a diagonal step contributes more distance than a horizontal or vertical step across otherwise equivalent terrain.
- **Rationale**: The current equal-step treatment understates diagonal travel compared with the actual map geometry. Applying a longer diagonal distance keeps route previews and movement cost aligned with player expectations without changing which neighboring tiles are reachable.
- **Alternatives considered**:
  - Keep diagonal and orthogonal steps at equal distance: rejected because it preserves the inaccuracy called out in the spec.
  - Remove diagonal movement entirely: rejected because the requirement is to account for longer diagonal travel, not to reduce movement options.
  - Approximate all routes with Manhattan-only distance: rejected because it would distort existing route shapes and path selection behavior.

## Decision 4: Preserve the existing map, battle, and victory rules while adapting only control affordances, layout, and route-distance weighting

- **Decision**: Keep the current scenario rules, turn flow, battle resolution, and completion logic unchanged aside from the newly required diagonal-aware route-distance weighting, while adding mobile-friendly labels, control sizes, and action placement where needed.
- **Rationale**: The spec is primarily about accessibility and operability on mobile, with one explicit adjustment to route-cost calculation. Limiting rule changes to that single distance-weighting requirement minimizes regression risk and keeps the work sharply scoped.
- **Alternatives considered**:
  - Simplify gameplay rules for mobile: rejected because it would expand scope beyond browser support.
  - Add separate mobile scenarios or battle modes: rejected because the current feature only needs current scenarios to be playable.

## Decision 5: Prove mobile support with mobile-sized acceptance coverage plus targeted integration tests

- **Decision**: Use Playwright mobile-sized browser contexts for end-to-end evidence and add Vitest coverage for layout state, initial hero-centered framing, input translation, resize handling, and cross-scenario zoom-bound normalization through public seams.
- **Rationale**: Mobile support is primarily a user-visible behavior change spanning layout, input, and scene flow. Acceptance coverage is needed to prove real mobile-browser usability, while integration tests provide faster feedback for viewport, initial framing, input, and normalized zoom state transitions.
- **Alternatives considered**:
  - Rely only on unit-level input tests: rejected because that would miss DOM wiring and real viewport behavior.
  - Rely only on manual device testing: rejected because the constitution requires automated feature-proof where practical.

## Decision 6: Treat viewport changes as state-preserving UI events rather than session resets

- **Decision**: Orientation changes, address-bar expansion/collapse, and similar viewport updates should trigger layout and viewport normalization while preserving the active scenario session.
- **Rationale**: The spec requires continued play across common mobile viewport shifts. Recomputing presentation state without rebuilding the scenario session keeps the player’s progress intact.
- **Alternatives considered**:
  - Reload or rebuild the session on resize: rejected because it would violate session continuity.
  - Ignore viewport changes after initial load: rejected because controls and map visibility could become unusable mid-session.
