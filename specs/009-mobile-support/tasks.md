# Tasks: Mobile Browser Support

**Input**: Design documents from `/specs/009-mobile-support/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract, integration, and acceptance coverage for each behavior-changing mobile support story.

**Organization**: Tasks are grouped by user story so each mobile-support slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel with other `[P]` tasks in the same phase
- **[Story]**: Maps work to a specific user story from `spec.md`
- Every task includes the primary file path to change

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare mobile-focused verification entry points and align active feature documentation

- [X] T001 Add mobile-focused verification scripts in `package.json`
- [X] T002 Align mobile feature execution notes in `specs/009-mobile-support/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared responsive layout, canvas sizing, and touch-input seams required by all stories

**CRITICAL**: No user story work should begin before this phase is complete

- [X] T003 Extend mobile layout, responsive canvas, and touch-interaction types in `src/engine/scenario/types.ts`
- [X] T004 [P] Refactor viewport sizing and normalization to use live canvas dimensions in `src/engine/map/viewportMath.ts`
- [X] T005 [P] Add shared responsive canvas metrics helpers in `src/render/canvas/viewportRender.ts`
- [X] T006 [P] Extend bootstrap shell state for responsive layout and resize handling in `src/app/bootstrap/startGame.ts`
- [X] T007 Add foundational responsive layout and viewport continuity coverage in `tests/integration/foundation/mobileLayoutFlow.test.ts`

**Checkpoint**: Responsive shell and live canvas seams are ready for mobile-facing behavior

---

## Phase 3: User Story 1 - Start And Navigate On Mobile (Priority: P1) MVP

**Goal**: Let players open the game on a phone-sized browser, read the menu, and start a scenario without desktop-only controls

**Independent Test**: Open the app in a mobile-sized browser viewport, confirm the main menu is readable and actionable, start each available scenario, and verify the selected scenario enters a mobile-friendly gameplay layout without mouse or keyboard input

### Tests for User Story 1

- [X] T008 [P] [US1] Add mobile layout UX contract coverage in `tests/contract/gameplay-ui.mobile-layout.contract.test.ts`
- [X] T009 [P] [US1] Add mobile menu-to-scenario integration coverage in `tests/integration/mobile/mobileMenuLaunchFlow.test.ts`
- [X] T010 [P] [US1] Add browser coverage for mobile launch and scenario start in `tests/acceptance/mobile-start-menu.spec.ts`

### Implementation for User Story 1

- [X] T011 [P] [US1] Implement responsive app shell sizing and sidebar placement in `src/app/bootstrap/startGame.ts`
- [X] T012 [P] [US1] Update main menu markup for narrow mobile presentation in `src/ui/overlays/mainMenu.ts`
- [X] T013 [P] [US1] Update shared root-page styles for mobile layout in `index.html`
- [X] T014 [US1] Render mobile-friendly map and victory sidebars after scenario start in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 1 is independently playable as a mobile menu-first launch flow

---

## Phase 4: User Story 2 - Play Core Turns With Touch Controls (Priority: P1)

**Goal**: Let mobile players complete map and battle actions through touch-capable controls only, including two-finger map zoom

**Independent Test**: Play through a scenario on a mobile-sized browser viewport using touch-capable interactions only, verifying hero selection, route planning, two-finger map zoom, turn completion, and battle actions all work without hover, mouse wheel, or middle mouse input

### Tests for User Story 2

- [X] T015 [P] [US2] Add touch session controls contract coverage in `tests/contract/touch-session-controls.contract.test.ts`
- [X] T016 [P] [US2] Add touch map interaction integration coverage in `tests/integration/mobile/mobileMapTouchFlow.test.ts`
- [X] T017 [P] [US2] Add touch battle interaction integration coverage in `tests/integration/mobile/mobileBattleTouchFlow.test.ts`
- [X] T018 [P] [US2] Add browser coverage for touch-only gameplay flow in `tests/acceptance/mobile-gameplay-flow.spec.ts`
- [X] T036 [P] [US2] Add contract coverage for two-finger in-canvas zoom behavior in `tests/contract/touch-session-controls.contract.test.ts`
- [X] T037 [P] [US2] Add integration coverage for two-finger map zoom state changes in `tests/integration/mobile/mobileMapTouchFlow.test.ts`
- [X] T038 [P] [US2] Add browser coverage for two-finger zoom without page zoom in `tests/acceptance/mobile-gameplay-flow.spec.ts`

