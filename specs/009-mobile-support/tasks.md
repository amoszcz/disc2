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

**Purpose**: Prepare mobile-focused verification entry points and align feature-facing validation guidance

- [X] T001 Update mobile verification commands and documentation references in `package.json`
- [X] T002 Refresh mobile validation steps for Border Watch baseline checks in `specs/009-mobile-support/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared responsive layout, live canvas sizing, and normalized viewport seams required by all stories

**CRITICAL**: No user story work should begin before this phase is complete

- [X] T003 Extend shared mobile layout, touch, and zoom-baseline types in `src/engine/scenario/types.ts`
- [X] T004 [P] Refactor map viewport normalization to use live canvas metrics and shared zoom bounds in `src/engine/map/viewportMath.ts`
- [X] T005 [P] Add responsive canvas metrics helpers for rendering and hit testing in `src/render/canvas/viewportRender.ts`
- [X] T006 [P] Extend bootstrap shell state for responsive layout and viewport resize events in `src/app/bootstrap/startGame.ts`
- [X] T007 Add foundational coverage for responsive layout and viewport normalization in `tests/integration/foundation/mobileLayoutFlow.test.ts`

**Checkpoint**: Responsive shell, live canvas seams, and shared zoom-bound infrastructure are ready for story work

---

## Phase 3: User Story 1 - Start And Navigate On Mobile (Priority: P1) MVP

**Goal**: Let players open the game on a phone-sized browser, read the menu, and start a scenario with the initial view centered on the starting hero without desktop-only controls

**Independent Test**: Open the app in a mobile-sized browser viewport, confirm the main menu is readable and actionable, start each available scenario, and verify the selected scenario enters a mobile-friendly gameplay layout with the initial map view centered on the starting hero as closely as map bounds allow

### Tests for User Story 1

- [X] T008 [P] [US1] Add mobile layout UX contract coverage in `tests/contract/gameplay-ui.mobile-layout.contract.test.ts`
- [X] T009 [P] [US1] Add mobile menu-to-scenario integration coverage in `tests/integration/mobile/mobileMenuLaunchFlow.test.ts`
- [X] T010 [P] [US1] Add browser coverage for mobile launch and scenario start in `tests/acceptance/mobile-start-menu.spec.ts`
- [X] T011 [P] [US1] Add contract coverage for initial hero-centered scenario framing in `tests/contract/gameplay-ui.mobile-layout.contract.test.ts`
- [X] T012 [P] [US1] Add integration coverage for startup viewport centering on the selected hero in `tests/integration/mobile/mobileMenuLaunchFlow.test.ts`
- [X] T013 [P] [US1] Add browser coverage for hero-centered initial scenario framing in `tests/acceptance/mobile-start-menu.spec.ts`

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement responsive app shell sizing and sidebar placement in `src/app/bootstrap/startGame.ts`
- [X] T015 [P] [US1] Update main menu presentation for narrow mobile viewports in `src/ui/overlays/mainMenu.ts`
- [X] T016 [P] [US1] Update root page layout styling for phone-sized play in `index.html`
- [X] T017 [US1] Render mobile-friendly map and victory sidebars after scenario start in `src/app/scene-controller/mapScene.ts`
- [X] T018 [P] [US1] Add viewport helpers for centering the initial scenario view on the starting hero in `src/engine/map/viewportMath.ts`
- [X] T019 [US1] Initialize scenario start state with hero-centered viewport framing in `src/app/state/gameState.ts`
- [X] T020 [US1] Preserve hero-centered initial framing through bootstrap scenario startup in `src/app/bootstrap/startGame.ts`

**Checkpoint**: User Story 1 is independently playable as a mobile menu-first launch flow with hero-centered initial framing

---

## Phase 4: User Story 2 - Play Core Turns With Touch Controls (Priority: P1)

**Goal**: Let mobile players complete map and battle actions through touch-capable controls only, including two-finger map zoom with Border Watch-aligned zoom endpoints across scenarios and diagonal-aware route costing

**Independent Test**: Play through a scenario on a mobile-sized browser viewport using touch-capable interactions only, verifying hero selection, diagonal-versus-orthogonal route planning cost, two-finger map zoom, normalized min/max zoom tile sizes, turn completion, and battle actions all work without hover, mouse wheel, or middle mouse input

### Tests for User Story 2

- [X] T021 [P] [US2] Add touch session controls contract coverage in `tests/contract/touch-session-controls.contract.test.ts`
- [X] T022 [P] [US2] Add integration coverage for touch map interaction and normalized zoom bounds in `tests/integration/mobile/mobileMapTouchFlow.test.ts`
- [X] T023 [P] [US2] Add integration coverage for touch battle interaction in `tests/integration/mobile/mobileBattleTouchFlow.test.ts`
- [X] T024 [P] [US2] Add browser coverage for touch-only gameplay and in-canvas zoom in `tests/acceptance/mobile-gameplay-flow.spec.ts`
- [X] T025 [P] [US2] Add cross-scenario contract coverage for Border Watch zoom-baseline parity in `tests/contract/touch-session-controls.contract.test.ts`
- [X] T026 [P] [US2] Add cross-scenario integration coverage for min/max tile-size normalization in `tests/integration/mobile/mobileMapTouchFlow.test.ts`
- [X] T047 [P] [US2] Add contract coverage for diagonal route-distance weighting in `tests/contract/route-preview-state.contract.test.ts`
- [X] T048 [P] [US2] Add integration coverage comparing diagonal and orthogonal route costs in `tests/integration/foundation/routePreviewStateFlow.test.ts`
- [X] T049 [P] [US2] Add browser coverage for diagonal-aware route preview cost feedback in `tests/acceptance/route-preview.spec.ts`

### Implementation for User Story 2

- [X] T027 [P] [US2] Replace mouse-only map interactions with touch-capable input handling in `src/app/scene-controller/mapInputController.ts`
- [X] T028 [P] [US2] Replace mouse-only battle targeting with touch-capable input handling in `src/app/scene-controller/battleInputController.ts`
- [X] T029 [P] [US2] Extend viewport state to carry the Border Watch zoom baseline and gesture anchors in `src/engine/scenario/types.ts`
- [X] T030 [P] [US2] Normalize minimum and maximum zoom bounds across scenarios in `src/engine/map/viewportMath.ts`
- [X] T031 [US2] Add two-finger map zoom gesture handling to the mobile input pipeline in `src/app/scene-controller/mapInputController.ts`
- [X] T032 [P] [US2] Update map HUD guidance for touch controls and two-finger zoom in `src/ui/hud/mapHud.ts`
- [X] T033 [P] [US2] Update battle HUD guidance for touch-first targeting in `src/ui/overlays/battleHud.ts`
- [X] T034 [US2] Keep the end-turn action reachable during mobile gameplay in `src/ui/panels/endTurnPanel.ts`
- [X] T050 [P] [US2] Encode longer diagonal step weighting in `src/engine/map/routeRules.ts`
- [X] T051 [P] [US2] Apply diagonal-aware movement totals to plotted routes in `src/engine/map/routePathfinding.ts`
- [X] T052 [US2] Preserve diagonal-aware route cost feedback during preview and continuation in `src/engine/map/heroActions.ts`

**Checkpoint**: User Story 2 is independently playable as a touch-capable mobile gameplay loop with normalized zoom bounds and diagonal-aware route costing

---

## Phase 5: User Story 3 - Continue Across Mobile View Changes (Priority: P2)

**Goal**: Keep the active mobile session usable through orientation changes, browser chrome changes, and completion return flow

**Independent Test**: Start a mobile session, resize or rotate the viewport during active play, finish a scenario, return to the menu, and verify the interface stays usable and another fresh mobile run can be started

### Tests for User Story 3

- [X] T035 [P] [US3] Add viewport continuity contract coverage in `tests/contract/mobile-viewport-continuity.contract.test.ts`
- [X] T036 [P] [US3] Add resize and orientation integration coverage in `tests/integration/mobile/mobileViewportResizeFlow.test.ts`
- [X] T037 [P] [US3] Add browser coverage for resize, completion, and replay on mobile in `tests/acceptance/mobile-viewport-continuity.spec.ts`

### Implementation for User Story 3

- [X] T038 [P] [US3] Preserve scene and viewport state across browser resize events in `src/app/bootstrap/startGame.ts`
- [X] T039 [P] [US3] Re-render map scene tile sizing and hit areas after viewport changes in `src/render/canvas/renderMapScene.ts`
- [X] T040 [P] [US3] Re-render battle scene hit areas after viewport changes in `src/render/canvas/renderBattleScene.ts`
- [X] T041 [US3] Keep completion and return-to-menu controls mobile-usable after viewport changes in `src/ui/overlays/victoryMenu.ts`

**Checkpoint**: User Stories 1, 2, and 3 together provide a complete mobile browser play loop

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish shared verification, contract wording, and artifact consistency for the mobile slice

- [X] T042 [P] Update mobile layout contract wording for initial hero-centered framing in `specs/009-mobile-support/contracts/mobile-layout-ux.md`
- [X] T043 [P] Update touch session control contract wording for startup hero framing in `specs/009-mobile-support/contracts/touch-session-controls.md`
- [X] T044 Tune mobile acceptance browser settings for touch and viewport scenarios in `playwright.config.ts`
- [X] T045 Run the mobile validation commands documented in `specs/009-mobile-support/quickstart.md`
- [X] T046 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/009-mobile-support/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all story work
- **Phase 3: US1**: Depends on Phase 2 and delivers the MVP
- **Phase 4: US2**: Depends on Phase 2 and builds on the responsive shell and viewport seams
- **Phase 5: US3**: Depends on Phase 2 and benefits from the mobile shell and zoom-state continuity work
- **Phase 6: Polish**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after foundational work
- **US2**: Depends on the responsive shell, live canvas sizing, shared zoom-bound seams, scenario-start framing, and route preview/movement seams delivered in Phase 2 and US1; it does not require US3
- **US3**: Depends on the responsive shell and viewport state seams from Phase 2 and validates the mobile loop across viewport changes

### Within Each User Story

- Add behavior-level tests before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Finish shared layout and viewport seams before wiring scene-specific behavior
- Validate each story against its independent test before moving forward

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each story marked `[P]` can run in parallel
- `T011`, `T012`, and `T013` can run in parallel before the US1 implementation tasks close
- `T018` can run in parallel with `T019` once the US1 test tasks define the expected centering behavior
- UI and controller tasks marked `[P]` can run in parallel once the shared seams exist
- `T025`, `T026`, `T047`, `T048`, and `T049` can run in parallel with `T029`, `T030`, `T050`, and `T051` after the foundational phase
- `T038`, `T039`, and `T040` can run in parallel once viewport continuity tests are in place

---

## Parallel Example: User Story 1

```text
T008 Add mobile layout UX contract coverage in tests/contract/gameplay-ui.mobile-layout.contract.test.ts
T009 Add mobile menu-to-scenario integration coverage in tests/integration/mobile/mobileMenuLaunchFlow.test.ts
T010 Add browser coverage for mobile launch and scenario start in tests/acceptance/mobile-start-menu.spec.ts
T011 Add contract coverage for initial hero-centered scenario framing in tests/contract/gameplay-ui.mobile-layout.contract.test.ts
T012 Add integration coverage for startup viewport centering on the selected hero in tests/integration/mobile/mobileMenuLaunchFlow.test.ts
T013 Add browser coverage for hero-centered initial scenario framing in tests/acceptance/mobile-start-menu.spec.ts

