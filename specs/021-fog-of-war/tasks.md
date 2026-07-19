# Tasks: Configurable Fog of War

**Input**: Design documents from `/specs/021-fog-of-war/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/fog-of-war-ui.md](contracts/fog-of-war-ui.md), [quickstart.md](quickstart.md)

**Tests**: Automated contract, integration, and acceptance coverage is required for all behavior changes by the project constitution.

**Organization**: Tasks are grouped by user story so each fog-of-war slice is independently testable.

## Phase 1: Setup

**Purpose**: Add focused verification entry points for fog-of-war behavior.

- [X] T001 Add a focused fog-of-war validation script in `package.json`.
- [X] T002 [P] Confirm fog UI test identifiers in `specs/021-fog-of-war/contracts/fog-of-war-ui.md`.

---

## Phase 2: Foundational

**Purpose**: Establish shared fog settings, tile state, visibility calculation, and current-session exploration memory.

**CRITICAL**: Complete this phase before user-story work.

- [X] T003 Extend game, fog-settings, exploration-memory, and fog-tile-state definitions in `src/engine/scenario/types.ts`.
- [X] T004 Add validated fog enabled-state and visibility-radius defaults, load, save, and normalization behavior in `src/app/state/gameSettings.ts`.
- [X] T005 Implement bounded active-hero visibility, per-map visited-tile memory, and fog tile-state resolution in `src/engine/map/fogOfWar.ts`.
- [X] T006 Initialize, refresh, and retain current-session exploration memory across scenario starts, hero movement, active-map changes, and map returns in `src/app/state/gameState.ts` and `src/engine/map/heroActions.ts`.
- [X] T007 Add foundational visibility and exploration-memory coverage in `tests/integration/foundation/fogOfWarStateFlow.test.ts`.

**Checkpoint**: Shared fog state, settings, and map-memory seams are ready for rendering and controls.

---

## Phase 3: User Story 1 - Explore an Unseen Map (Priority: P1) MVP

**Goal**: Players see terrain but not concealed map content outside active hero vision, with a world-aligned unexplored fog layer.

**Independent Test**: Start a fog-enabled scenario, inspect tiles inside and outside current six-tile vision, and verify terrain remains visible while unexplored map content is hidden.

### Tests for User Story 1

- [X] T008 [P] [US1] Add fog tile-state and unexplored-content concealment contract coverage in `tests/contract/fog-of-war.contract.test.ts`.
- [X] T009 [P] [US1] Add map-render integration coverage for terrain-only unexplored tiles and viewport-aligned fog in `tests/integration/render/fogOfWarRenderFlow.test.ts`.
- [X] T010 [P] [US1] Add browser coverage for default six-tile visibility, terrain-only unexplored tiles, and pan/zoom alignment in `tests/acceptance/fog-of-war.spec.ts`.

### Implementation for User Story 1

- [X] T011 [US1] Render terrain before fog-sensitive map content and suppress unexplored objects, resources, guarded locations, and concealed units in `src/render/canvas/renderMapScene.ts`.
- [X] T012 [US1] Draw the 15%-opacity unexplored fog layer in world-tile coordinates below route and selection feedback in `src/render/canvas/renderMapScene.ts`.
- [X] T013 [US1] Expose active fog state without changing map input targeting or route behavior in `src/app/scene-controller/mapScene.ts` and `src/ui/hud/mapHud.ts`.

**Checkpoint**: Unexplored terrain is readable, concealed content is hidden, and current hero vision is fully visible.

---

## Phase 4: User Story 2 - Retain Explored-Area Memory (Priority: P1)

**Goal**: Previously visible tiles retain a distinct 50%-opacity visited-fog state across movement and map travel during the current scenario session.

**Independent Test**: Reveal a tile, move or travel until it leaves vision, then return and verify visited fog persists until the tile becomes currently visible again.

### Tests for User Story 2

- [X] T014 [P] [US2] Add contract coverage for fully-visible, visited-fog, and unexplored-fog transitions in `tests/contract/fog-of-war.contract.test.ts`.
- [X] T015 [P] [US2] Add integration coverage for movement-driven memory, overlapping hero vision, and map-travel return memory in `tests/integration/map/fogOfWarMemoryFlow.test.ts`.
- [X] T016 [P] [US2] Add browser coverage for visited-fog opacity and restoring full visibility on revisit in `tests/acceptance/fog-of-war.spec.ts`.

### Implementation for User Story 2

- [X] T017 [US2] Merge current hero visibility into per-map exploration memory after map state changes in `src/app/state/gameState.ts` and `src/engine/map/heroActions.ts`.
- [X] T018 [US2] Render 50%-opacity visited fog and restore map content when a tile is currently visible in `src/render/canvas/renderMapScene.ts`.
- [X] T019 [US2] Preserve map-specific exploration memory through linked-map transitions in `src/app/state/gameState.ts`.

**Checkpoint**: Current session exploration is remembered per map and visually distinguishes visited tiles from never-seen tiles.

---

## Phase 5: User Story 3 - Control Fog Visibility (Priority: P2)

**Goal**: Players can select a visibility radius or disable fog without changing map rules or resetting the active scenario.

**Independent Test**: Change the radius, verify the visibility boundary changes, disable fog, and confirm that all normal map content is visible with no overlay.

### Tests for User Story 3

- [X] T020 [P] [US3] Add fog-setting defaults, validation, and enabled/disabled contract coverage in `tests/contract/fog-of-war.contract.test.ts`.
- [X] T021 [P] [US3] Add settings persistence and live visibility-radius integration coverage in `tests/integration/foundation/fogOfWarSettingsFlow.test.ts`.
- [X] T022 [P] [US3] Add browser coverage for changing radius, disabling fog, and restoring fog in `tests/acceptance/fog-of-war.spec.ts`.

### Implementation for User Story 3

- [X] T023 [US3] Add fog enabled-state and visibility-radius update actions that preserve active scenario and exploration memory in `src/app/state/gameState.ts` and `src/app/state/gameSettings.ts`.
- [X] T024 [US3] Add fog enabled-state and visibility-radius controls to the existing settings page in `src/ui/overlays/settingsPanel.ts`.
- [X] T025 [US3] Bind fog settings controls and refresh map presentation without resetting gameplay in `src/app/bootstrap/startGame.ts`.
- [X] T026 [US3] Bypass fog presentation while disabled but retain current-session exploration memory in `src/render/canvas/renderMapScene.ts`.

**Checkpoint**: Fog defaults to six-tile enabled visibility, can be reconfigured or disabled, and does not affect gameplay rules.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Demonstrate fog compatibility with existing map behavior and keep artifacts aligned.

- [X] T027 [P] Run fog, viewport, and route regression coverage through `package.json` commands and `tests/acceptance/fog-of-war.spec.ts`.
- [X] T028 [P] Run the end-to-end fog validation scenarios and record results in `specs/021-fog-of-war/quickstart.md`.
- [X] T029 Verify [spec.md](spec.md), [plan.md](plan.md), [data-model.md](data-model.md), [contracts/fog-of-war-ui.md](contracts/fog-of-war-ui.md), and `tasks.md` remain aligned in `specs/021-fog-of-war/tasks.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on setup and blocks all user stories.
- **US1 (Phase 3)**: Depends on foundational fog state and delivers the MVP.
- **US2 (Phase 4)**: Depends on foundational state and extends US1 rendering with exploration memory.
- **US3 (Phase 5)**: Depends on foundational state and uses US1/US2 fog presentation.
- **Polish (Phase 6)**: Depends on selected user-story phases.

