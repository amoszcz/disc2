# Research: Core Map Loop

## Decision 1: Build the first slice as a single frontend TypeScript app

- **Decision**: Use a single browser application built in TypeScript.
- **Rationale**: The active slice is fully local, has no multiplayer or backend requirements, and benefits from one shared runtime for map state, battle state, and rendering.
- **Alternatives considered**:
  - Split frontend and backend: rejected because it adds deployment and API complexity without supporting any current requirement.
  - Plain JavaScript: rejected because deterministic game rules and a growing state model benefit from static typing early.

## Decision 2: Render map and combat with the native Canvas 2D API

- **Decision**: Use the browser Canvas 2D API directly for map and battle rendering.
- **Rationale**: The feature explicitly targets a 2D browser game, and this slice only needs tile rendering, sprite placement, movement feedback, and a simple combat scene. Native Canvas keeps the dependency surface small and aligns with the constitution.
- **Alternatives considered**:
  - Phaser or another full game engine: rejected because the first slice does not require physics, asset pipelines, or engine-level scene systems.
  - DOM-only rendering: rejected because battle and map boards are better expressed on a canvas and would become harder to animate or scale later.

## Decision 3: Keep scenario content data-driven from local files

- **Decision**: Store the initial playable scenario in repository content files loaded at startup.
- **Rationale**: Handcrafted data supports quick iteration on hero positions, guard placements, pickups, and victory rules without entangling content definitions with engine logic.
- **Alternatives considered**:
  - Hardcode scenario setup in engine modules: rejected because it mixes content with rules and makes tests harder to vary.
  - Add an in-app scenario editor: rejected because it is outside the first-slice scope.

## Decision 4: Use a centralized deterministic game-state store

- **Decision**: Maintain one authoritative game-state object with explicit transitions for map turns, battles, rewards, and victory checks.
- **Rationale**: The slice depends on carrying state cleanly between the map and battle contexts, and deterministic state transitions are easier to test than event-driven mutations scattered across UI code.
- **Alternatives considered**:
  - Mutate state directly inside canvas and input handlers: rejected because it would tightly couple UI behavior with rules.
  - Add a heavyweight external state library: rejected because the current scope can be handled with small internal modules.

## Decision 5: Test the engine with integration tests and the browser shell with acceptance tests

- **Decision**: Use Vitest for engine-level integration tests and Playwright for browser acceptance coverage.
- **Rationale**: The constitution prefers feature-proving evidence. Engine integration tests can validate battle queues, movement rules, and victory checks quickly, while Playwright proves the actual playable flow in a real browser.
- **Alternatives considered**:
  - Unit-test every helper in isolation: rejected because it would overfit implementation and under-prove the user-visible loop.
  - Browser acceptance tests only: rejected because battle and state edge cases need faster deterministic coverage than full end-to-end runs alone.

## Decision 6: Represent combat as a minimal ruleset tailored to guarded encounters

- **Decision**: Implement only the combat rules required by the current slice: agility-based queue order, one action per turn, defeat detection, and post-battle reward or map updates.
- **Rationale**: Guarded locations need combat, but the feature explicitly excludes advanced mechanics such as spells, terrain, or morale.
- **Alternatives considered**:
  - Design the full long-term battle system now: rejected because it would expand the scope beyond the active spec.
  - Replace tactical combat with auto-resolve only: rejected because the spec requires a visible minimal tactical battle.
