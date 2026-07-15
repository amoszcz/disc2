# Data Model: Start Menu Scenario Selection

## Main Menu State

- **Purpose**: Represents the application state before a scenario session starts.
- **Fields**:
  - `sceneMode`
  - `availableScenarioOptions`
  - `selectedScenarioId`
- **Relationships**:
  - Owns zero active scenario sessions.
  - References many scenario options.
- **Validation Rules**:
  - `sceneMode` must identify the main menu when no scenario session is active.
  - `selectedScenarioId` may be empty before the player chooses a scenario.
  - Every listed scenario option must map to a loadable scenario definition.

## Scenario Option

- **Purpose**: Represents one playable scenario choice in the main menu.
- **Fields**:
  - `id`
  - `label`
  - `description`
- **Relationships**:
  - Belongs to the scenario catalog.
  - Can start many scenario sessions across repeated plays.
- **Validation Rules**:
  - `id` must uniquely identify one scenario definition.
  - `label` must be present and player-readable.
  - `description` may be optional but must fall back cleanly when absent.

## Scenario Catalog

- **Purpose**: Defines the full set of scenarios available to launch from the menu.
- **Fields**:
  - `options`
  - `defaultScenarioId`
- **Relationships**:
  - Contains many scenario options.
  - Feeds both menu rendering and scenario-session creation.
- **Validation Rules**:
  - `options` must contain at least one playable scenario.
  - `defaultScenarioId`, if used internally, must reference one of the listed options.
  - Catalog order should remain stable for predictable menu presentation and tests.

## Scenario Session

- **Purpose**: Represents one in-memory run of a selected scenario after the player leaves the main menu.
- **Fields**:
  - `scenarioId`
  - `scenario`
  - `activePlayerId`
  - `selectedHeroId`
  - `sceneMode`
  - `messageLog`
  - `winnerPlayerId`
- **Relationships**:
  - Is created from one scenario option.
  - Contains current gameplay state for map, battle, and victory scenes.
- **Validation Rules**:
  - Each start action must create a fresh scenario session from source definitions.
  - A session must not retain mutable state from a previous completed run.
  - Once active, the session owns all current gameplay scenes until completion or disposal.

## End-Of-Scenario State

- **Purpose**: Represents the completion view shown after a scenario reaches its terminal condition.
- **Fields**:
  - `sceneMode`
  - `winnerPlayerId`
  - `returnActionAvailable`
- **Relationships**:
  - Belongs to one completed scenario session.
  - Can transition back to the main menu state.
- **Validation Rules**:
  - The return-to-menu action must be visible whenever the scenario is complete.
  - Returning to the menu must clear the completed session from active gameplay state.

## State Transitions

### Application Launch

1. The application loads with no active scenario session.
2. The scenario catalog is read.
3. The main menu scene is rendered with scenario options.

### Start Scenario

1. The player selects a scenario option from the menu.
2. A fresh scenario session is created from that scenario ID.
3. The application leaves the main menu and enters the scenario's starting gameplay scene.

### Scenario Completion

1. The active scenario meets its existing victory or completion condition.
2. The active session switches to the end-of-scenario state.
3. The completion view exposes a return-to-menu action.

### Return To Menu

1. The player chooses the return-to-menu action from the completion view.
2. The active scenario session is discarded.
3. The application returns to the main menu with scenario options ready for a new selection.

### Replay Or Start Another Scenario

1. The player chooses any scenario from the menu after returning.
2. A new scenario session is created.
3. The application starts that scenario from its default initial state.
