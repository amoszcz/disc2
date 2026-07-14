# Tasks: Pathfinding Route Preview

**Input**: Design documents from `/specs/006-pathfinding-route/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated validation tasks are included for every behavior-changing story. The task list favors contract, integration, and acceptance coverage for weighted route calculation, preview confirmation, partial traversal, and cross-turn route persistence.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g. [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- Existing single-project web application rooted at `src/` and `tests/`
- Pathfinding engine work extends `src/engine/map/` and `src/engine/scenario/`
- Click-confirmation and route persistence state changes stay in `src/app/`
- Route preview rendering and explanation stay in `src/render/` and `src/ui/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repository and feature workspace for the route-preview slice

- [x] T001 Add pathfinding-specific verification notes or scripts in `package.json`
- [x] T002 Ensure the active feature documentation set is present and aligned in `specs/006-pathfinding-route/`
- [x] T003 [P] Update generated-artifact ignore coverage if needed for route-preview acceptance outputs in `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Introduce the shared path-preview state and weighted route seams required before any user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create route-preview, route-step, and route-progress definitions in `src/engine/scenario/types.ts`
- [x] T005 [P] Implement reusable preview-state helpers for ownership, replacement, and completion in `src/engine/map/routePreviewState.ts`
- [x] T006 [P] Implement weighted pathfinding and neighbor expansion using current movement legality rules in `src/engine/map/routePathfinding.ts`
- [x] T007 [P] Extend route and movement helpers for multi-step traversal and continuation seams in `src/engine/map/heroActions.ts`
- [x] T008 [P] Extend game state initialization and turn-state preservation for route previews in `src/app/state/gameState.ts`
- [x] T009 Create foundational integration coverage for route-preview state and weighted route resolution in `tests/integration/foundation/routePreviewStateFlow.test.ts`

**Checkpoint**: Shared route-preview state and weighted route computation are ready for story implementation

---

## Phase 3: User Story 1 - Preview A Reachable Route (Priority: P1) MVP

**Goal**: Let the player click a destination once to preview the shortest legal route without spending movement

**Independent Test**: Select a hero, click reachable and unreachable destinations, and confirm the shortest legal route is previewed only when one exists and is replaced when a different destination is chosen

### Tests for User Story 1

- [x] T010 [P] [US1] Add contract coverage for route-preview ownership and replacement state in `tests/contract/route-preview-state.contract.test.ts`
- [x] T011 [P] [US1] Add integration coverage for reachable and unreachable route plotting in `tests/integration/map/routePreviewFlow.test.ts`
- [x] T012 [P] [US1] Add browser acceptance coverage for first-click route preview in `tests/acceptance/route-preview.spec.ts`

### Implementation for User Story 1

- [x] T013 [P] [US1] Extend map click handling to plot or replace preview routes without moving the hero in `src/app/scene-controller/mapInputController.ts`
- [x] T014 [P] [US1] Implement route-preview feedback and invalid-destination reporting in `src/engine/map/terrainFeedback.ts`
- [x] T015 [P] [US1] Render dotted route previews and destination markers in `src/render/canvas/renderMapScene.ts`
- [x] T016 [US1] Surface active route preview details in `src/ui/hud/mapHud.ts`
- [x] T017 [US1] Wire preview-specific sidebar messaging into `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 1 should now provide preview-only route plotting and replacement behavior

---

## Phase 4: User Story 2 - Commit Movement Along The Previewed Route (Priority: P1)

**Goal**: Let the player click the same previewed destination again to move along the stored route, stopping on the last affordable legal step when needed

**Independent Test**: Plot a route, click the same destination again, and confirm the hero follows the displayed route, finishing fully or partially based on remaining movement

### Tests for User Story 2

- [x] T018 [P] [US2] Add contract coverage for confirmation and partial traversal outcomes in `tests/contract/route-confirmation.contract.test.ts`
- [x] T019 [P] [US2] Add integration coverage for confirmed route execution and partial movement in `tests/integration/map/routeCommitFlow.test.ts`
- [x] T020 [P] [US2] Add browser acceptance coverage for second-click route confirmation in `tests/acceptance/route-confirmation.spec.ts`

### Implementation for User Story 2

- [x] T021 [P] [US2] Implement route confirmation and partial traversal execution in `src/engine/map/heroActions.ts`
- [x] T022 [P] [US2] Extend input handling to distinguish preview clicks from confirmation clicks in `src/app/scene-controller/mapInputController.ts`
- [x] T023 [P] [US2] Extend route pathfinding and route rules to expose step-by-step movement cost sequences in `src/engine/map/routePathfinding.ts`
- [x] T024 [US2] Surface partial traversal outcomes and remaining-route messaging in `src/ui/overlays/guardStatusOverlay.ts`
- [x] T025 [US2] Integrate post-movement route completion or retention into map scene updates in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Stories 1 and 2 should now provide preview, confirmation, and partial route traversal

---

## Phase 5: User Story 3 - Continue A Planned Journey Across Turns (Priority: P2)

**Goal**: Keep unfinished plotted routes visible across turns and allow the player to continue or replace them later

**Independent Test**: Plot a route longer than one turn, confirm partial travel, end the turn, and verify the route remains visible and can be continued or replaced on a later turn

### Tests for User Story 3

- [x] T026 [P] [US3] Add contract coverage for route persistence, revalidation, and ownership across turns in `tests/contract/route-persistence.contract.test.ts`
- [x] T027 [P] [US3] Add integration coverage for cross-turn continuation and replacement in `tests/integration/map/routePersistenceFlow.test.ts`
- [x] T028 [P] [US3] Add browser acceptance coverage for multi-turn route continuation in `tests/acceptance/route-persistence.spec.ts`

