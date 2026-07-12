# Feature Specification: Advanced Terrain Scenario

**Feature Branch**: `003-advanced-terrain-scenario`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "more advanced scenario, 64x64 grid, with some places trespassable while other are not. There are roads that have lower movement points spending, normal terrains like grass or plains when spending is 1x and harder to traverse terrains like mud, woods, and non traversable like mountains, lakes and rivers."

## Clarifications

### Session 2026-07-12

- Q: What movement-cost scale should terrain use? -> A: Integer costs with road = 1, grass/plains = 2, mud/woods = 3.
- Q: What movement directions should heroes be allowed to use? -> A: Movement is 8-directional, with diagonals allowed.
- Q: How much should a diagonal move cost? -> A: Diagonal movement uses the destination tile's normal terrain cost.
- Q: How should terrain be represented in scenario data? -> A: Terrain is defined as larger painted regions and tile behavior is derived from region membership.
- Q: Can roads override rivers or lakes at crossings? -> A: No; water remains blocked unless a future bridge feature is added.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Travel Across a Large Terrain Map (Priority: P1)

As a player, I can move a hero across a 64x64 scenario map with different terrain types so I can plan routes around cost and passability.

**Why this priority**: This is the core value of the feature and the smallest independently testable slice that proves the larger map and varied terrain rules.

**Independent Test**: Load a 64x64 scenario, move a hero over roads, plains, woods, and diagonal destinations, confirm movement is reduced by the correct amount, and verify that terrain state remains consistent across turns.

**Acceptance Scenarios**:

1. **Given** a 64x64 scenario with mixed terrain, **When** the player moves a hero onto road tiles, **Then** movement is reduced by the lower road cost instead of the standard terrain cost.
2. **Given** a hero moves across grass or plains, **When** the movement resolves, **Then** the hero spends 2 movement for each traversed tile.
3. **Given** a hero moves across mud or woods, **When** the movement resolves, **Then** the hero spends 3 movement for each traversed tile.
4. **Given** a destination is diagonally adjacent and otherwise legal, **When** the player chooses that destination, **Then** the hero may move diagonally and pay the destination tile's normal terrain cost.

---

### User Story 2 - Respect Blocked Terrain Boundaries (Priority: P2)

As a player, I can clearly see which terrain is not traversable so I do not waste turns trying to enter impossible tiles.

**Why this priority**: Non-traversable terrain is a critical rule boundary that supports fair strategy and readable map design.

**Independent Test**: Attempt to move a hero into mountains, lakes, and rivers, including diagonal attempts near blocked terrain, and verify that each move is rejected without changing the hero position or spending movement.

**Acceptance Scenarios**:

1. **Given** a mountain tile is adjacent to the hero, **When** the player attempts to move onto it, **Then** the move is rejected and the hero remains in place.
2. **Given** a lake or river tile blocks the direct route, **When** the player attempts to cross it without a legal path, **Then** the game denies the move and preserves remaining movement.
3. **Given** the map contains passable and non-passable terrain in close proximity, **When** the player selects destinations around the boundary, **Then** only legal destinations are accepted.
4. **Given** a road visually approaches a river or lake boundary, **When** no bridge feature is present, **Then** the hero still cannot cross the blocked water terrain.

---

### User Story 3 - Read Terrain Information While Planning Routes (Priority: P3)

As a player, I can understand terrain costs and passability from the scenario presentation so I can choose efficient paths without trial and error.

**Why this priority**: Terrain rules only become strategically useful if players can read them from the interface and predict their effects.

**Independent Test**: Open the scenario, inspect the terrain presentation, select routes over different tile types, and verify the game communicates movement cost and blocked terrain clearly enough to predict the outcome before moving.

**Acceptance Scenarios**:

1. **Given** the player views the scenario map, **When** terrain tiles are displayed, **Then** roads, standard terrain, difficult terrain, and blocked terrain are visually distinguishable.
2. **Given** the player selects a route or destination, **When** the path is previewed or resolved, **Then** the movement impact is understandable from the UI feedback.
3. **Given** a player attempts an illegal move into blocked terrain, **When** the move is refused, **Then** the game communicates why the move cannot be made.

### Edge Cases

