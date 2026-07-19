# Feature Specification: Configurable Fog of War

**Feature Branch**: `021-fog-of-war`

**Created**: 2026-07-19

**Status**: Draft

**Input**: User description: "Add fog of war. Default visibility is 6 tiles but configurable and it may be disabled. It works as an additional layer above the map. It has minimal opacity but shows only terrain, not objects. Visited locations still have fog of war at 50% opacity."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Explore an Unseen Map (Priority: P1)

As a player, I see terrain beyond my heroes but not map objects in areas I have never visited, so that exploration reveals meaningful information gradually without making the map unusable.

**Why this priority**: The unexplored-map layer is the core value of fog of war; without it, the feature does not change exploration.

**Independent Test**: Start a scenario with fog enabled, inspect a tile beyond the hero's visibility range, and verify its terrain remains visible while its objects and locations are concealed by the unexplored fog layer.

**Acceptance Scenarios**:

1. **Given** fog of war is enabled and a tile has never been visible to a player's hero, **When** the map is drawn, **Then** the tile shows terrain through a minimal-opacity fog layer and does not reveal map objects, resources, guarded locations, or other concealed map content.
2. **Given** fog of war is enabled, **When** a player pans or zooms the map, **Then** the fog remains aligned above the corresponding world tiles.
3. **Given** an unexplored tile lies within the current visibility radius of a player's hero, **When** the map is drawn, **Then** the tile and its normal map content are fully visible.

---

### User Story 2 - Retain Explored-Area Memory (Priority: P1)

As a player, I can distinguish places my heroes have visited from places they have never seen, so that I retain map knowledge while still seeing that a location is no longer in current view.

**Why this priority**: Remembering explored terrain makes the fog useful for navigation and is necessary to distinguish current vision from past exploration.

**Independent Test**: Move a hero so a tile first becomes visible and then leaves current visibility; verify that the tile changes from fully visible to a 50%-opacity visited fog layer instead of returning to unexplored fog.

**Acceptance Scenarios**:

1. **Given** a tile was previously within a player's hero visibility range but is no longer within that range, **When** the map is drawn, **Then** the tile is covered by visited fog at 50% opacity.
2. **Given** a tile is covered by visited fog, **When** it returns to a hero's current visibility range, **Then** the fog is removed and its current map content is fully visible.
3. **Given** a player changes maps through normal map travel, **When** they return to a previously explored map, **Then** that map retains its explored-area memory for the current scenario session.

---

### User Story 3 - Control Fog Visibility (Priority: P2)

As a player, I can change the visibility radius or disable fog of war, so that I can choose how much exploration constraint I want while retaining the normal map experience when fog is off.

**Why this priority**: Configurability supports different play preferences without weakening the default exploration experience.

**Independent Test**: Change the visibility radius from the default, verify the newly visible boundary changes accordingly, then disable fog and verify all map content is visible.

**Acceptance Scenarios**:

1. **Given** fog of war is enabled with no player preference, **When** a scenario starts, **Then** each active player hero reveals tiles within the default six-tile visibility radius.
2. **Given** a player changes the visibility radius, **When** the map is drawn, **Then** the fully visible area reflects the selected radius around that player's active heroes.
3. **Given** a player disables fog of war, **When** the map is drawn, **Then** no fog layer is shown and all terrain and map content are visible.

### Edge Cases

- What happens when visibility areas from multiple active-player heroes overlap? Their union is fully visible, with no fog seam in the overlap.
- What happens when the visibility radius reaches beyond map bounds? Only valid map tiles are evaluated; the map does not render space outside its bounds.
- What happens when a hero is defeated, changes maps, or is no longer controlled by the active player? Its vision no longer contributes to current visibility, while already visited tiles remain remembered.
- What happens when fog is enabled after it was disabled? The current scenario uses the exploration information accumulated during the active session; tiles not yet visited use unexplored fog.
- What happens when the viewport changes size, pans, or zooms? Fog coverage remains registered to world tiles rather than screen coordinates.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render fog of war as a layer above the adventure map and below all player-facing map interaction feedback.
- **FR-002**: With fog enabled, the system MUST fully reveal terrain and map content within the current visibility area of the active player's available heroes.
- **FR-003**: The default visibility radius MUST be six map tiles for each active-player hero.
- **FR-004**: The system MUST allow the player to select a visibility radius for fog of war.
- **FR-005**: The system MUST allow the player to disable fog of war entirely.
- **FR-006**: When fog is disabled, the system MUST show all terrain and map content without a fog layer.
- **FR-007**: A never-visible tile MUST show terrain through minimal-opacity unexplored fog and MUST NOT reveal map objects, resources, guarded locations, or concealed units.
- **FR-008**: A previously visible tile outside current hero visibility MUST render a visited fog layer at 50% opacity.
- **FR-009**: The system MUST record explored tiles separately for each scenario map during the active scenario session.
- **FR-010**: The current visibility area MUST be the union of the visibility ranges of all active-player available heroes on the active map.
- **FR-011**: Fog coverage MUST remain aligned with world tiles while the player pans, zooms, resizes the viewport, or changes device orientation.
- **FR-012**: Fog MUST NOT alter route legality, movement, combat, scenario completion, or existing map controls.
- **FR-013**: The system MUST preserve exploration memory when the player leaves and returns to a map during the same scenario session.

### Key Entities *(include if feature involves data)*

- **Fog Settings**: The player's enabled/disabled choice and selected visibility radius; the default radius is six tiles.
- **Current Visibility Area**: The valid map tiles presently revealed by active-player available heroes.
- **Exploration Memory**: The per-map record of tiles that have been visible at least once during the active scenario session.
- **Fog Tile State**: One of fully visible, visited fog, or unexplored fog for a particular map tile.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In fog-enabled validation, 100% of tiles within six tiles of an active-player hero are fully visible at scenario start.
- **SC-002**: In exploration validation, 100% of never-visible sampled tiles conceal map objects while retaining visible terrain through unexplored fog.
- **SC-003**: In revisit validation, 100% of sampled previously visible tiles outside current visibility render with 50% visited fog and return to full visibility when revisited.
- **SC-004**: In fog-disabled validation, 100% of sampled map tiles and objects are visible without any fog overlay.
- **SC-005**: In pan, zoom, resize, and map-travel validation, 100% of sampled fog tiles stay aligned to their world positions and retain their expected visibility state.

## Assumptions

- A six-tile radius includes tiles whose horizontal and vertical offsets from a hero are each no greater than six, matching the map's existing eight-directional movement model.
- "Minimal opacity" for unexplored fog means a 15% visual overlay; its information restriction comes from concealing map objects rather than from making terrain unreadable.
- The 50% visited-fog opacity is fixed for this feature.
- Fog settings apply to the active game session and use the existing game settings experience for player configuration.
- Exploration memory begins fresh for a newly started scenario and is not a saved-game feature.

## Out of Scope

- Line-of-sight blocking by terrain, walls, elevations, or obstacles.
- Fog visibility based on enemy units, temporary spells, or individual hero equipment.
- Persistent exploration memory across separate scenario sessions or page reloads.
- Changes to route planning, movement costs, combat rules, or victory conditions.
