# Feature Specification: Strategy UX Clarity

**Feature Branch**: `023-strategy-ux`

**Created**: 2026-07-21

**Status**: Draft

**Input**: User description: "Update the UI to adhere to the UX patterns in the constitution."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Understand a Planned Map Action Before Committing (Priority: P1)

As a player, I can see which hero and destination are selected, what moving there will cost or trigger, and whether the action can still be changed before I commit it.

**Why this priority**: Map movement is the core strategy loop. Players need confidence that a planned route represents their intended action before it changes the game state.

**Independent Test**: Select a hero and destination through desktop and touch-capable controls; verify the selected state, route consequences, confirmation state, and cancellation or replacement path are all visible and usable.

**Acceptance Scenarios**:

1. **Given** an active map turn, **When** a player selects a hero and a valid destination, **Then** the UI shows the selected hero, destination, route cost, remaining movement, and any known terrain, object, encounter, or map-transition consequence before movement is committed.
2. **Given** a route is planned but not committed, **When** the player selects another valid destination or cancels the plan, **Then** the prior plan is replaced or cleared without consuming movement or ending the turn.
3. **Given** a destination cannot be reached or cannot be selected, **When** the player attempts to choose it, **Then** the UI explains the relevant reason near the map interaction or control context.

---

### User Story 2 - Understand Battle and Turn Availability (Priority: P2)

As a player, I can immediately tell which battle or turn action is available, why an unavailable action cannot be used, and what a consequential action will do before I activate it.

**Why this priority**: Combat and ending a turn can materially change the game state; unexplained disabled controls force players to infer rules instead of making deliberate choices.

**Independent Test**: Exercise strike, defend, and end-turn states with legal and illegal conditions; verify that availability, reason text, and action consequences are visible on desktop and mobile layouts.

**Acceptance Scenarios**:

1. **Given** a battle action is unavailable because the player lacks a legal target, is not the active side, or a transition is in progress, **When** the battle UI is shown, **Then** the player sees the action's unavailable state and a specific reason.
2. **Given** a battle action is available, **When** the player selects its required target or state, **Then** the UI clearly identifies the selected target and the action that will be performed before the player commits it.
3. **Given** ending a turn has a known pending route, encounter, or turn-change consequence, **When** the player is about to end the turn, **Then** the UI presents that consequence and makes the consequential action visually distinct.

---

### User Story 3 - Use Consistent Direct Controls on Any Supported Device (Priority: P3)

As a player, I can perform core map, battle, menu, and settings actions through direct, accessible controls whose placement and feedback remain predictable across desktop and mobile layouts.

**Why this priority**: Consistency reduces accidental actions and makes the game approachable on both mouse/keyboard and touch devices.

**Independent Test**: Complete representative menu, map, battle, and settings actions using mouse/keyboard and touch-capable viewport flows; verify essential labels, focus, press feedback, and placement are usable without hover.

**Acceptance Scenarios**:

1. **Given** a player moves between menu, map, battle, settings, and victory surfaces, **When** an action is available, **Then** its label or accessible name, feedback, and placement are consistent with the action's importance and prior use.
2. **Given** a keyboard or touch-only player uses an enabled control, **When** they focus or press it, **Then** the control gives clear feedback without relying on pointer hover.
3. **Given** an action cannot be used, **When** a keyboard or touch-only player encounters it, **Then** its unavailable reason is available without requiring hover.

### Edge Cases

- A planned route becomes invalid because the game state changes before commitment; the UI must clear or update the plan and explain the change without consuming movement.
- More than one map consequence applies to a planned route; the preview must present all known consequences without obscuring the primary action.
- A player tries to strike without a selected legal target or during a battle transition; the reason must identify the blocking condition rather than only showing a disabled button.
- A player ends a turn while a route is pending, traversing, or about to trigger a known encounter; the UI must distinguish these outcomes and prevent accidental commitment where appropriate.
- A narrow mobile viewport, keyboard focus, or touch-only interaction must not hide essential selection, availability, or recovery feedback.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST display the currently selected hero, target, or destination in every map and battle decision state where player input is required.
- **FR-002**: Before movement, battle, turn-ending, or other consequential action is committed, the system MUST display the action's known cost, effect, trigger, or state change relevant to the player decision.
- **FR-003**: The system MUST let players replace or cancel an uncommitted map route, target selection, or other reversible planned action without consuming resources or changing the turn.
- **FR-004**: When a player action is unavailable, the system MUST present a specific reason in the relevant interaction context; a disabled appearance alone is insufficient.
- **FR-005**: The system MUST make consequential actions, including ending a turn and committing an action with known route or encounter effects, visibly distinct and present their known outcome before activation.
- **FR-006**: Core menu, map, battle, settings, and victory actions MUST provide essential labels, states, and feedback through mouse, keyboard, and touch-capable input without requiring hover.
- **FR-007**: The system MUST preserve predictable placement and visual hierarchy for primary actions within each game surface and across supported responsive layouts.
- **FR-008**: The system MUST update or clear stale previews, selections, and unavailable-action explanations when the underlying game state changes.

### Key Entities

- **Decision preview**: The visible, pre-commit summary of a proposed map, battle, or turn action, including the selected subject, known consequences, and commitment status.
- **Action availability explanation**: A concise player-facing reason that explains why a currently unavailable action cannot proceed and what condition would make it available.
- **Recovery path**: The player-visible way to cancel, replace, or safely exit an uncommitted decision without unintended game-state change.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In automated desktop and touch-capable flows, 100% of core map, battle, and turn-ending actions expose the current selection and known consequence before commitment.
- **SC-002**: In automated coverage, 100% of tested unavailable map, battle, and turn actions expose a specific player-facing explanation rather than only an unavailable visual state.
- **SC-003**: Players can cancel or replace 100% of tested reversible map and battle plans without losing movement, resources, or their turn.
- **SC-004**: A keyboard-only and touch-capable player can complete the core menu-to-map, map-action, and battle-action flows without requiring hover-only information.
- **SC-005**: On supported desktop and mobile layouts, primary action controls remain visible, named, and operable without horizontal scrolling or overlapping the active game surface.

## Assumptions

- Existing game rules, movement costs, battle resolution, and turn order remain unchanged; this feature improves how those rules and consequences are communicated.
- Known consequences are limited to information already available to the game at the time of player decision; the feature does not reveal hidden map or enemy information.
- Normal end-turn flow may remain a one-step action when no exceptional irreversible loss is known, provided its consequence is clear and the action is visually distinguished.
- Existing shared button feedback is reused as a baseline, while decision-specific explanations remain in the relevant map or battle context.
- Both desktop and touch-capable mobile layouts remain supported.

## Out of Scope

- Changing combat, movement, pathfinding, fog-of-war, resource, or turn rules.
- Adding undo for actions that are already committed and resolved.
- Revealing hidden units, map content, or outcomes not known at decision time.
- Redesigning non-interactive visual art, narrative content, or scenario objectives.