T014 Implement responsive app shell sizing and sidebar placement in src/app/bootstrap/startGame.ts
T015 Update main menu presentation for narrow mobile viewports in src/ui/overlays/mainMenu.ts
T016 Update root page layout styling for phone-sized play in index.html
T018 Add viewport helpers for centering the initial scenario view on the starting hero in src/engine/map/viewportMath.ts
```

---

## Parallel Example: User Story 2

```text
T021 Add touch session controls contract coverage in tests/contract/touch-session-controls.contract.test.ts
T022 Add integration coverage for touch map interaction and normalized zoom bounds in tests/integration/mobile/mobileMapTouchFlow.test.ts
T023 Add integration coverage for touch battle interaction in tests/integration/mobile/mobileBattleTouchFlow.test.ts
T024 Add browser coverage for touch-only gameplay and in-canvas zoom in tests/acceptance/mobile-gameplay-flow.spec.ts
T025 Add cross-scenario contract coverage for Border Watch zoom-baseline parity in tests/contract/touch-session-controls.contract.test.ts
T026 Add cross-scenario integration coverage for min/max tile-size normalization in tests/integration/mobile/mobileMapTouchFlow.test.ts
T047 Add contract coverage for diagonal route-distance weighting in tests/contract/route-preview-state.contract.test.ts
T048 Add integration coverage comparing diagonal and orthogonal route costs in tests/integration/foundation/routePreviewStateFlow.test.ts
T049 Add browser coverage for diagonal-aware route preview cost feedback in tests/acceptance/route-preview.spec.ts

