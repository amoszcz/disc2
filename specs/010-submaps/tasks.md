# Tasks: Submap Transitions

**Input**: Design documents from `/specs/010-submaps/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract, integration, and acceptance coverage for each behavior-changing linked-map travel story.

**Organization**: Tasks are grouped by user story so linked-map entry, exit, and continuity behavior can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel with other `[P]` tasks in the same phase
- **[Story]**: Maps work to a specific user story from `spec.md`
- Every task includes the primary file path to change

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-specific verification entry points and active feature documentation

- [X] T001 Add submap-focused verification scripts in `package.json`
- [X] T002 Align linked-map validation steps in `specs/010-submaps/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared linked-map data, active-map state, and rendering seams required by all stories

**CRITICAL**: No user story work should begin before this phase is complete

- [X] T003 Extend scenario, world-map, link, and travel-state types in `src/engine/scenario/types.ts`
- [X] T004 [P] Refactor scenario loading to accept linked-map definitions in `src/engine/scenario/loadScenario.ts`
- [X] T005 [P] Extend session state to track the active world map and travel context in `src/app/state/gameState.ts`
- [X] T006 [P] Update map rendering to read from the active world map instead of assuming a single scenario map in `src/render/canvas/renderMapScene.ts`
- [X] T007 Add foundational linked-map state coverage in `tests/integration/foundation/gameStateFlow.test.ts`

**Checkpoint**: Shared linked-map state and active-map rendering seams are ready for travel behavior

---

## Phase 3: User Story 1 - Enter A Submap From The Main Map (Priority: P1) MVP

**Goal**: Let players enter a linked submap from a valid main-map trigger such as a cave or teleport

**Independent Test**: Start a scenario containing an enterable linked-map trigger, activate it, and verify the game transitions into the intended submap while preserving the scenario session

### Tests for User Story 1

- [X] T008 [P] [US1] Add linked-map data contract coverage for entry triggers in `tests/contract/scenario-session-state.contract.test.ts`
- [X] T009 [P] [US1] Add integration coverage for entering a linked submap from the main map in `tests/integration/map/mapTurnFlow.test.ts`
- [X] T010 [P] [US1] Add browser coverage for cave-or-teleport entry travel in `tests/acceptance/map-view-interaction.spec.ts`

### Implementation for User Story 1

- [X] T011 [P] [US1] Add linked submap definitions and entry triggers to a scenario fixture in `src/content/scenarios/advanced-terrain-scenario.ts`
- [X] T012 [P] [US1] Resolve linked-map entry triggers during hero movement and interaction in `src/engine/map/heroActions.ts`
- [X] T013 [P] [US1] Switch the active world map and arrival position on entry travel in `src/app/state/gameState.ts`
- [X] T014 [US1] Surface linked-map entry feedback in the map HUD and error overlay in `src/ui/hud/mapHud.ts`

**Checkpoint**: User Story 1 is independently demonstrable as entry into a linked submap from the main map

---

## Phase 4: User Story 2 - Return From A Submap Through Exit Points (Priority: P1)

**Goal**: Let players leave a submap through defined exits and return to the linked destination on the parent map

**Independent Test**: Enter a submap, activate a defined exit point, and verify the player returns to the intended linked destination while the session remains playable

### Tests for User Story 2

- [X] T015 [P] [US2] Add linked-map contract coverage for specific exit destinations in `tests/contract/scenario-session-state.contract.test.ts`
- [X] T016 [P] [US2] Add integration coverage for returning from a submap through an exit point in `tests/integration/map/routeCommitFlow.test.ts`
- [X] T017 [P] [US2] Add browser coverage for leaving a submap and resuming parent-map play in `tests/acceptance/route-confirmation.spec.ts`

### Implementation for User Story 2

- [X] T018 [P] [US2] Add submap exit-point definitions to scenario content in `src/content/scenarios/advanced-terrain-scenario.ts`
- [X] T019 [P] [US2] Resolve linked-map exit travel from active submap positions in `src/engine/map/heroActions.ts`
- [X] T020 [P] [US2] Preserve return destinations and parent-map placement in session travel state in `src/app/state/gameState.ts`
- [X] T021 [US2] Update map scene messaging for exit-based return travel in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 2 is independently demonstrable as returning from a linked submap through specific exits

---

## Phase 5: User Story 3 - Preserve World Context Across Nested Map Transitions (Priority: P2)

**Goal**: Keep linked-map travel consistent across repeated entry and exit cycles without losing scenario progress

**Independent Test**: Travel between linked maps multiple times in one scenario session and verify map-specific progress, destinations, and active play state remain consistent

### Tests for User Story 3

- [X] T022 [P] [US3] Add continuity contract coverage for repeated linked-map travel in `tests/contract/scenario-session-state.contract.test.ts`
- [X] T023 [P] [US3] Add integration coverage for repeated submap travel and preserved state in `tests/integration/foundation/routePreviewStateFlow.test.ts`
- [X] T024 [P] [US3] Add browser coverage for repeated travel and safe invalid-link handling in `tests/acceptance/route-persistence.spec.ts`

### Implementation for User Story 3

