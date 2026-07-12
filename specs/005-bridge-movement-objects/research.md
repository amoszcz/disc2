# Research: Bridges and Movement Objects

## Decision 1: Reuse the painted-region authoring model for movement objects

- **Decision**: Author bridges, milestones, and rubble as painted object regions rather than one-off tile entries.
- **Rationale**: The spec explicitly clarifies region-based authoring, and the project already uses painted terrain regions successfully, so reusing that pattern keeps scenario content consistent and compact.
- **Alternatives considered**:
  - Per-tile object entries: rejected because they diverge from the clarified authoring preference and become verbose on larger maps.
  - Runtime-generated objects: rejected because the first slice is purely authored static content.

## Decision 2: Resolve movement objects after terrain lookup but before final movement validation

- **Decision**: First resolve the base terrain tile, then apply any movement-object effects on that tile, then validate the final passability and movement cost.
- **Rationale**: The spec requires movement-object rules to build on top of base terrain behavior, while bridges must still be able to change river passability before final movement-cost modifiers are applied.
- **Alternatives considered**:
  - Ignore terrain when objects are present: rejected because it would make terrain and objects compete rather than compose.
  - Apply object effects before terrain resolution: rejected because objects like milestone and rubble are explicitly modifiers of underlying terrain cost.

## Decision 3: Treat bridges as passability overrides limited to river tiles

- **Decision**: A bridge object converts only the river tiles it covers into traversable bridge tiles with cost 1, and non-river bridge placement fails scenario validation.
- **Rationale**: This preserves the current blocked-river rule while enabling explicit authored crossings, and it aligns with the clarified requirement to fail invalid placements.
- **Alternatives considered**:
  - Let bridges exist harmlessly on non-river tiles: rejected because it hides authoring mistakes.
  - Let bridges create broader crossing corridors beyond covered tiles: rejected because the first slice should keep crossings explicit and tile-bounded.

## Decision 4: Stack multiple movement objects deterministically with bridge first, then cost modifiers

- **Decision**: On overlapping movement-object regions, first apply bridge passability overrides, then apply additive cost modifiers such as milestone and rubble, and finally clamp the result to a minimum cost of 1.
- **Rationale**: The clarified spec allows stacking, so the engine needs a predictable composition order that preserves bridge legality while keeping other objects understandable.
- **Alternatives considered**:
  - Use last-object-wins precedence: rejected because it discards the clarified stacking behavior.
  - Allow arbitrary custom ordering per scenario: rejected because it adds unnecessary authoring complexity for the first slice.

## Decision 5: Validate movement-object authoring during scenario load

- **Decision**: Extend scenario validation to verify that movement-object regions are in bounds, use supported types, and never place bridge effects on tiles whose base terrain is not river.
- **Rationale**: Authoring mistakes are best caught at scenario load time so gameplay never has to guess how invalid object data should behave.
- **Alternatives considered**:
  - Validate only during movement attempts: rejected because failures would surface too late and inconsistently.
  - Silently ignore invalid object coverage: rejected because it conflicts with the clarified fail-fast rule.

## Decision 6: Prove object readability through route feedback and visible map markers

- **Decision**: Show movement-object influence through visible markers layered over terrain and by extending route feedback to mention bridges and movement modifiers.
- **Rationale**: The spec includes user-facing readability as a full story, so movement-object behavior must be understandable before and after a move, not only internally correct.
- **Alternatives considered**:
  - Hidden object logic with message-log-only explanation: rejected because it would force trial and error.
  - Render objects without route feedback: rejected because it would not explain stacked or bridge-enabled effects clearly enough.
