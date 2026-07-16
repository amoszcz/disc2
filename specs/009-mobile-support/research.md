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

## Decision 3: Make canvas dimensions responsive and normalize viewport state against the rendered canvas size

- **Decision**: Size the game canvas from the live container dimensions and re-normalize map viewport math whenever the available viewport changes.
- **Rationale**: Current viewport calculations assume a fixed `896x640` canvas, which is not robust on narrow screens or after orientation changes. Responsive canvas metrics are required to keep map visibility, hit testing, and zoom behavior consistent on mobile.
- **Alternatives considered**:
  - Keep a fixed internal canvas and only scale it with CSS: rejected because hit testing and readable tile sizing would drift on small screens.
  - Force landscape-only play: rejected because the feature requires mobile-browser playability, not a restricted orientation workaround.

## Decision 4: Preserve the existing map, battle, and victory rules while adapting only control affordances and layout

- **Decision**: Keep the current scenario rules, turn flow, battle resolution, and completion logic unchanged while adding mobile-friendly labels, control sizes, and action placement where needed.
- **Rationale**: The spec is about accessibility and operability on mobile, not about redesigning gameplay. Preserving current rules minimizes regression risk and keeps the mobile work sharply scoped.
- **Alternatives considered**:
  - Simplify gameplay rules for mobile: rejected because it would expand scope beyond browser support.
  - Add separate mobile scenarios or battle modes: rejected because the current feature only needs current scenarios to be playable.

## Decision 5: Prove mobile support with mobile-sized acceptance coverage plus targeted integration tests

- **Decision**: Use Playwright mobile-sized browser contexts for end-to-end evidence and add Vitest coverage for layout state, input translation, and resize handling through public seams.
- **Rationale**: Mobile support is primarily a user-visible behavior change spanning layout, input, and scene flow. Acceptance coverage is needed to prove real mobile-browser usability, while integration tests provide faster feedback for viewport and input state transitions.
- **Alternatives considered**:
  - Rely only on unit-level input tests: rejected because that would miss DOM wiring and real viewport behavior.
  - Rely only on manual device testing: rejected because the constitution requires automated feature-proof where practical.

## Decision 6: Treat viewport changes as state-preserving UI events rather than session resets

- **Decision**: Orientation changes, address-bar expansion/collapse, and similar viewport updates should trigger layout and viewport normalization while preserving the active scenario session.
- **Rationale**: The spec requires continued play across common mobile viewport shifts. Recomputing presentation state without rebuilding the scenario session keeps the player’s progress intact.
- **Alternatives considered**:
  - Reload or rebuild the session on resize: rejected because it would violate session continuity.
  - Ignore viewport changes after initial load: rejected because controls and map visibility could become unusable mid-session.
