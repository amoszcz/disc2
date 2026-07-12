# Feature Specification: Bridges and Movement Objects

**Feature Branch**: `005-bridge-movement-objects`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "we need bridges that can be placed on rivers which makes them traspasseble. There might be also some other static obejcts on the map that affect amounts of movement points. Lets think of some examples."

## Clarifications

### Session 2026-07-12

- Q: How should multiple movement objects on one tile behave? → A: Allow multiple objects on one tile and stack all effects.
- Q: How should invalid bridge placement on non-river tiles be handled? → A: Reject the scenario as invalid.
- Q: How should movement objects be authored in scenario data? → A: Author them as painted object regions rather than explicit per-tile entries.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Cross Rivers Through Bridges (Priority: P1)

As a player, I can move across river tiles where a bridge object exists so that blocked water no longer cuts off the map completely.

**Why this priority**: Bridges unlock new routes and directly change the current blocked-river rule, making them the highest-value movement-object addition.

**Independent Test**: Load a scenario containing river tiles with and without bridge objects, move a hero toward both, and confirm only the bridged river tiles are traversable.

**Acceptance Scenarios**:

1. **Given** a river tile contains a bridge object, **When** a hero moves onto that tile, **Then** the move is allowed and uses the bridge movement rule instead of the normal blocked-river rule.
2. **Given** a nearby river tile has no bridge object, **When** a hero attempts to enter it, **Then** the move is still rejected as blocked terrain.
3. **Given** a bridge spans part of a river crossing, **When** the player follows the bridged route, **Then** the crossing behaves as a continuous legal passage only on the bridged tiles.

---

### User Story 2 - Encounter Static Objects That Change Movement Cost (Priority: P2)

As a player, I can route around or through static map objects that change movement cost so that movement planning reflects more than terrain alone.

**Why this priority**: Once bridges exist, other static movement objects add richer route decisions without requiring new combat or economy systems.

**Independent Test**: Load a scenario with at least one movement-discount object and one movement-penalty object, move onto their affected tiles, and confirm the final movement cost changes as expected.

**Acceptance Scenarios**:

1. **Given** a tile contains a milestone object, **When** a hero enters that tile, **Then** the movement cost is reduced by 1 from the underlying terrain cost, but never below 1.
2. **Given** a tile contains a rubble object, **When** a hero enters that tile, **Then** the movement cost is increased by 1 above the underlying terrain cost.
3. **Given** a tile contains more than one supported movement object, **When** a hero enters that tile, **Then** the final movement result reflects the combined effects of all supported objects on that tile.
4. **Given** movement objects are authored as map regions, **When** a tile falls inside one or more object regions, **Then** the tile inherits the combined effects of those region-defined objects.
5. **Given** two candidate routes differ only by movement-affecting static objects, **When** the player chooses between them, **Then** the actual movement spent reflects the object modifiers on the chosen tiles.

---

### User Story 3 - Understand Why Map Objects Change Movement (Priority: P3)

As a player, I can read which map objects alter passability or movement cost so that route outcomes are understandable before I click.

**Why this priority**: Movement-object rules only become fair and strategic if the player can identify them from the map and feedback surface.

**Independent Test**: Open a scenario with bridges, milestones, and rubble, inspect their presentation and route feedback, and verify the UI communicates their effect on passability or movement cost.

**Acceptance Scenarios**:

1. **Given** the player views a bridge, milestone, or rubble object on the map, **When** the object is visible, **Then** it is visually distinguishable from the base terrain.
2. **Given** the player previews or attempts a move onto a movement-object tile, **When** route feedback is shown, **Then** the object’s passability or movement effect is understandable.
3. **Given** a move is legal only because of a bridge object, **When** the player uses that route, **Then** the game communicates that the bridge is what made the crossing possible.

### Edge Cases

