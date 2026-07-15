# Tasks: Start Menu Scenario Selection

**Input**: Design documents from `/specs/008-start-menu/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract, integration, and acceptance coverage for each behavior-changing menu and session-flow story.

**Organization**: Tasks are grouped by user story so each start-menu slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel with other `[P]` tasks in the same phase
- **[Story]**: Maps work to a specific user story from `spec.md`
- Every task includes the primary file path to change

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare menu-focused verification entry points and align active feature documentation

- [ ] T001 Add start-menu-focused verification scripts in `package.json`
- [ ] T002 Align menu feature execution notes in `specs/008-start-menu/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared scene, scenario-catalog, and session-reset seams required by all stories

**CRITICAL**: No user story work should begin before this phase is complete

- [ ] T003 Extend scene-mode, menu-state, and scenario-option types in `src/engine/scenario/types.ts`
- [ ] T004 [P] Centralize available scenario catalog metadata in `src/engine/scenario/loadScenario.ts`
- [ ] T005 [P] Refactor initial-state creation into reusable scenario-session start/reset helpers in `src/app/state/gameState.ts`
- [ ] T006 [P] Extend the root scene controller to support a main-menu scene in `src/app/scene-controller/sceneController.ts`
- [ ] T007 Add foundational menu/session transition coverage in `tests/integration/foundation/gameStateFlow.test.ts`

**Checkpoint**: Menu scene and fresh-session seams are ready for player-facing scenario selection

---

## Phase 3: User Story 1 - Choose A Scenario From The Main Menu (Priority: P1) MVP

**Goal**: Show a main menu first and let the player explicitly choose which scenario to start

**Independent Test**: Open the game, confirm the main menu appears before gameplay, start each available scenario from the menu, and verify the correct scenario loads instead of auto-starting a default session

### Tests for User Story 1

- [ ] T008 [P] [US1] Add main-menu UX contract coverage in `tests/contract/gameplay-ui.menu.contract.test.ts`
- [ ] T009 [P] [US1] Add scenario-selection integration coverage in `tests/integration/menu/menuScenarioSelectionFlow.test.ts`
- [ ] T010 [P] [US1] Add browser coverage for menu-first launch and scenario start in `tests/acceptance/start-menu-selection.spec.ts`

### Implementation for User Story 1

- [ ] T011 [P] [US1] Render the main menu shell and scenario launch actions in `src/app/bootstrap/startGame.ts`
- [ ] T012 [P] [US1] Add menu and scenario-start UI helpers in `src/ui/overlays/mainMenu.ts`
- [ ] T013 [P] [US1] Expose scenario labels and descriptions for menu presentation in `src/content/scenarios/core-map-loop.ts`
- [ ] T014 [P] [US1] Expose scenario labels and descriptions for menu presentation in `src/content/scenarios/advanced-terrain-scenario.ts`
- [ ] T015 [US1] Wire menu selection into fresh scenario-session startup in `src/app/state/gameState.ts`

**Checkpoint**: User Story 1 is independently playable as a menu-first launch flow with explicit scenario selection

---

## Phase 4: User Story 2 - Return To The Main Menu After A Scenario Ends (Priority: P2)

**Goal**: Let the player leave the completion screen and return to the main menu for another fresh scenario run

**Independent Test**: Complete a scenario, use the return-to-menu action from the end-of-scenario state, and verify the menu reappears and can start a fresh run of any scenario

### Tests for User Story 2

- [ ] T016 [P] [US2] Add scenario-session return contract coverage in `tests/contract/scenario-session-state.contract.test.ts`
- [ ] T017 [P] [US2] Add completion-to-menu integration coverage in `tests/integration/menu/menuReturnFlow.test.ts`
- [ ] T018 [P] [US2] Add browser coverage for return-to-menu and fresh replay in `tests/acceptance/start-menu-return.spec.ts`

### Implementation for User Story 2

- [ ] T019 [P] [US2] Add completion-screen return-to-menu action in `src/app/bootstrap/startGame.ts`
- [ ] T020 [P] [US2] Add end-of-scenario return control markup in `src/ui/overlays/victoryMenu.ts`
- [ ] T021 [US2] Route completed scenario sessions back to the main menu and clear active session state in `src/app/state/gameState.ts`
- [ ] T022 [US2] Preserve existing completion detection while enabling menu return flow in `src/engine/victory/checkVictory.ts`

**Checkpoint**: User Stories 1 and 2 together provide a complete loop from menu to scenario completion and back to menu

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Finish shared wording, verification, and artifact consistency for the menu slice

- [ ] T023 [P] Update menu interaction wording and expectations in `specs/008-start-menu/contracts/main-menu-ux.md`
- [ ] T024 [P] Update scenario session lifecycle details in `specs/008-start-menu/contracts/scenario-session-state.md`
- [ ] T025 Run start-menu verification commands documented in `specs/008-start-menu/quickstart.md`
- [ ] T026 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/008-start-menu/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all story work
- **Phase 3: US1**: Depends on Phase 2 and delivers the MVP
- **Phase 4: US2**: Depends on Phase 2 and builds on the menu/session seams established by US1
- **Phase 5: Polish**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after foundational work
- **US2**: Depends on the main-menu scene and scenario-session seams delivered by US1

### Within Each User Story

- Add behavior-level tests before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Finish shared state and bootstrapping seams before wiring UI actions and completion flows
- Validate each story against its independent test before moving forward

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each story marked `[P]` can run in parallel
- UI, content, and state tasks marked `[P]` can run in parallel once shared seams exist

---

## Parallel Example: User Story 1

```text
T008 Add main-menu UX contract coverage in tests/contract/gameplay-ui.menu.contract.test.ts
T009 Add scenario-selection integration coverage in tests/integration/menu/menuScenarioSelectionFlow.test.ts
T010 Add browser coverage for menu-first launch and scenario start in tests/acceptance/start-menu-selection.spec.ts

T011 Render the main menu shell and scenario launch actions in src/app/bootstrap/startGame.ts
T012 Add menu and scenario-start UI helpers in src/ui/overlays/mainMenu.ts
T013 Expose scenario labels and descriptions for menu presentation in src/content/scenarios/core-map-loop.ts
T014 Expose scenario labels and descriptions for menu presentation in src/content/scenarios/advanced-terrain-scenario.ts
```

---

## Parallel Example: User Story 2

```text
T016 Add scenario-session return contract coverage in tests/contract/scenario-session-state.contract.test.ts
T017 Add completion-to-menu integration coverage in tests/integration/menu/menuReturnFlow.test.ts
T018 Add browser coverage for return-to-menu and fresh replay in tests/acceptance/start-menu-return.spec.ts

T019 Add completion-screen return-to-menu action in src/app/bootstrap/startGame.ts
T020 Add end-of-scenario return control markup in src/ui/overlays/victoryMenu.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate menu-first launch and explicit scenario selection independently

### Incremental Delivery

1. Build shared menu scene, scenario catalog, and fresh-session seams
2. Deliver US1 scenario selection from the main menu as the MVP
3. Deliver US2 return-to-menu and fresh replay after scenario completion
4. Finish with cross-cutting polish and verification

### Parallel Team Strategy

1. One developer prepares scene and session-state seams
2. Another developer can prepare behavior-level menu tests once contracts are stable
3. After the foundational phase:
   - Developer A: US1 menu rendering and scenario launch flow
   - Developer B: US2 completion return flow

---

## Notes

- `[P]` tasks are candidates for parallel execution because they target separate seams or files
- `[US1]` and `[US2]` preserve traceability back to the start-menu feature spec
- This slice intentionally does not introduce save/load, pause, or mid-scenario exit behavior