- [X] T025 [P] [US3] Preserve map-specific progress across active-map switches in `src/app/state/gameState.ts`
- [X] T026 [P] [US3] Guard against invalid or unavailable travel links before state mutation in `src/engine/map/routeRules.ts`
- [X] T027 [P] [US3] Keep rendering and viewport context aligned after repeated map transitions in `src/render/canvas/viewportRender.ts`
- [X] T028 [US3] Extend scenario travel feedback for invalid-link and repeated-travel cases in `src/ui/overlays/errorOverlay.ts`

**Checkpoint**: User Stories 1, 2, and 3 together provide complete linked-map travel inside one scenario session

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish cross-artifact alignment, scenario-level UX wording, and linked-map verification coverage

- [X] T029 [P] Update linked-map data expectations in `specs/010-submaps/contracts/linked-map-data.md`
- [X] T030 [P] Update travel UX wording and validation notes in `specs/010-submaps/contracts/map-travel-ux.md`
- [X] T031 Add scenario-travel helper utilities for acceptance flows in `tests/acceptance/mobileTestUtils.ts`
- [X] T032 Run linked-map verification commands documented in `specs/010-submaps/quickstart.md`
- [X] T033 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, `quickstart.md`, and `tasks.md` remain aligned in `specs/010-submaps/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all user story work
- **Phase 3: US1**: Depends on Phase 2 and delivers the MVP
- **Phase 4: US2**: Depends on Phase 2 and builds on the shared linked-map state plus US1 entry behavior
- **Phase 5: US3**: Depends on Phase 2 and benefits from US1/US2 travel behavior, though continuity validation can begin once the core travel seams exist
- **Phase 6: Polish**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after foundational work
- **US2**: Depends on the active-map and linked-map seams from Phase 2 and on entry behavior being available to reach submaps
- **US3**: Depends on the linked-map travel flow from US1 and US2 so continuity can be validated across repeated travel

### Within Each User Story

- Add behavior-level tests before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Complete shared linked-map data and active-map seams before wiring scene-specific travel messaging
- Validate each story against its independent test before moving forward

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each story marked `[P]` can run in parallel
- Scenario-content, state, and UI tasks marked `[P]` can run in parallel once the shared seams exist

---

## Parallel Example: User Story 1

```text
T008 Add linked-map data contract coverage for entry triggers in tests/contract/scenario-session-state.contract.test.ts
T009 Add integration coverage for entering a linked submap from the main map in tests/integration/map/mapTurnFlow.test.ts
T010 Add browser coverage for cave-or-teleport entry travel in tests/acceptance/map-view-interaction.spec.ts

T011 Add linked submap definitions and entry triggers to a scenario fixture in src/content/scenarios/advanced-terrain-scenario.ts
T012 Resolve linked-map entry triggers during hero movement and interaction in src/engine/map/heroActions.ts
T013 Switch the active world map and arrival position on entry travel in src/app/state/gameState.ts
```

---

## Parallel Example: User Story 2

```text
T015 Add linked-map contract coverage for specific exit destinations in tests/contract/scenario-session-state.contract.test.ts
T016 Add integration coverage for returning from a submap through an exit point in tests/integration/map/routeCommitFlow.test.ts
T017 Add browser coverage for leaving a submap and resuming parent-map play in tests/acceptance/route-confirmation.spec.ts

T018 Add submap exit-point definitions to scenario content in src/content/scenarios/advanced-terrain-scenario.ts
T019 Resolve linked-map exit travel from active submap positions in src/engine/map/heroActions.ts
T020 Preserve return destinations and parent-map placement in session travel state in src/app/state/gameState.ts
```

---

## Parallel Example: User Story 3

```text
T022 Add continuity contract coverage for repeated linked-map travel in tests/contract/scenario-session-state.contract.test.ts
T023 Add integration coverage for repeated submap travel and preserved state in tests/integration/foundation/routePreviewStateFlow.test.ts
T024 Add browser coverage for repeated travel and safe invalid-link handling in tests/acceptance/route-persistence.spec.ts

T025 Preserve map-specific progress across active-map switches in src/app/state/gameState.ts
T026 Guard against invalid or unavailable travel links before state mutation in src/engine/map/routeRules.ts
T027 Keep rendering and viewport context aligned after repeated map transitions in src/render/canvas/viewportRender.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate linked-map entry independently

### Incremental Delivery

1. Build shared linked-map data, active-map state, and rendering seams
2. Deliver US1 linked submap entry as the MVP
3. Deliver US2 explicit exit-point return travel
4. Deliver US3 repeated-travel continuity and invalid-link safety
5. Finish with cross-cutting validation and artifact alignment

### Parallel Team Strategy

1. One developer prepares scenario-data and active-map state seams
2. Another developer can prepare behavior-level validation once the contracts are stable
3. After the foundational phase:
   - Developer A: US1 submap entry flow
   - Developer B: US2 submap exit flow
   - Developer C: US3 continuity and failure-handling behavior

---

## Notes

- `[P]` tasks are candidates for parallel execution because they target separate seams or files
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the submap-transition feature spec
- This slice intentionally does not introduce procedural generation, general event scripting, or cross-scenario travel
