# Feature Specification: Map Zoom and Panning

**Feature Branch**: `004-map-zoom-pan`

**Created**: 2026-07-12

**Status**: Draft

**Input**: User description: "map zooming and panning."

## Clarifications

### Session 2026-07-12

- Q: What should the primary map-navigation input be? → A: Mouse wheel zoom with middle-mouse-button panning.
- Q: What should zoom anchor toward? → A: Zoom toward the cursor position.
- Q: How should map view state behave after leaving and returning to the adventure map? → A: Preserve the current zoom and pan state.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate Across Large Maps (Priority: P1)

As a player, I can pan the adventure map so I can inspect and reach areas that do not fit on screen at once.

**Why this priority**: Large scenarios lose playability if the player cannot move the viewport to unseen parts of the map. Panning is the minimum valuable slice for navigation.

**Independent Test**: Open a large scenario, move the viewport away from the starting area, and confirm the player can inspect distant terrain and return to the hero without losing map interaction.

**Acceptance Scenarios**:

1. **Given** the scenario map is larger than the visible play area, **When** the player pans the map, **Then** the viewport shifts to reveal off-screen map regions.
2. **Given** the player has panned away from the starting area, **When** the player pans back, **Then** previously viewed locations reappear in the correct positions.
3. **Given** the viewport reaches the edge of the scenario, **When** the player continues panning toward the boundary, **Then** the view stops at the map edge instead of exposing empty space.

---

### User Story 2 - Change Map Scale for Planning (Priority: P2)

As a player, I can zoom the adventure map in and out so I can switch between detailed local movement and broader route planning.

**Why this priority**: Once panning exists, zooming adds strategic readability by letting players inspect both nearby tiles and larger map regions.

**Independent Test**: Load a large scenario, zoom in for close inspection and zoom out for a broader overview, and confirm map content remains legible and interactive at each supported level.

**Acceptance Scenarios**:

1. **Given** the player is viewing the adventure map, **When** the player increases the zoom level, **Then** map tiles and objects appear larger within the viewport.
2. **Given** the player is viewing the adventure map, **When** the player decreases the zoom level, **Then** a larger portion of the map becomes visible at once.
3. **Given** the player points at a visible map area while zooming, **When** the zoom level changes, **Then** the viewport keeps the pointed-at area under the cursor as stable as possible.
4. **Given** the map is already at its maximum or minimum supported zoom level, **When** the player attempts to zoom farther in the same direction, **Then** the zoom level remains clamped within supported bounds.

---

### User Story 3 - Keep Map Interaction Reliable While Navigating (Priority: P3)

As a player, I can still select heroes, inspect destinations, and move correctly after zooming or panning so navigation controls do not break core map play.

**Why this priority**: Navigation only helps if existing map actions remain trustworthy after the viewport changes.

**Independent Test**: Pan and zoom the map, then select a hero and perform movement or terrain inspection actions to confirm the selected map position still matches what the player clicked.

**Acceptance Scenarios**:

1. **Given** the player has panned or zoomed the map, **When** the player selects a visible hero, **Then** the correct hero is selected.
2. **Given** the player has panned or zoomed the map, **When** the player chooses a visible destination tile, **Then** the attempted move targets the tile shown under the pointer.
3. **Given** the player leaves the adventure map and later returns, **When** the scene is shown again, **Then** the previous zoom level and pan position are restored.
4. **Given** the player returns to the preserved map view, **When** play continues, **Then** map interaction behaves consistently with the visible shifted view.

### Edge Cases