### Implementation for User Story 3

- [x] T029 [P] [US3] Preserve and revalidate unfinished route previews across turn changes in `src/app/state/gameState.ts`
- [x] T030 [P] [US3] Extend end-turn and hero-selection behavior to retain, invalidate, or replace route ownership correctly in `src/engine/turn/turnEngine.ts`
- [x] T031 [P] [US3] Keep persistent route rendering and destination markers visible after turn changes in `src/render/canvas/renderMapScene.ts`
- [x] T032 [US3] Extend HUD messaging for continuation-ready routes and invalidated persisted routes in `src/ui/hud/mapHud.ts`
- [x] T033 [US3] Integrate cross-turn continuation and replacement flow in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: All user stories should now be independently functional with preview, confirmation, and multi-turn continuation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish validation, cleanup, and documentation alignment across the pathfinding slice

- [x] T034 [P] Add any shared route-preview visual constants or sprite helpers in `src/render/sprites/placeholders.ts`
- [x] T035 [P] Update route-preview run instructions and scenario notes in `specs/006-pathfinding-route/quickstart.md`
- [x] T036 Run the full route-preview verification flow and record results in `specs/006-pathfinding-route/tasks.md`
- [x] T037 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain consistent after implementation in `specs/006-pathfinding-route/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion and delivers the MVP
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds on the stored preview state introduced for US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and relies on the preview and confirmation seams from US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational completion and is the MVP slice
- **User Story 2 (P1)**: Depends on the preview-state and weighted path seams established in US1
- **User Story 3 (P2)**: Depends on the preview and confirmation model from US1 and US2

### Within Each User Story

- Add automated tests for changed behavior before marking the story complete
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Build shared route state and pathfinding seams before controller and rendering integration
- Finish player-visible feedback before considering a story complete
- Validate each story through its independent test before moving to the next phase

### Parallel Opportunities

- Foundational tasks marked `[P]` can run in parallel after the type updates are in place
- Within each story, contract, integration, and acceptance tests marked `[P]` can run in parallel
- Engine, rendering, and UI tasks touching separate files can run in parallel once the shared seams exist

---

## Parallel Example: User Story 1

```text
T010 Contract coverage for route-preview ownership and replacement state in tests/contract/route-preview-state.contract.test.ts
T011 Integration coverage for reachable and unreachable route plotting in tests/integration/map/routePreviewFlow.test.ts
T012 Browser acceptance coverage for first-click route preview in tests/acceptance/route-preview.spec.ts

T013 Extend map click handling to plot or replace preview routes without moving the hero in src/app/scene-controller/mapInputController.ts
T014 Implement route-preview feedback and invalid-destination reporting in src/engine/map/terrainFeedback.ts
T015 Render dotted route previews and destination markers in src/render/canvas/renderMapScene.ts
```

---

## Parallel Example: User Story 3

```text
T026 Contract coverage for route persistence, revalidation, and ownership across turns in tests/contract/route-persistence.contract.test.ts
T027 Integration coverage for cross-turn continuation and replacement in tests/integration/map/routePersistenceFlow.test.ts
T028 Browser acceptance coverage for multi-turn route continuation in tests/acceptance/route-persistence.spec.ts

T029 Preserve and revalidate unfinished route previews across turn changes in src/app/state/gameState.ts
T030 Extend end-turn and hero-selection behavior to retain, invalidate, or replace route ownership correctly in src/engine/turn/turnEngine.ts
T031 Keep persistent route rendering and destination markers visible after turn changes in src/render/canvas/renderMapScene.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate route preview and replacement independently
5. Demo the preview-only MVP before adding movement confirmation and cross-turn continuation

### Incremental Delivery

1. Deliver shared route-preview state and weighted pathfinding seams
2. Deliver User Story 1 route plotting and replacement as the MVP slice
3. Deliver User Story 2 route confirmation and partial traversal
4. Deliver User Story 3 cross-turn route continuation and replacement
5. Finish with verification and documentation cleanup

### Parallel Team Strategy

With multiple developers:

1. One developer prepares route-preview state and weighted pathfinding seams
2. Another developer can prepare contract and acceptance coverage once the route-preview contracts are clear
3. After Foundational completion:
   - Developer A: US1 route preview and tests
   - Developer B: US2 route confirmation and tests
   - Developer C: US3 cross-turn continuation and tests

---

## Notes

- `[P]` tasks touch separate files and are candidates for concurrent work
- `[US1]`, `[US2]`, and `[US3]` preserve direct traceability back to the active spec
- The route-preview slice intentionally extends the current terrain-aware movement engine rather than adding automation or queue systems
- Keep implementation aligned with `specs/006-pathfinding-route/quickstart.md` as the executable demo flow

## Verification Results

- [x] `npm test`
- [x] `npm run verify:pathfinding`
- [x] `npm run test:acceptance`

## Consistency Notes

- [x] Preview-first click handling, second-click confirmation, and cross-turn continuation remain aligned across `spec.md`, `plan.md`, `data-model.md`, and `contracts/`.
- [x] The first slice remains limited to one selected hero at a time without automated marching or multi-hero queueing.
- [x] Routefinding uses total legal movement cost and reuses the existing terrain and movement-object legality model.
- [x] The quickstart now points to the dedicated pathfinding verification scripts and the advanced terrain demo scenario.
