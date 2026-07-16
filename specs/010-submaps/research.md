# Research: Submap Transitions

## Decision 1: Keep submaps inside one scenario session rather than loading a separate scenario

- **Decision**: Treat the main map and all submaps as linked map spaces within one active scenario session.
- **Rationale**: The feature requires the player to travel into and out of connected spaces without losing progress. Reusing one scenario session preserves hero state, pickups, guards, turn flow, and victory evaluation without introducing scenario reload semantics.
- **Alternatives considered**:
  - Load each submap as its own scenario: rejected because it would complicate return travel and state continuity.
  - Treat submaps as menu-like scene transitions: rejected because the player needs normal map play after entering.

## Decision 2: Represent entries and exits as explicit map links in scenario data

- **Decision**: Define linked-map travel through explicit scenario data objects that connect a source trigger on one map to a destination position on another map.
- **Rationale**: Scenario-defined links are the smallest way to support caves, teleports, and future trigger flavors under one consistent travel rule. They also make invalid-link validation straightforward.
- **Alternatives considered**:
  - Hardcode cave and teleport behavior in controller logic: rejected because it couples scenario content to runtime code and does not scale to additional trigger kinds.
  - Infer return points automatically: rejected because multiple exits and multiple arrival sources require explicit mapping.

## Decision 3: Track an active map identifier in runtime state and re-render the existing map scene against that map

- **Decision**: Extend runtime state to know which world map is currently active, then reuse the current map scene, hit testing, route logic, and HUD flow against that active map.
- **Rationale**: The game already has one map scene pipeline. Switching the active map context is smaller and safer than building a new scene stack for submaps.
- **Alternatives considered**:
  - Create a separate scene mode for every submap: rejected because submaps still follow normal map rules.
  - Flatten all maps into one oversized map: rejected because explicit travel links and return points are core requirements.

## Decision 4: Restrict linked-map travel to map-capable scenes and fail safely on invalid links

- **Decision**: Only allow linked-map transitions while the current scene supports map interaction, and reject broken links without mutating the current session irreversibly.
- **Rationale**: The spec explicitly calls out combat, victory, and invalid-link safety. Transition routing should be gated before any session state changes are committed.
- **Alternatives considered**:
  - Allow transitions from any scene if a trigger is referenced: rejected because it risks corrupting battle or victory flow.
  - Best-effort partial transition when link data is invalid: rejected because silent fallback would hide broken scenario data and create inconsistent state.

## Decision 5: Preserve per-map state inside the current scenario so repeat travel remains consistent

- **Decision**: Keep map-specific state such as hero positions, cleared pickups, guarded locations, and other scenario progress within the single session model so travel away from and back to a submap keeps that state intact.
- **Rationale**: Re-entry continuity is a user-facing requirement. The data model should preserve one authoritative session world state rather than snapshotting and rebuilding maps on each travel event.
- **Alternatives considered**:
  - Reset submaps on every entry: rejected because it violates continuity.
  - Serialize and reload map snapshots on every transition: rejected because the current in-memory model is sufficient and simpler.

## Decision 6: Prove linked-map travel with scenario-level integration and acceptance coverage

- **Decision**: Use contract coverage for link definitions, integration tests for transition routing and repeated travel, and acceptance flows that enter and exit linked maps during real gameplay.
- **Rationale**: Linked-map travel crosses scenario data, runtime state, rendering context, and user-visible interaction. Behavior-level evidence is needed to prove that travel works in the actual game loop.
- **Alternatives considered**:
  - Rely only on unit-level link-resolution tests: rejected because that would miss scene wiring and route flow.
  - Rely only on manual scenario playthroughs: rejected because the constitution requires automated feature-proof where practical.