### Implementation for User Story 2

- [X] T019 [P] [US2] Replace mouse-only map input handling with touch-capable interactions in `src/app/scene-controller/mapInputController.ts`
- [X] T020 [P] [US2] Replace mouse-only battle canvas targeting with touch-capable interactions in `src/app/scene-controller/battleInputController.ts`
- [X] T021 [P] [US2] Update map HUD and action messaging for mobile controls in `src/ui/hud/mapHud.ts`
- [X] T022 [P] [US2] Update battle action layout and targeting guidance for mobile controls in `src/ui/overlays/battleHud.ts`
- [X] T023 [US2] Keep end-turn action reachable in mobile gameplay layouts in `src/ui/panels/endTurnPanel.ts`
- [X] T039 [US2] Add two-finger map zoom gesture handling to the mobile input pipeline in `src/app/scene-controller/mapInputController.ts`
- [X] T040 [P] [US2] Extend mobile touch interaction state to track active zoom gestures in `src/engine/scenario/types.ts`
- [X] T041 [P] [US2] Preserve viewport zoom bounds and anchor behavior during touch gestures in `src/engine/map/viewportMath.ts`
- [X] T042 [US2] Update mobile map guidance to describe two-finger zoom availability in `src/ui/hud/mapHud.ts`

**Checkpoint**: User Story 2 is independently playable as a touch-capable mobile gameplay loop with direct two-finger zoom

---

## Phase 5: User Story 3 - Continue Across Mobile View Changes (Priority: P2)

**Goal**: Keep the active mobile session usable through orientation changes, browser chrome changes, and completion return flow

**Independent Test**: Start a mobile session, resize or rotate the viewport during active play, finish a scenario, return to the menu, and verify the interface stays usable and another fresh mobile run can be started

### Tests for User Story 3

- [X] T024 [P] [US3] Add viewport continuity contract coverage in `tests/contract/mobile-viewport-continuity.contract.test.ts`
- [X] T025 [P] [US3] Add resize and orientation integration coverage in `tests/integration/mobile/mobileViewportResizeFlow.test.ts`
- [X] T026 [P] [US3] Add browser coverage for resize, completion, and replay on mobile in `tests/acceptance/mobile-viewport-continuity.spec.ts`

### Implementation for User Story 3

- [X] T027 [P] [US3] Preserve scene and viewport state across browser resize events in `src/app/bootstrap/startGame.ts`
- [X] T028 [P] [US3] Re-render map scene and tile sizing correctly after viewport changes in `src/render/canvas/renderMapScene.ts`
- [X] T029 [P] [US3] Re-render battle scene hit areas correctly after viewport changes in `src/render/canvas/renderBattleScene.ts`
- [X] T030 [US3] Keep completion and return-to-menu controls mobile-usable after viewport changes in `src/ui/overlays/victoryMenu.ts`

**Checkpoint**: User Stories 1, 2, and 3 together provide a complete mobile browser play loop

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish shared wording, verification, and artifact consistency for the mobile slice

- [X] T031 [P] Update mobile layout expectations in `specs/009-mobile-support/contracts/mobile-layout-ux.md`
- [X] T032 [P] Update touch control lifecycle details in `specs/009-mobile-support/contracts/touch-session-controls.md`
- [X] T033 Tune browser acceptance configuration for mobile-sized scenarios in `playwright.config.ts`
- [X] T034 Run mobile support verification commands documented in `specs/009-mobile-support/quickstart.md`
- [X] T035 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/009-mobile-support/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all story work
- **Phase 3: US1**: Depends on Phase 2 and delivers the MVP
- **Phase 4: US2**: Depends on Phase 2 and builds on the responsive shell and input seams
- **Phase 5: US3**: Depends on Phase 2 and benefits from US1 mobile layout and US2 touch interaction behavior, though viewport continuity seams can be developed after the foundation is in place
- **Phase 6: Polish**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after foundational work
- **US2**: Depends on the responsive shell, live canvas sizing, and input seams delivered in Phase 2; it should not require US3
- **US3**: Depends on the responsive shell from Phase 2 and should validate the mobile loop delivered by US1 and US2 across viewport changes

### Within Each User Story

