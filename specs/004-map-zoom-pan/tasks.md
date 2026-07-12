# Tasks: Map Zoom and Panning

**Input**: Design documents from `/specs/004-map-zoom-pan/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated validation tasks are included for every behavior-changing story. The task list favors contract, integration, and acceptance coverage for viewport input, zoom behavior, panning bounds, restored view state, and interaction remapping.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g. [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- Existing single-project web application rooted at `src/` and `tests/`
- Viewport math and state extend `src/engine/map/` and `src/app/state/`
- Canvas rendering changes stay in `src/render/canvas/`
- Browser interaction wiring stays in `src/app/bootstrap/` and `src/app/scene-controller/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repository and active feature workspace for viewport behavior without changing gameplay yet

- [x] T001 Add zoom-and-pan verification notes or scripts for the new slice in `package.json`
- [x] T002 Ensure the active feature documentation set is present and aligned in `specs/004-map-zoom-pan/`
- [x] T003 [P] Update generated-artifact ignore coverage if needed for viewport acceptance outputs in `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Introduce the shared viewport state, math seams, and render/input hooks required before any user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create viewport, zoom, pan, and interaction-target definitions in `src/engine/scenario/types.ts`
- [x] T005 [P] Implement viewport normalization and coordinate-conversion helpers in `src/engine/map/viewportMath.ts`
- [x] T006 [P] Extend game-state initialization and persistence for map view state in `src/app/state/gameState.ts`
- [x] T007 [P] Add shared viewport render helpers for visible-world calculations in `src/render/canvas/viewportRender.ts`
- [x] T008 [P] Update map bootstrap wiring so map input can subscribe to wheel and middle-mouse navigation in `src/app/bootstrap/startGame.ts`
- [x] T009 Create foundational integration coverage for viewport defaults, bounds, and restored state in `tests/integration/foundation/mapViewportStateFlow.test.ts`

**Checkpoint**: Shared viewport model and helper seams are ready for story implementation

---

## Phase 3: User Story 1 - Navigate Across Large Maps (Priority: P1) MVP

**Goal**: Let the player pan across oversized adventure maps without exposing empty off-map space

**Independent Test**: Open the advanced terrain scenario, drag-pan away from the starting hero, reach each map edge, and confirm the viewport stops at legal boundaries while continuing to render the map correctly

### Tests for User Story 1

- [x] T010 [P] [US1] Add contract coverage for middle-mouse pan input behavior in `tests/contract/map-navigation-input.contract.test.ts`
- [x] T011 [P] [US1] Add integration coverage for viewport pan updates and edge clamping in `tests/integration/map/mapPanFlow.test.ts`
- [x] T012 [P] [US1] Add browser acceptance coverage for map drag panning on the large scenario in `tests/acceptance/map-pan-navigation.spec.ts`

### Implementation for User Story 1

- [x] T013 [P] [US1] Add active pan-gesture state and update helpers in `src/app/state/gameState.ts`
- [x] T014 [P] [US1] Apply viewport pan offsets to adventure-map rendering in `src/render/canvas/renderMapScene.ts`
- [x] T015 [P] [US1] Implement middle-mouse drag handling and bounded pan updates in `src/app/scene-controller/mapInputController.ts`
- [x] T016 [US1] Integrate pan-aware redraw behavior into the map scene controller in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 1 should now provide bounded panning over the adventure map

---

## Phase 4: User Story 2 - Change Map Scale for Planning (Priority: P2)

**Goal**: Let the player zoom in and out with the mouse wheel while keeping the hovered map area stable and within bounds

**Independent Test**: Open the advanced terrain scenario, hover a visible map feature, zoom in and out with the mouse wheel, and verify scale changes are clamped and cursor-focused

### Tests for User Story 2

- [x] T017 [P] [US2] Add contract coverage for cursor-anchored wheel zoom behavior in `tests/contract/viewport-behavior.contract.test.ts`
- [x] T018 [P] [US2] Add integration coverage for zoom clamping and cursor-anchor math in `tests/integration/map/mapZoomFlow.test.ts`
- [x] T019 [P] [US2] Add browser acceptance coverage for wheel zoom behavior in `tests/acceptance/map-zoom-navigation.spec.ts`

### Implementation for User Story 2

- [x] T020 [P] [US2] Add bounded zoom-level configuration and cursor-anchor calculations in `src/engine/map/viewportMath.ts`
- [x] T021 [P] [US2] Apply zoom scaling and visible-world sizing to map rendering in `src/render/canvas/renderMapScene.ts`
- [x] T022 [P] [US2] Implement mouse-wheel zoom input and cursor-focused viewport updates in `src/app/scene-controller/mapInputController.ts`
- [x] T023 [US2] Surface current zoom state in the HUD or overlay in `src/ui/hud/mapHud.ts`

**Checkpoint**: User Stories 1 and 2 should now provide bounded pan and zoom navigation on the map

---

## Phase 5: User Story 3 - Keep Map Interaction Reliable While Navigating (Priority: P3)

**Goal**: Preserve accurate hero selection, destination targeting, and restored view state after the player pans, zooms, or leaves and returns to the map scene

**Independent Test**: Pan and zoom the map, then select a visible hero or destination tile, transition away from and back to the map, and confirm both interaction accuracy and preserved viewport state

### Tests for User Story 3

- [x] T024 [P] [US3] Add contract coverage for restored view state and click-target accuracy in `tests/contract/viewport-interaction.contract.test.ts`
- [x] T025 [P] [US3] Add integration coverage for viewport-based coordinate remapping and map-scene restoration in `tests/integration/map/viewportInteractionFlow.test.ts`
- [x] T026 [P] [US3] Add browser acceptance coverage for selecting and moving after zoom or pan in `tests/acceptance/map-view-interaction.spec.ts`

### Implementation for User Story 3

- [x] T027 [P] [US3] Translate visible canvas coordinates back into world tiles through viewport state in `src/engine/map/viewportMath.ts`
- [x] T028 [P] [US3] Update map click handling so navigation-aware selection and movement target the visible tile under the pointer in `src/app/scene-controller/mapInputController.ts`
- [x] T029 [P] [US3] Preserve and restore adventure-map viewport state across scene changes in `src/app/state/gameState.ts`
- [x] T030 [US3] Integrate restored viewport state into scene transitions and redraw flow in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: All user stories should now be independently functional with correct post-navigation interaction

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish validation, cleanup, and documentation alignment across the viewport slice

- [x] T031 [P] Add any shared viewport constants or visual helpers in `src/render/sprites/placeholders.ts`
- [x] T032 [P] Update zoom-and-pan run instructions and scenario notes in `specs/004-map-zoom-pan/quickstart.md`
- [x] T033 Run the full zoom-and-pan verification flow and record results in `specs/004-map-zoom-pan/tasks.md`
- [x] T034 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain consistent after implementation in `specs/004-map-zoom-pan/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion and delivers the MVP
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds on the shared viewport introduced for US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and relies on the viewport model exercised by US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational completion and is the MVP slice
- **User Story 2 (P2)**: Depends on the shared viewport model and benefits from the panning behavior established in US1
- **User Story 3 (P3)**: Depends on the viewport math and visible-world rendering introduced in US1 and US2

