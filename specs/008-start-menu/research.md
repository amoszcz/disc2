# Research: Start Menu Scenario Selection

## Decision 1: Introduce a dedicated main-menu scene before any scenario state is created

- **Decision**: Add a new top-level scene for the main menu instead of auto-creating a scenario session on application load.
- **Rationale**: The current bootstrap creates a scenario immediately. A dedicated menu scene cleanly satisfies the requirement that the game initially shows scenario choice before gameplay begins.
- **Alternatives considered**:
  - Keep auto-start and overlay menu controls on top: rejected because it still initializes a session before the player chooses one.
  - Use query parameters as the only scenario-selection mechanism: rejected because the feature explicitly requires an initial menu screen.

## Decision 2: Represent available scenarios as a small catalog with IDs and display labels

- **Decision**: Centralize playable scenario metadata in one catalog used by both menu rendering and scenario loading.
- **Rationale**: The game already has multiple scenario definitions, but the current bootstrap only hardcodes selection through URL parsing. A shared catalog avoids duplicating labels and IDs across bootstrap, UI, and tests.
- **Alternatives considered**:
  - Hardcode menu options directly in markup: rejected because it scatters scenario definitions across unrelated files.
  - Discover scenarios dynamically from the filesystem at runtime: rejected because the app is a browser bundle with static source imports.

## Decision 3: Start each scenario by building a fresh initial game state from the selected scenario ID

- **Decision**: Reuse the existing state-construction path for each scenario start so every menu launch creates a new in-memory session.
- **Rationale**: The spec requires clean restarts with no leftover mutable state. Rebuilding from the source scenario definition is the simplest way to guarantee that.
- **Alternatives considered**:
  - Mutate the existing state tree back to defaults: rejected because it is easier to miss stale derived state.
  - Cache previously created sessions: rejected because session persistence and resume are out of scope.

## Decision 4: Keep scenario completion in the existing victory scene, but add a return-to-menu action there

- **Decision**: Extend the current end-of-scenario screen with a main-menu action rather than inventing a second completion scene.
- **Rationale**: The repository already routes completed scenarios to `sceneMode = "victory"`. Reusing that completion state minimizes churn while still enabling return to the menu.
- **Alternatives considered**:
  - Route completed sessions directly to the main menu with no completion state: rejected because the spec requires the end-of-scenario state to offer the return action.
  - Add a separate post-game scene type distinct from victory: rejected because it broadens the scene model without adding clear value in this slice.

## Decision 5: Treat return-to-menu as session disposal, not pause or save

- **Decision**: Returning to the main menu clears the active scenario session and restores the default menu state.
- **Rationale**: The feature only requires replaying or choosing another scenario after completion. Session persistence would add scope and data-management complexity that the spec excludes.
- **Alternatives considered**:
  - Keep the finished scenario session mounted behind the menu: rejected because it risks stale state leaking into the next run.
  - Support resume/continue from the menu: rejected because it is explicitly out of scope.

## Decision 6: Prove the feature primarily through UI contracts, state-transition integration tests, and acceptance flows

- **Decision**: Add browser-facing tests for menu visibility, scenario selection, clean replay, and return-to-menu, backed by integration coverage for scene and state transitions.
- **Rationale**: This feature is almost entirely about user-visible application flow, so behavior-level tests are the strongest evidence.
- **Alternatives considered**:
  - Rely only on low-level state helpers: rejected because that would miss broken DOM wiring and scene transitions.
  - Test only through Playwright: rejected because integration tests provide faster feedback on session-reset logic and scene mode changes.