T027 Replace mouse-only map interactions with touch-capable input handling in src/app/scene-controller/mapInputController.ts
T028 Replace mouse-only battle targeting with touch-capable input handling in src/app/scene-controller/battleInputController.ts
T029 Extend viewport state to carry the Border Watch zoom baseline and gesture anchors in src/engine/scenario/types.ts
T030 Normalize minimum and maximum zoom bounds across scenarios in src/engine/map/viewportMath.ts
T032 Update map HUD guidance for touch controls and two-finger zoom in src/ui/hud/mapHud.ts
T033 Update battle HUD guidance for touch-first targeting in src/ui/overlays/battleHud.ts
T050 Encode longer diagonal step weighting in src/engine/map/routeRules.ts
T051 Apply diagonal-aware movement totals to plotted routes in src/engine/map/routePathfinding.ts
```

---

## Parallel Example: User Story 3

```text
T035 Add viewport continuity contract coverage in tests/contract/mobile-viewport-continuity.contract.test.ts
T036 Add resize and orientation integration coverage in tests/integration/mobile/mobileViewportResizeFlow.test.ts
T037 Add browser coverage for resize, completion, and replay on mobile in tests/acceptance/mobile-viewport-continuity.spec.ts

T038 Preserve scene and viewport state across browser resize events in src/app/bootstrap/startGame.ts
T039 Re-render map scene tile sizing and hit areas after viewport changes in src/render/canvas/renderMapScene.ts
T040 Re-render battle scene hit areas after viewport changes in src/render/canvas/renderBattleScene.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Finish the remaining unchecked US1 tasks for initial hero-centered framing
4. Validate mobile launch, menu readability, and hero-centered scenario start independently

### Incremental Delivery

1. Build shared responsive shell, live canvas sizing, and normalized zoom-bound seams
2. Finish US1 by adding initial hero-centered startup framing to the existing mobile menu-first launch flow
3. Extend US2 touch-capable gameplay flow with diagonal-aware route costing while keeping Border Watch-aligned zoom bounds intact
4. Keep US3 viewport continuity and replay resilience intact
5. Finish with cross-cutting polish and verification

### Parallel Team Strategy

1. One developer prepares the US1 centering tests while another adds the viewport-centering helpers
2. Once the centering helpers are in place:
   - Developer A: wire startup viewport framing in state/bootstrap
   - Developer B: update acceptance and integration validation
3. Re-run the mobile verification pass before closing polish

---

## Notes

- `[P]` tasks are candidates for parallel execution because they target separate seams or files
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the mobile support feature spec
- This slice intentionally does not introduce native app packaging or offline support, and limits gameplay-rule changes to the specified diagonal route-distance weighting
