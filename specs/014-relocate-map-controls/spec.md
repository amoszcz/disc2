# Feature Specification: Relocate Map Controls

**Feature Branch**: `014-relocate-map-controls`

**Created**: 2026-07-18

**Status**: Draft

**Input**: User description: "Move game action buttons to a thin vertical icon bar beside the map, improve mobile access, and show a horizontal templated unit queue below the battle canvas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Reach Map Actions Without Page Scrolling (Priority: P1)

As a player, I can use the required map actions from a compact vertical control bar beside the map so that I do not have to scroll to the bottom of the page to end my turn or perform other map actions, especially on a phone.

**Why this priority**: Reliable access to map actions is necessary to finish turns and continue playing; the current unreachable controls block core gameplay on small screens.

**Independent Test**: Open an active scenario at supported phone and desktop viewport sizes, verify that the thin vertical bar is adjacent to the map, and complete each currently available map action without scrolling the document.

**Acceptance Scenarios**:

1. **Given** an active map scene at a supported phone-sized viewport, **When** the player views the map, **Then** the required map action controls are visible in a vertical bar immediately beside the map without document scrolling.
2. **Given** an active map scene, **When** the player activates the End Turn control from the side bar, **Then** the turn advances exactly as it does through the current end-turn action.
3. **Given** an active map scene, **When** the player activates any other available map action from the side bar, **Then** that action has the same result as its existing control.
4. **Given** an active map scene at a desktop viewport, **When** the player uses the side bar, **Then** all required map actions remain accessible without reducing map usability.

---

### User Story 2 - Understand Compact Icon Controls (Priority: P2)

As a pointer-and-keyboard player, I can identify compact action icons through hover tooltips so that the reduced-size controls remain understandable.

**Why this priority**: Replacing text buttons with small icons saves space, but the meaning of each action must remain discoverable on devices that support hovering.

**Independent Test**: Hover every map action icon with a pointer and verify a tooltip appears with the exact action name; activate each icon to confirm the tooltip does not alter the action.

**Acceptance Scenarios**:

1. **Given** a pointer-capable device and an active map scene, **When** the pointer hovers a side-bar action icon, **Then** a tooltip shows that action's name.
2. **Given** a side-bar action icon is not hovered, **When** the player views the map, **Then** the bar stays thin and does not permanently display full action labels.
3. **Given** a player uses a touch-only device, **When** they view the side bar, **Then** each icon remains usable without requiring a hover interaction.

---

### User Story 3 - Follow Battle Turn Order Below the Canvas (Priority: P1)

As a player in battle, I can see a horizontal queue of unit templates below the battle canvas and inspect each unit by hovering it so that I can understand upcoming turns without obscuring the battlefield.

**Why this priority**: Turn order is essential combat information, and placing it below the canvas preserves the battle play area while keeping it readily visible.

**Independent Test**: Start a battle with multiple participating units, verify a horizontal queue appears below the canvas in the current turn order using each unit's visual template, then hover every queue entry and confirm it identifies the represented unit.

**Acceptance Scenarios**:

1. **Given** a battle is active, **When** the battle canvas is shown, **Then** the unit turn queue is displayed horizontally below the canvas.
2. **Given** the battle turn order contains units with available dedicated visual templates, **When** the queue renders, **Then** each queue entry uses its unit's template rather than a generic text-only marker.
3. **Given** a pointer-capable device and a visible queue entry, **When** the player hovers that entry, **Then** a tooltip identifies the represented unit.
4. **Given** a battle action changes the upcoming turn order or removes a defeated unit, **When** the queue updates, **Then** it continues to show the current eligible units in horizontal order below the canvas.

### Edge Cases