- What happens when a hero has enough movement for grass but not enough for the next mud or woods tile? The move must be rejected before entering the tile.
- What happens when a destination is reachable only through non-traversable terrain? The game must reject the path rather than approximating or clipping through blocked tiles.
- What happens when road tiles pass adjacent to rivers or lakes? The hero must remain restricted to legal traversable tiles only.
- What happens when a road reaches a river or lake edge without a future bridge feature? The water tile remains non-traversable and the move must still be rejected.
- What happens when a scenario contains the maximum intended 64x64 terrain grid with many mixed tile types or region boundaries? Terrain lookup and movement validation must remain consistent across the whole map.
- What happens when terrain presentation is ambiguous at map boundaries or transitions? The game must still apply the correct terrain rules and communicate the actual result.
- What happens when diagonal movement is attempted into a blocked tile? The move must be rejected using the same blocked-terrain rules as any other illegal move.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support a scenario map size of 64 tiles by 64 tiles.
- **FR-002**: The system MUST allow scenario definitions to assign a terrain type to each traversable or non-traversable map tile.
- **FR-003**: The system MUST support at least the following terrain categories: road, grass, plains, mud, woods, mountains, lakes, and rivers.
- **FR-004**: The system MUST classify roads, grass, plains, mud, and woods as traversable terrain types.
- **FR-005**: The system MUST classify mountains, lakes, and rivers as non-traversable terrain types.
- **FR-006**: The system MUST assign a movement cost to each traversable terrain type.
- **FR-007**: The system MUST define roads with a movement cost of 1.
- **FR-008**: The system MUST define grass and plains with a movement cost of 2.
- **FR-009**: The system MUST define mud and woods with a movement cost of 3.
- **FR-010**: The system MUST reject movement into non-traversable terrain without changing hero position.
- **FR-011**: The system MUST reject movement when the hero lacks enough remaining movement to pay the required terrain cost.
- **FR-012**: The system MUST preserve remaining movement when a move is rejected before entering a tile.
- **FR-013**: The system MUST evaluate movement legality using the terrain rules of the tiles involved in the attempted movement.
- **FR-014**: The system MUST allow hero movement in 8 directions, including diagonals.
- **FR-015**: The system MUST charge diagonal movement using the destination tile's normal terrain cost rather than a separate diagonal multiplier.
- **FR-016**: The system MUST apply terrain passability and movement-legality rules consistently to diagonal movement as well as orthogonal movement.
- **FR-017**: The system MUST allow scenario data to define terrain as larger regions whose member tiles inherit the region's terrain type.
- **FR-018**: The system MUST derive tile passability and movement cost from the terrain region that covers each tile.
- **FR-019**: The system MUST support region-defined terrain placement across the full 64x64 map.
- **FR-020**: The system MUST visually distinguish terrain categories so the player can tell low-cost, standard-cost, difficult, and blocked terrain apart.
- **FR-021**: The system MUST communicate why a move is rejected when the destination is blocked or too expensive.
- **FR-022**: The system MUST keep terrain and movement behavior consistent across turns and repeated interactions in the same scenario.
- **FR-023**: The system MUST maintain compatibility with existing hero movement rules except where terrain costs or blocked terrain modify movement outcomes.
- **FR-024**: The system MUST treat rivers and lakes as non-traversable even when a road reaches or borders them, unless a separate future bridge feature explicitly changes that rule.

### Key Entities *(include if feature involves data)*

- **Terrain Tile**: A map cell with a terrain type, passability state, and movement cost classification.
- **Terrain Type**: A named category such as road, grass, plains, mud, woods, mountain, lake, or river that determines passability and movement behavior.
- **Terrain Region**: A painted map area that assigns one terrain type to all tiles covered by the region.
- **Scenario Map**: A 64x64 map layout containing the terrain grid and any existing gameplay objects placed on top of it.
- **Movement Rule**: The rule set that determines whether a hero may enter a tile and how much movement is spent.
- **Route Feedback**: The player-visible information that explains movement cost, blocked destinations, or illegal path attempts.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In validation testing, 100% of sampled terrain tiles on a 64x64 scenario resolve to the correct passability and movement-cost behavior.
- **SC-002**: In movement testing, 100% of attempted moves onto mountains, lakes, and rivers are rejected without changing hero position or consuming movement.
- **SC-003**: In movement-cost testing, 100% of sampled road moves cost less movement than standard grass or plains moves, and 100% of sampled mud or woods moves cost more than standard terrain.
- **SC-004**: In usability testing, at least 90% of players can correctly predict whether a destination is cheap, standard, difficult, or blocked based on the map presentation before moving.
- **SC-005**: In scenario-scale testing, the game successfully loads and uses a 64x64 terrain map without terrain-rule inconsistencies across repeated turns.
- **SC-006**: In movement-cost validation, 100% of sampled road tiles charge 1 movement, 100% of sampled grass and plains tiles charge 2 movement, and 100% of sampled mud and woods tiles charge 3 movement.
- **SC-007**: In movement validation, 100% of sampled legal diagonal moves obey the same passability rules as other legal moves and charge the destination tile's normal terrain cost.
- **SC-008**: In scenario-data validation, 100% of sampled terrain-region definitions resolve to consistent tile-level movement behavior across the 64x64 map.

## Assumptions

- This feature extends the existing scenario and movement model rather than replacing the core hero-turn loop.
- The first version of this feature focuses on terrain movement behavior and map readability, not on bridges, boats, flying units, or terrain-specific combat bonuses.
- Roads, standard terrain, difficult terrain, and blocked terrain each use fixed movement behavior for the feature slice: road = 1, grass/plains = 2, mud/woods = 3.
- River tiles are treated as fully non-traversable in this slice rather than partially traversable along special crossings.
- The map remains grid-based, and terrain is evaluated tile-by-tile.
- Diagonal movement is a standard legal move type rather than a special-case traversal rule.
- Region boundaries are authoritative for terrain assignment, and each tile resolves to one effective terrain type at a time.
- Roads do not create implicit crossings over rivers or lakes in this slice.

## Out of Scope

- Bridges, ferries, boats, flying movement, or any special traversal exceptions for blocked terrain.
- Terrain-based combat modifiers, concealment rules, or vision effects.
- Procedural terrain generation or an in-game map editor.
- Additional terrain categories beyond those needed to support this movement-focused slice.