- Add behavior-level tests before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Finish shared layout and input seams before wiring scene-specific mobile behavior
- Validate each story against its independent test before moving forward

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each story marked `[P]` can run in parallel
- UI and controller tasks marked `[P]` can run in parallel once the shared seams exist
- `T036`, `T037`, and `T038` can run in parallel before the new zoom implementation tasks close US2

---

## Parallel Example: User Story 1

```text
T008 Add mobile layout UX contract coverage in tests/contract/gameplay-ui.mobile-layout.contract.test.ts
T009 Add mobile menu-to-scenario integration coverage in tests/integration/mobile/mobileMenuLaunchFlow.test.ts
T010 Add browser coverage for mobile launch and scenario start in tests/acceptance/mobile-start-menu.spec.ts

T011 Implement responsive app shell sizing and sidebar placement in src/app/bootstrap/startGame.ts
T012 Update main menu markup for narrow mobile presentation in src/ui/overlays/mainMenu.ts
T013 Update shared root-page styles for mobile layout in index.html
```

---

## Parallel Example: User Story 2

```text
T015 Add touch session controls contract coverage in tests/contract/touch-session-controls.contract.test.ts
T016 Add touch map interaction integration coverage in tests/integration/mobile/mobileMapTouchFlow.test.ts
T017 Add touch battle interaction integration coverage in tests/integration/mobile/mobileBattleTouchFlow.test.ts
T018 Add browser coverage for touch-only gameplay flow in tests/acceptance/mobile-gameplay-flow.spec.ts
T036 Add contract coverage for two-finger in-canvas zoom behavior in tests/contract/touch-session-controls.contract.test.ts
T037 Add integration coverage for two-finger map zoom state changes in tests/integration/mobile/mobileMapTouchFlow.test.ts
T038 Add browser coverage for two-finger zoom without page zoom in tests/acceptance/mobile-gameplay-flow.spec.ts

T019 Replace mouse-only map input handling with touch-capable interactions in src/app/scene-controller/mapInputController.ts
T020 Replace mouse-only battle canvas targeting with touch-capable interactions in src/app/scene-controller/battleInputController.ts
T021 Update map HUD and action messaging for mobile controls in src/ui/hud/mapHud.ts
T022 Update battle action layout and targeting guidance for mobile controls in src/ui/overlays/battleHud.ts
T039 Add two-finger map zoom gesture handling to the mobile input pipeline in src/app/scene-controller/mapInputController.ts
T040 Extend mobile touch interaction state to track active zoom gestures in src/engine/scenario/types.ts
T041 Preserve viewport zoom bounds and anchor behavior during touch gestures in src/engine/map/viewportMath.ts
T042 Update mobile map guidance to describe two-finger zoom availability in src/ui/hud/mapHud.ts
```

---

## Parallel Example: User Story 3

```text
T024 Add viewport continuity contract coverage in tests/contract/mobile-viewport-continuity.contract.test.ts
T025 Add resize and orientation integration coverage in tests/integration/mobile/mobileViewportResizeFlow.test.ts
T026 Add browser coverage for resize, completion, and replay on mobile in tests/acceptance/mobile-viewport-continuity.spec.ts

T027 Preserve scene and viewport state across browser resize events in src/app/bootstrap/startGame.ts
T028 Re-render map scene and tile sizing correctly after viewport changes in src/render/canvas/renderMapScene.ts
T029 Re-render battle scene hit areas correctly after viewport changes in src/render/canvas/renderBattleScene.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate mobile launch, menu readability, and scenario start independently

### Incremental Delivery

1. Build shared responsive shell, live canvas sizing, and touch-capable seams
2. Deliver US1 mobile menu-first launch as the MVP
3. Deliver US2 touch-capable gameplay flow
4. Deliver US3 viewport continuity and replay resilience
5. Finish with cross-cutting polish and verification

### Parallel Team Strategy

1. One developer prepares responsive shell and viewport sizing seams
2. Another developer can prepare mobile behavior-level tests once contracts are stable
3. After the foundational phase:
   - Developer A: US1 mobile layout and menu flow
   - Developer B: US2 touch gameplay controls
   - Developer C: US3 viewport continuity behavior

---

## Notes

- `[P]` tasks are candidates for parallel execution because they target separate seams or files
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the mobile support feature spec
- This slice intentionally does not introduce native app packaging, offline support, or gameplay rule changes