### User Story Dependencies

```text
Foundational fog state
    └── US1: unexplored terrain-only fog (MVP)
          └── US2: visited-fog memory
                └── US3: configurable and disabled fog
```

### Parallel Opportunities

- T008–T010 can be authored in parallel because they target contract, integration, and browser layers.
- T014–T016 can be authored in parallel after foundational fog state exists.
- T020–T022 can be authored in parallel after the settings contract is established.
- T027 and T028 can run in parallel after all feature work is complete.

## Parallel Example: User Story 1

```text
Task: "Add fog contract coverage in tests/contract/fog-of-war.contract.test.ts"
Task: "Add fog rendering integration coverage in tests/integration/render/fogOfWarRenderFlow.test.ts"
Task: "Add fog browser coverage in tests/acceptance/fog-of-war.spec.ts"
```

## Implementation Strategy

### MVP First

1. Complete setup and foundational fog state.
2. Finish US1 (T008–T013).
3. Validate six-tile visibility and terrain-only unexplored fog independently.

### Incremental Delivery

1. Add US1 to provide visible exploration without changing map rules.
2. Add US2 to retain and display visited-area memory across map travel.
3. Add US3 to expose fog controls and disabled rendering.
4. Finish with viewport and route compatibility validation.

## Notes

- Every task follows the required checkbox, ID, optional parallel marker, story label, and explicit-path format.
- Tests are feature-proving and should pass before marking the corresponding story complete.