- What happens when a phone viewport is very narrow or short? The vertical action bar must remain alongside the map and required controls must not require document scrolling to reach.
- What happens when the map has several actions available at once? The bar must remain thin and vertical while allowing every required action to be activated.
- What happens when an action is unavailable in the current game state? Its side-bar icon must communicate unavailability and must not trigger the action.
- What happens when a device cannot hover? Tooltips are supplemental; all required controls and the battle queue must remain usable and understandable through the existing non-hover interaction and visual context.
- What happens when a queued unit has no dedicated visual template? A clear fallback unit representation must appear, consistent with the existing unit-template fallback behavior.
- What happens when the battle queue is longer than the available width? It must remain below the canvas and continue to expose the current order without overlapping the battle canvas or making required battle actions unreachable.
- What happens when an action tooltip would extend outside the viewport? The tooltip must remain readable within the visible viewport.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST replace the current below-map placement of required map action controls with a control bar positioned beside the map play surface.
- **FR-002**: The system MUST arrange the map control bar vertically.
- **FR-003**: The system MUST keep the map control bar visually thin by presenting its controls as compact icons rather than persistent full-text buttons.
- **FR-004**: The system MUST include every map action currently required to progress or operate the active map scene in the side control bar, including End Turn when it is available.
- **FR-005**: The system MUST preserve the existing behavior and game-state rules of every map action after relocation.
- **FR-006**: The system MUST keep all required map actions reachable without document scrolling at supported phone-sized viewports.
- **FR-007**: The system MUST provide a hover tooltip for every map-action icon on devices that support hovering.
- **FR-008**: Each map-action tooltip MUST show the corresponding action name.
- **FR-009**: The system MUST keep icon controls operable on touch-capable devices without relying on hover tooltips.
- **FR-010**: The system MUST visibly distinguish unavailable map actions from available actions and prevent unavailable actions from being performed.
- **FR-011**: The system MUST display the battle unit turn queue horizontally below the battle canvas while a battle is active.
- **FR-012**: The system MUST represent each unit in the battle queue using that unit's visual template when one is available.
- **FR-013**: The system MUST display a readable fallback representation for a queued unit whose dedicated visual template is unavailable.
- **FR-014**: The system MUST provide a hover tooltip for each battle-queue unit on devices that support hovering.
- **FR-015**: Each battle-queue tooltip MUST identify the unit represented by that queue entry.
- **FR-016**: The system MUST keep the battle queue synchronized with the current battle turn order, excluding units that are no longer eligible to take a turn.
- **FR-017**: The system MUST keep the map side bar and battle queue from obscuring their respective canvases or making required controls unreachable at supported viewport sizes.

### Key Entities *(include if feature involves data)*

- **Map Action Bar**: The compact vertical set of icons beside the map that exposes actions available for the current map scene.
- **Map Action Icon**: An icon control in the map action bar that invokes one named existing map action and may be available or unavailable based on game state.
- **Action Tooltip**: A temporary label shown on hover that names a map action.
- **Battle Turn Queue**: The ordered horizontal list below the battle canvas that represents units eligible to act in the battle turn sequence.
- **Queue Unit Representation**: The visual template or fallback visual used to represent one queued unit.
- **Unit Tooltip**: A temporary label shown on hover that identifies the unit represented by a battle-queue entry.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In supported phone-viewport acceptance testing, 100% of required map actions, including End Turn when available, can be reached and activated without document scrolling.
- **SC-002**: In map-action interaction testing, 100% of relocated actions produce the same game-state outcome as their pre-relocation controls.
- **SC-003**: In pointer interaction testing, 100% of map-action icons and battle-queue entries show a tooltip with the required action name or unit identification when hovered.
- **SC-004**: In battle display testing, 100% of active battles show the current turn queue horizontally below the battle canvas without covering the canvas.
- **SC-005**: In battle queue rendering checks, 100% of queued units with an available dedicated template use that template, and 100% of units without one show a readable fallback.
- **SC-006**: In usability testing on supported phone-sized and desktop viewports, at least 90% of players can end a map turn and identify the next queued battle unit without additional instruction.

## Assumptions

- The existing map actions, action availability rules, and turn progression rules remain unchanged; this feature relocates and condenses their controls.
- "Beside the map" means adjacent to the map play surface within the active game layout, with the exact side chosen to preserve readability and reachability in supported layouts.
- Iconography follows the project's existing visual language where suitable; distinct icons are used when no existing representation is available.
- Tooltips are provided for hover-capable devices as requested and are supplementary to touch interaction.
- The battle queue uses the same dedicated unit templates and fallback behavior defined by the unit-tile-template feature.
- The queue contains the units participating in the existing battle turn sequence and does not change battle order rules.

## Out of Scope

- Adding, removing, renaming, or changing the rules of map and battle actions.
- Changing battle initiative, turn-order calculation, targeting rules, or unit statistics.
- Creating a new final art set for unit templates beyond reuse of the existing template and fallback system.
- Adding tooltips triggered by touch, keyboard focus, or screen-reader-specific interaction beyond the requested hover behavior.
- Reworking the wider menu, victory, map navigation, or mobile gesture experience beyond layout changes necessary for the relocated controls and battle queue.
