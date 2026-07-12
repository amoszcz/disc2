# Research: Advanced Terrain Scenario

## Decision 1: Extend the existing app instead of creating a separate terrain prototype

- **Decision**: Implement terrain behavior inside the current browser game rather than creating a separate demo surface.
- **Rationale**: The terrain feature directly modifies hero movement, scenario content, and map readability already present in the app, so a parallel prototype would duplicate state and rendering logic.
- **Alternatives considered**:
  - Separate terrain sandbox: rejected because it would drift from the real hero movement loop.
  - Static terrain mock without engine integration: rejected because it would not prove real movement behavior.

## Decision 2: Represent terrain as painted regions that resolve to tile behavior

- **Decision**: Store scenario terrain as region definitions that cover sets of map cells, then derive each tile's effective terrain type from region membership.
- **Rationale**: The spec explicitly clarifies region-based terrain authoring. This reduces repetitive content definition across a 64x64 map while still allowing deterministic tile-level movement rules.
- **Alternatives considered**:
  - One explicit terrain entry per tile: rejected because it does not match the clarified authoring model and is more verbose to maintain.
  - Procedural terrain generation: rejected because the feature needs deterministic handcrafted validation.

## Decision 3: Use destination-tile costing for both orthogonal and diagonal movement

- **Decision**: Charge movement by the destination tile's terrain cost for all legal moves, including diagonals.
- **Rationale**: The clarified rule is simple, deterministic, and easier to explain to players than maintaining a separate diagonal multiplier.
- **Alternatives considered**:
  - Cost diagonals higher than orthogonal movement: rejected because it adds complexity not requested by the spec.
  - Restrict diagonals by terrain class: rejected because the clarification explicitly allows normal diagonal movement.

## Decision 4: Keep rivers and lakes fully blocked until a separate bridge feature exists

- **Decision**: Treat rivers and lakes as fully non-traversable, even where roads visually approach them.
- **Rationale**: The clarification explicitly rejects implicit crossings, and keeping blocked water absolute preserves clean rule boundaries.
- **Alternatives considered**:
  - Let roads override water passability: rejected because it silently introduces bridge behavior.
  - Allow river-only crossings: rejected because it still introduces an implicit exception outside the feature scope.

## Decision 5: Add terrain lookup and route validation as dedicated engine seams

- **Decision**: Introduce focused modules for terrain-region resolution, tile lookup, and route legality rather than embedding terrain rules directly inside existing map click handling.
- **Rationale**: The 64x64 map and multiple terrain classes increase rule complexity, so isolating lookup and validation keeps movement behavior testable and maintainable.
- **Alternatives considered**:
  - Inline terrain checks inside `heroActions.ts`: rejected because it would mix movement state mutation with terrain interpretation.
  - Route logic inside rendering or input code: rejected because it would weaken testability.

## Decision 6: Prove terrain readability through UI contracts and browser tests

- **Decision**: Validate terrain presentation with contract tests and browser acceptance tests rather than only internal engine checks.
- **Rationale**: The feature includes user-facing terrain readability, so proving only engine correctness would miss part of the spec.
- **Alternatives considered**:
  - Engine-only testing: rejected because it would not verify player-visible differentiation.
  - Acceptance-only testing: rejected because terrain lookup and route edge cases need fast deterministic integration coverage.
