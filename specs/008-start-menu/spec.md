# Feature Specification: Start Menu Scenario Selection

**Feature Branch**: `008-start-menu`

**Created**: 2026-07-15

**Status**: Draft

**Input**: User description: "create start menu for the game. The game should initially show the menu where user can select scenario he wants to play. After the scenario ends the user should have possiility to return to the main menu."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Choose A Scenario From The Main Menu (Priority: P1)

As a player, I can start at a main menu and choose which scenario to play so that I decide the game session before entering the map.

**Why this priority**: Scenario selection is the core value of the feature. Without it, the start menu does not serve its primary purpose and the game still behaves like a single-scenario bootstrap.

**Independent Test**: Open the game, confirm the first visible screen is the main menu, select each available scenario in turn, and verify the chosen scenario starts instead of loading a default scenario automatically.

**Acceptance Scenarios**:

1. **Given** the game is opened with no active session, **When** the application finishes loading, **Then** the player sees the main menu instead of entering a scenario immediately.
2. **Given** the main menu is visible, **When** the player selects an available scenario to start, **Then** the game begins that scenario and leaves the menu.
3. **Given** the main menu is visible, **When** multiple scenarios are available, **Then** each scenario is presented as a distinct selectable option with a clear label.

---

### User Story 2 - Return To The Main Menu After A Scenario Ends (Priority: P2)

As a player, I can return to the main menu after finishing a scenario so that I can start another run without reloading the page.

**Why this priority**: This keeps the full play loop self-contained, but it depends on the menu existing first, so it is less critical than initial scenario selection.

**Independent Test**: Complete a scenario until its end state is shown, use the return action, and verify the game returns to the main menu where another scenario can be selected and started successfully.

**Acceptance Scenarios**:

1. **Given** a scenario reaches its end state, **When** the end-of-scenario screen is shown, **Then** the player is offered a way to return to the main menu.
2. **Given** the player chooses to return to the main menu after a scenario ends, **When** the return action completes, **Then** the main menu is shown with scenario choices available again.
3. **Given** the player returns to the main menu after finishing one scenario, **When** they start a scenario again, **Then** the new session begins from that scenario's initial state.

### Edge Cases

- What happens if only one scenario is available? The main menu should still appear and allow the player to start that single scenario explicitly.
- What happens if the player opens the main menu after completing a scenario and starts the same scenario again? The scenario should start as a fresh run with no leftover state from the previous session.
- What happens if scenario metadata cannot be shown for one option? The scenario should still remain selectable with a fallback label rather than blocking access to the menu.
- What happens if the player reaches a non-victory scenario end state that still counts as completion? The same return-to-menu path should remain available.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST show a main menu as the initial screen when the game is opened with no active scenario session.
- **FR-002**: The system MUST list each available playable scenario as a separate option on the main menu.
- **FR-003**: The system MUST provide a clear label for each scenario option so the player can distinguish between available scenarios before starting one.
- **FR-004**: The system MUST start the selected scenario only after the player chooses an option from the main menu.
- **FR-005**: The system MUST initialize the selected scenario from its default starting state each time the player starts it from the main menu.
- **FR-006**: The system MUST transition away from the main menu once a scenario has been started.
- **FR-007**: The system MUST preserve the existing in-scenario gameplay flow after a scenario has been started from the main menu.
- **FR-008**: The system MUST recognize when a scenario session has ended and show an end-of-scenario state that includes a return-to-menu action.
- **FR-009**: The system MUST allow the player to return to the main menu from the end-of-scenario state without reloading the application.
- **FR-010**: The system MUST restore the main menu to its default state when the player returns there after a scenario ends.
- **FR-011**: The system MUST allow the player to start any available scenario again after returning to the main menu.
- **FR-012**: The system MUST ensure a newly started scenario does not reuse mutable gameplay state from a previously completed session.
- **FR-013**: The system MUST keep scenario selection unavailable while a scenario is actively in progress unless the player has returned to the main menu.

### Key Entities *(include if feature involves data)*

- **Main Menu**: The initial application state where the player can review and choose from available scenarios before gameplay begins.
- **Scenario Option**: A selectable menu entry representing one playable scenario and its display label.
- **Scenario Session**: A single playthrough instance that begins when a scenario is started and ends when that scenario reaches its completion state.
- **End-Of-Scenario State**: The completion view shown after a scenario finishes, including the action to return to the main menu.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of fresh application launches land on the main menu before any scenario begins.
- **SC-002**: In acceptance testing, 100% of available scenario options can be started from the main menu and open the correct scenario on the first attempt.
- **SC-003**: In replay testing, 100% of scenario restarts after returning to the main menu begin from a clean initial state.
- **SC-004**: In end-of-scenario testing, 100% of completed scenario runs present a visible return-to-menu action.
- **SC-005**: In usability testing, at least 90% of players can start a chosen scenario and return to the main menu after completion without needing external instructions.

## Assumptions

- The current set of playable scenarios is the same set already defined in the repository and can be exposed through the menu without introducing scenario authoring tools.
- A scenario's existing completion condition remains the source of truth for when the return-to-menu option becomes available.
- The first version of the main menu only needs to support starting scenarios and returning to it after scenario completion.
- Returning to the main menu discards the just-finished in-memory session rather than saving or resuming it later.
- Direct deep-linking into a scenario without using the menu is not required for this feature.

## Out of Scope

- Mid-scenario pausing, quitting, or saving back to the main menu before completion.
- Scenario progress persistence, save slots, or continue-game functionality.
- Editing, creating, reordering, or filtering scenarios from the menu.
- Multiplayer, profile-based unlocks, or per-player scenario availability rules.
- Post-scenario scoreboards, statistics summaries, or campaign progression systems.