### Within Each User Story

- Add automated tests for changed behavior before marking the story complete
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Build viewport math and state seams before scene wiring
- Finish user-visible navigation feedback before considering a story complete
- Validate the story through its independent test before moving to the next phase

### Parallel Opportunities

- Foundational tasks marked `[P]` can run in parallel after the type updates are in place
- Within each story, contract, integration, and acceptance tests marked `[P]` can run in parallel
- Engine, render, input, and UI tasks that touch separate files can run in parallel once their shared seams exist

---

## Parallel Example: User Story 1

```text
T010 Contract coverage for middle-mouse pan input behavior in tests/contract/map-navigation-input.contract.test.ts
T011 Integration coverage for viewport pan updates and edge clamping in tests/integration/map/mapPanFlow.test.ts
T012 Browser acceptance coverage for map drag panning on the large scenario in tests/acceptance/map-pan-navigation.spec.ts

T013 Add active pan-gesture state and update helpers in src/app/state/gameState.ts
T014 Apply viewport pan offsets to adventure-map rendering in src/render/canvas/renderMapScene.ts
T015 Implement middle-mouse drag handling and bounded pan updates in src/app/scene-controller/mapInputController.ts
```

---

## Parallel Example: User Story 3

```text
T024 Contract coverage for restored view state and click-target accuracy in tests/contract/viewport-interaction.contract.test.ts
T025 Integration coverage for viewport-based coordinate remapping and map-scene restoration in tests/integration/map/viewportInteractionFlow.test.ts
T026 Browser acceptance coverage for selecting and moving after zoom or pan in tests/acceptance/map-view-interaction.spec.ts

T027 Translate visible canvas coordinates back into world tiles through viewport state in src/engine/map/viewportMath.ts
T028 Update map click handling so navigation-aware selection and movement target the visible tile under the pointer in src/app/scene-controller/mapInputController.ts
T029 Preserve and restore adventure-map viewport state across scene changes in src/app/state/gameState.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate bounded map panning independently
5. Demo the navigation MVP before adding zoom and restored interaction behavior

### Incremental Delivery

1. Deliver shared viewport state and transform helpers
2. Deliver User Story 1 bounded panning as the MVP slice
3. Deliver User Story 2 cursor-focused zoom behavior
4. Deliver User Story 3 restored view state and reliable post-navigation interaction
5. Finish with verification and documentation cleanup

### Parallel Team Strategy

With multiple developers:

1. One developer prepares viewport state and math seams
2. Another developer can prepare contract and acceptance coverage once the interaction contract is clear
3. After Foundational completion:
   - Developer A: US1 pan behavior and pan tests
   - Developer B: US2 zoom behavior and zoom tests
   - Developer C: US3 interaction remapping and restored state tests

---

## Notes

- `[P]` tasks touch separate files and are candidates for concurrent work
- `[US1]`, `[US2]`, and `[US3]` preserve direct traceability back to the active spec
- The zoom-and-pan slice intentionally extends the current map engine rather than changing battle systems or adding a minimap
- Keep implementation aligned with `specs/004-map-zoom-pan/quickstart.md` as the executable demo flow

## Verification Record

- 2026-07-12: `npm run build` passed
- 2026-07-12: `npm test` passed
- 2026-07-12: `npm run test:viewport` passed
- 2026-07-12: `npm run verify:viewport` passed
- 2026-07-12: `npx playwright test` passed

## Consistency Notes

- The implementation matches the zoom-and-pan contracts: mouse-wheel zoom, middle-mouse drag panning, cursor-focused scaling, bounded viewport movement, and preserved map view state on return to the adventure scene.
- The quickstart now documents the dedicated viewport validation commands and the advanced terrain scenario as the preferred manual test surface.
- The viewport slice extends the existing map engine and keeps battle, terrain, and core-map gameplay behaviors working through the same map-state model.