- What happens when the player tries to pan past the top, bottom, left, or right edge of the map? The viewport must stop at the map boundary.
- What happens when the player changes zoom near a map edge? The resulting view must remain within the legal map area.
- What happens when the player zooms toward the cursor near a map edge? The view should preserve the pointed-at area as much as possible without exceeding map bounds.
- What happens when the player zooms out on a small scenario that already fits the screen? The system must avoid shrinking the map into an unreadable or mostly empty presentation.
- What happens when the player pans or zooms and then immediately clicks a hero or destination? The selected location must still match the visible map position.
- What happens when the player ends a turn, enters battle, or returns from battle after adjusting the map view? The current zoom and pan state must be preserved when returning to the adventure map without corrupting map interaction.
- What happens when the player uses the mouse wheel or middle mouse button for navigation? Those inputs must adjust the viewport without triggering unintended movement or selection.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support viewport panning on the adventure map when the scenario is larger than the visible play area.
- **FR-002**: The system MUST allow the player to reveal off-screen map areas by changing the viewport position.
- **FR-003**: The system MUST prevent the viewport from moving beyond the legal map boundaries.
- **FR-004**: The system MUST support zooming the adventure map in and out across a bounded range of supported zoom levels.
- **FR-005**: The system MUST provide mouse-wheel zooming as the primary way to increase and decrease adventure-map zoom.
- **FR-006**: The system MUST provide middle-mouse-button drag panning as the primary way to move the viewport across the adventure map.
- **FR-007**: The system MUST preserve readable map presentation at every supported zoom level.
- **FR-008**: The system MUST keep map objects aligned to their correct map positions while the viewport is panned or zoomed.
- **FR-009**: The system MUST keep hero selection accurate after any supported viewport adjustment.
- **FR-010**: The system MUST keep destination selection and movement targeting accurate after any supported viewport adjustment.
- **FR-011**: The system MUST zoom toward the cursor position so the pointed-at map area remains as stable as possible during zoom changes.
- **FR-012**: The system MUST apply viewport bounds after zoom changes so the visible area never extends outside the scenario.
- **FR-013**: The system MUST preserve the current zoom level and pan position when the player leaves and later returns to the adventure map during the same play session.
- **FR-014**: The system MUST preserve normal map-scene interaction rules while navigation features are active.
- **FR-015**: The system MUST maintain consistent viewport behavior across repeated zoom and pan actions in the same play session.
- **FR-016**: The system MUST make the current zoom state understandable enough that players can tell whether they are viewing a close or broad map scale.
- **FR-017**: The system MUST allow large scenarios to be explored without requiring the entire map to be displayed at once.
- **FR-018**: The system MUST ensure zooming and panning apply only to the adventure map view unless another scene explicitly supports them.
- **FR-019**: The system MUST ensure mouse-wheel zooming and middle-mouse panning do not trigger unintended hero selection or movement actions.

### Key Entities *(include if feature involves data)*

- **Map Viewport**: The currently visible portion of the adventure map, including its position over the scenario and its current scale.
- **Zoom Level**: A bounded map-scale state that determines how much of the scenario is visible and how large map elements appear.
- **Zoom Anchor**: The visible map location under the cursor that the viewport attempts to preserve during zoom changes.
- **Pan Offset**: The horizontal and vertical displacement of the viewport relative to the full scenario.
- **View State**: The combined navigation state used to restore or maintain the current map presentation during play.
- **Map Interaction Target**: A visible map element or tile that the player selects after the viewport has been adjusted.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing on a large scenario, players can reveal every map edge through panning without exposing non-map space.
- **SC-002**: In viewport-boundary testing, 100% of sampled pan attempts beyond the map limits stop at valid boundaries.
- **SC-003**: In zoom testing, 100% of sampled zoom-in and zoom-out actions remain within the supported zoom range.
- **SC-004**: In interaction testing after viewport changes, 100% of sampled hero selections and movement clicks resolve to the intended visible target.
- **SC-005**: In usability testing, at least 90% of players can switch between a local-detail view and a broader route-planning view without guidance.
- **SC-006**: In scenario-navigation testing, players can move from the starting area to inspect a distant region and return to local play without resetting the session.
- **SC-007**: In scene-transition testing, 100% of sampled returns to the adventure map restore the previously used zoom and pan state within the same play session.

## Assumptions

- This feature extends the adventure map scene rather than adding navigation controls to battle scenes.
- The primary need is supporting large scenarios, especially maps that exceed the visible canvas area.
- Players need both a closer detail-oriented view and a wider planning-oriented view, but the exact visual styling of controls can be decided later.
- Desktop-first mouse input is acceptable for the first slice, with zoom on the mouse wheel and panning on the middle mouse button.
- The default view should remain stable and understandable for players who never change the zoom level, even though adjusted view state is preserved once the player navigates away and returns.
- Existing map gameplay, including hero selection and movement, remains in scope and must continue to work correctly after viewport adjustments.

## Out of Scope

- Minimap support or separate overview-map panels.
- Automatic camera follow behaviors for heroes, battles, or events.
- Scene transitions, cinematic camera movement, or animated flyovers.
- Touch-specific gesture design beyond the baseline requirement to support map zooming and panning.