- What happens when a river tile has no bridge object? It must remain blocked exactly as in the current terrain rules.
- What happens when a bridge object is placed on a non-river tile? The scenario must fail validation rather than silently changing unrelated terrain.
- What happens when a movement-discount object would reduce cost below 1? The final movement cost must clamp to 1.
- What happens when a movement-penalty object appears on already difficult terrain? The final cost must still apply deterministically and remain understandable to the player.
- What happens when two or more static movement objects affect the same tile? The system must stack their supported effects deterministically and still clamp the final movement result to legal bounds.
- What happens when movement-object regions overlap? The overlapping tile must apply the combined supported effects in a deterministic order.
- What happens when a bridge, milestone, or rubble object appears near blocked terrain boundaries? The game must apply only the object effects explicitly supported by the scenario data.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support static movement objects placed on map tiles in scenario data.
- **FR-002**: The system MUST support a bridge object that may be placed on river tiles.
- **FR-003**: The system MUST treat a river tile containing a bridge object as traversable.
- **FR-004**: The system MUST leave river tiles without bridge objects non-traversable.
- **FR-005**: The system MUST apply a deterministic movement cost to bridged river tiles.
- **FR-006**: The system MUST define the bridge movement cost as 1 for the first slice.
- **FR-007**: The system MUST support at least one static movement-discount object and one static movement-penalty object in addition to bridges.
- **FR-008**: The system MUST support a milestone object that reduces the underlying tile’s movement cost by 1 to a minimum final cost of 1.
- **FR-009**: The system MUST support a rubble object that increases the underlying tile’s movement cost by 1.
- **FR-010**: The system MUST apply movement-object rules after the base terrain movement cost is resolved.
- **FR-011**: The system MUST support multiple movement objects affecting the same tile in the first slice.
- **FR-012**: The system MUST stack supported movement-object effects deterministically when more than one movement object affects the same tile.
- **FR-013**: The system MUST clamp the final movement cost to a minimum of 1 after all supported movement-object effects are combined.
- **FR-014**: The system MUST apply bridge passability changes before evaluating final movement-cost modifiers on the same tile.
- **FR-015**: The system MUST reject scenario content that places a bridge object on a non-river tile.
- **FR-016**: The system MUST allow scenario definitions to author supported movement objects as painted object regions across the map.
- **FR-017**: The system MUST derive tile-level movement-object effects from movement-object region membership.
- **FR-018**: The system MUST keep hero movement validation consistent with both terrain and movement-object rules.
- **FR-019**: The system MUST preserve current blocked-terrain behavior for water tiles that are not explicitly bridged.
- **FR-020**: The system MUST communicate the movement effect of visible static movement objects to the player.
- **FR-021**: The system MUST visually distinguish bridges, milestones, and rubble from base terrain.
- **FR-022**: The system MUST explain when a move became legal because of a bridge object or changed cost because of a movement modifier object.
- **FR-023**: The system MUST keep movement-object behavior consistent across repeated turns and repeated route attempts in the same scenario.
- **FR-024**: The system MUST limit the first slice to scenario-authored static objects rather than player-built or destructible objects.

### Key Entities *(include if feature involves data)*

- **Movement Object**: A static map object that changes tile passability or movement cost.
- **Bridge Object**: A movement object placed on a river tile that converts that occupied tile into a legal crossing with bridge movement cost.
- **Milestone Object**: A movement object that reduces the cost of entering its tile relative to the underlying terrain, to a minimum of 1.
- **Rubble Object**: A movement object that increases the cost of entering its tile relative to the underlying terrain.
- **Movement Object Region**: A painted map area that applies one supported movement-object type to all tiles covered by that region.
- **Resolved Movement Tile**: The effective tile state after combining base terrain behavior with any supported static movement object.
- **Movement Object Placement**: The authored region entry that declares which supported movement object affects which map area.
- **Movement Effect Stack**: The ordered combination of all supported movement-object effects that apply to one tile before the final movement result is clamped.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In movement validation, 100% of sampled bridged river tiles are traversable and 100% of sampled unbridged river tiles remain blocked.
- **SC-002**: In scenario-content validation, 100% of invalid sampled bridge placements on non-river tiles cause scenario validation to fail.
- **SC-003**: In movement-cost validation, 100% of sampled milestone tiles reduce the final movement cost by 1 without going below 1.
- **SC-004**: In movement-cost validation, 100% of sampled rubble tiles increase the final movement cost by 1 above the resolved base terrain cost.
- **SC-005**: In stacked-effect validation, 100% of sampled tiles with more than one movement object resolve to the expected combined passability and movement cost.
- **SC-006**: In usability testing, at least 90% of players can correctly predict whether a bridge, milestone, or rubble object will make a route cheaper, more expensive, or newly traversable.
- **SC-007**: In repeated-turn testing, movement-object behavior remains consistent across 100% of sampled repeated route attempts in the same scenario.

## Assumptions

- Bridges and other movement-affecting objects are authored in scenario content rather than placed dynamically by the player during a match.
- The first slice needs a small, concrete set of supported examples instead of a generic scripting system for arbitrary movement modifiers.
- Bridges override river passability only on the tiles they occupy and do not create free-form water traversal beyond those tiles.
- Milestones and rubble affect only the tile they occupy in the first slice, but may stack with other supported movement objects on that same tile.
- Movement objects are authored as painted regions so object coverage is derived from region membership rather than one-off tile entries.
- Invalid bridge placements are treated as authoring errors rather than recoverable runtime warnings.
- Existing terrain rules, combat rules, and city systems remain otherwise unchanged.

## Out of Scope

- Player-built bridges, destructible bridges, or bridge repair systems.
- Movement objects that affect combat, vision, recruitment, or resources.
- Dynamic event-driven object spawning or removal during a scenario.
