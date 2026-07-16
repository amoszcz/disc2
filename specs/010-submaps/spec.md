# Feature Specification: Submap Transitions

**Feature Branch**: `010-submaps`

**Created**: 2026-07-16

**Status**: Draft

**Input**: User description: "create submaps. these are maps that are entered due to some event like reaching a cave tile which is enterable or teleports or some other events. the submaps must may have exit points that will transport user to the main map."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enter A Submap From The Main Map (Priority: P1)

As a player, I can trigger entry into a submap from a reachable map event such as an enterable cave or teleport so that the world can contain explorable spaces beyond the main map.

**Why this priority**: Entering a submap is the core value of the feature. Without a reliable transition into a secondary map, the rest of the system has no user-facing effect.

**Independent Test**: Start a scenario containing an enterable submap trigger, move onto or activate it, and verify the game transitions into the linked submap while preserving the session and current rules.

**Acceptance Scenarios**:

1. **Given** a scenario contains a submap entry trigger on the main map, **When** the player reaches or activates that trigger, **Then** the game transitions from the main map into the linked submap.
2. **Given** the player enters a submap from the main map, **When** the submap loads, **Then** the player appears at the correct arrival position and can continue normal play there.
3. **Given** the player enters a submap, **When** the transition completes, **Then** the rest of the current session state remains intact apart from the intentional map-location change.

---

### User Story 2 - Return From A Submap Through Exit Points (Priority: P1)

As a player, I can leave a submap through defined exit points so that submaps function as connected spaces instead of one-way traps.

**Why this priority**: A submap system is not viable if players can enter but cannot return through designed exits.

**Independent Test**: Enter a submap, move to one of its exit points, activate the exit, and verify the player returns to the linked position on the parent map with the session still playable.

**Acceptance Scenarios**:

1. **Given** a submap contains a defined exit point, **When** the player reaches or activates that exit, **Then** the game returns the player to the linked destination on the parent map.
2. **Given** the player returns from a submap to the main map, **When** the transition completes, **Then** the player appears at the intended return position and can continue normal map play.
3. **Given** a submap has more than one exit point, **When** the player uses a specific exit, **Then** the game returns the player to the destination linked to that exit rather than a generic fallback location.

---

### User Story 3 - Preserve World Context Across Nested Map Transitions (Priority: P2)

As a player, I can move between connected maps without losing world context so that submaps feel like part of one continuous scenario instead of isolated resets.

**Why this priority**: Once entry and exit work, continuity determines whether the feature is trustworthy in longer scenarios with multiple linked locations.

**Independent Test**: Enter and exit linked maps during one scenario session, then verify player progress, map-specific state, and transition destinations remain consistent across repeated travel.

**Acceptance Scenarios**:

1. **Given** the player has already entered or exited a linked map during the current session, **When** they travel between connected maps again, **Then** the transition still resolves to the correct linked destinations.
2. **Given** the player has changed the state of a connected map area during the session, **When** they leave and later return, **Then** previously changed state remains consistent with the current session.
3. **Given** a scenario uses different kinds of map-entry events such as caves and teleports, **When** the player uses them, **Then** each event follows the same consistent transition rules for linked-map travel.

### Edge Cases

- What happens when a player reaches a tile that looks special but is not a valid submap trigger? The game should keep the player on the current map and present normal interaction feedback.
- What happens when a linked submap entry or exit is missing or invalid in scenario data? The transition should fail safely without corrupting the session.
- What happens when the player reuses the same cave, teleport, or exit point multiple times in one session? The linked destinations and session state should remain consistent across repeated travel.
- What happens when a submap contains more than one exit point or more than one arrival source? Each transition should respect its specific link instead of using a shared generic return point.
- What happens when the player is in combat, victory flow, or another non-map scene when a transition would otherwise occur? The system should only allow linked-map travel when the current scene supports map movement and interaction.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a scenario to define one or more submaps linked to the main map.
- **FR-002**: The system MUST allow a scenario to define entry triggers that transport the player from one map to another during an active session.
- **FR-003**: The system MUST support at least cave-style entry points, teleport-style entry points, and the same shared transition rules for other scenario-defined trigger events.
- **FR-004**: The system MUST place the player at the configured arrival location when entering a linked submap.
- **FR-005**: The system MUST allow a submap to define one or more exit points that transport the player back to a linked map location.
- **FR-006**: The system MUST place the player at the configured destination location when leaving a submap through a defined exit point.
- **FR-007**: The system MUST preserve the active scenario session across linked-map transitions instead of starting a new scenario or clearing unrelated progress.
- **FR-008**: The system MUST keep map-specific progress consistent when the player leaves and later re-enters the same linked map during one session.
- **FR-009**: The system MUST prevent invalid or incomplete linked-map transitions from corrupting the current session state.
- **FR-010**: The system MUST apply the same movement, interaction, and victory rules on submaps unless a scenario explicitly defines a different linked-map trigger or destination.
- **FR-011**: The system MUST allow multiple entry and exit links within the same scenario.
- **FR-012**: The system MUST make linked-map travel understandable enough that players can tell when an interaction has moved them into or out of a submap.

### Key Entities *(include if feature involves data)*

- **World Map**: A playable map space within a scenario, including the main map and any linked submaps.
- **Submap Link**: A defined connection between a source trigger on one map and a destination position on another map.
- **Entry Trigger**: A player-reachable event such as a cave tile, teleport tile, or other scenario-defined trigger that initiates travel into a linked map.
- **Exit Point**: A player-reachable location inside a submap that returns the player to a linked destination on another map.
- **Map Travel State**: The current session context that records which map the player is in and preserves linked-map continuity across transitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In scenario acceptance testing, 100% of configured linked-map entry triggers transition the player into the intended submap without reloading or restarting the session.
- **SC-002**: In scenario acceptance testing, 100% of configured submap exit points return the player to the intended linked destination on the parent map.
- **SC-003**: In repeated-travel testing, 100% of tested re-entry and exit cycles preserve current session continuity and map-specific progress.
- **SC-004**: In invalid-link handling tests, 100% of broken or incomplete transition definitions fail safely without leaving the session in an unusable state.
- **SC-005**: In usability testing, at least 90% of players can recognize when they have entered or exited a linked map and continue normal play without external instructions.

## Assumptions

- Submaps are part of the same scenario session rather than separate scenario loads.
- Linked-map travel is primarily initiated from map scenes, not from battle or victory scenes.
- Existing movement, combat, and victory rules remain in place unless a later feature explicitly extends them for linked maps.
- Scenario authors will define the links, trigger locations, and return destinations as part of scenario data.
- The first slice supports connected submaps within one scenario and does not require procedural generation or arbitrary deep nesting.

## Out of Scope

- Procedural generation of submaps or randomized caves.
- Separate save/load UX for linked maps beyond the current scenario session model.
- A general event-scripting system for every possible trigger type outside the linked-map travel rules needed for this feature.
- Multiplayer synchronization or cross-session travel between different scenarios.
- Visual effects, cutscenes, or narrative scripting beyond the transitions needed to move between linked maps.
