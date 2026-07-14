# Tasks: Pathfinding Route Preview

**Input**: Design documents from `/specs/006-pathfinding-route/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract, integration, and acceptance coverage for each behavior-changing story in this feature.

**Organization**: Tasks are grouped by user story so each slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel with other `[P]` tasks in the same phase
- **[Story]**: Maps work to a specific user story from `spec.md`
- Every task includes the primary file path to change

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare docs, scripts, and feature-scoped verification entry points

- [x] T001 Update pathfinding verification scripts in `package.json`
- [x] T002 Align feature quickstart and task execution notes in `specs/006-pathfinding-route/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared route state, weighted pathfinding, and type seams needed by every story

**CRITICAL**: No user story work should start before this phase is complete

- [x] T003 Extend route preview and progress types for confirmation, cancellation, persistence, and auto-advance in `src/engine/scenario/types.ts`
- [x] T004 [P] Implement route preview ownership, clearing, replacement, and persistence helpers in `src/engine/map/routePreviewState.ts`
- [x] T005 [P] Implement weighted shortest-path calculation using current legality and movement-cost rules in `src/engine/map/routePathfinding.ts`
- [x] T006 [P] Extend route movement helpers for stepwise traversal and partial progress results in `src/engine/map/heroActions.ts`
- [x] T007 [P] Preserve route preview state in runtime state transitions in `src/app/state/gameState.ts`
- [x] T008 Add foundational route-preview state coverage in `tests/integration/foundation/routePreviewStateFlow.test.ts`

**Checkpoint**: Shared route state and weighted pathfinding are ready for player-facing behavior

---

## Phase 3: User Story 1 - Preview A Reachable Route (Priority: P1) MVP

**Goal**: Let the player click a destination once to preview the shortest legal route, replace it with a new destination, or clear it by clicking the owning hero

**Independent Test**: Select a hero, click reachable and unreachable destinations, replace the destination once, click the same hero to clear the route, and confirm no movement happens during preview interactions

### Tests for User Story 1

- [x] T009 [P] [US1] Add route preview ownership and clear-state contract coverage in `tests/contract/route-preview-state.contract.test.ts`
- [x] T010 [P] [US1] Add reachable, unreachable, replacement, and hero-click clear integration coverage in `tests/integration/map/routePreviewFlow.test.ts`
- [x] T011 [P] [US1] Add browser route preview and clear interaction coverage in `tests/acceptance/route-preview.spec.ts`

### Implementation for User Story 1

- [x] T012 [P] [US1] Handle preview plotting, destination replacement, and hero-click route clearing in `src/app/scene-controller/mapInputController.ts`
- [x] T013 [P] [US1] Surface unreachable-preview and preview-only feedback in `src/engine/map/terrainFeedback.ts`
- [x] T014 [P] [US1] Render dotted route previews and destination markers on the map in `src/render/canvas/renderMapScene.ts`
- [x] T015 [US1] Show route preview ownership and preview status in `src/ui/hud/mapHud.ts`
- [x] T016 [US1] Sync preview-only route updates into scene state in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 1 is independently playable as a non-committing route preview loop

---

## Phase 4: User Story 2 - Commit Movement Along The Previewed Route (Priority: P1)

**Goal**: Let the player confirm a plotted route with a second click and move as far along it as current movement allows

**Independent Test**: Plot a route, click the same destination again, and confirm the hero follows the plotted step order, either finishing or stopping on the last affordable legal tile

### Tests for User Story 2

- [x] T017 [P] [US2] Add route confirmation and partial-traversal contract coverage in `tests/contract/route-confirmation.contract.test.ts`
- [x] T018 [P] [US2] Add confirmed route execution and partial movement integration coverage in `tests/integration/map/routeCommitFlow.test.ts`
- [x] T019 [P] [US2] Add browser second-click confirmation coverage in `tests/acceptance/route-confirmation.spec.ts`

### Implementation for User Story 2

- [x] T020 [P] [US2] Execute confirmed route traversal and partial progress in `src/engine/map/heroActions.ts`
- [x] T021 [P] [US2] Distinguish preview clicks from confirmation clicks and reject stale ownership in `src/app/scene-controller/mapInputController.ts`
- [x] T022 [P] [US2] Expose ordered step costs and continuation metadata from pathfinding in `src/engine/map/routePathfinding.ts`
- [x] T023 [US2] Show partial-movement and insufficient-movement feedback in `src/ui/overlays/guardStatusOverlay.ts`
- [x] T024 [US2] Apply route completion-or-retention updates after movement in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Stories 1 and 2 together provide preview, confirm, and partial traversal behavior

---

## Phase 5: User Story 3 - Continue A Planned Journey Across Turns (Priority: P2)

**Goal**: Keep unfinished routes visible across turns, auto-advance them at end turn when possible, and allow later continuation or replacement

**Independent Test**: Plot a route longer than one turn, confirm partial travel, end the turn, verify auto-advance occurs as far as legal movement allows, then continue the same route or replace it on a later turn

### Tests for User Story 3

- [x] T025 [P] [US3] Add route persistence and end-turn auto-advance contract coverage in `tests/contract/route-persistence.contract.test.ts`
- [x] T026 [P] [US3] Add cross-turn continuation, revalidation, and auto-advance integration coverage in `tests/integration/map/routePersistenceFlow.test.ts`
- [x] T027 [P] [US3] Add browser persistence and end-turn route continuation coverage in `tests/acceptance/route-persistence.spec.ts`

### Implementation for User Story 3

- [x] T028 [P] [US3] Preserve, revalidate, and continue unfinished route previews across turns in `src/app/state/gameState.ts`
- [x] T029 [P] [US3] Advance active routes during end turn and stop on the last legal affordable step in `src/engine/turn/turnEngine.ts`
- [x] T030 [P] [US3] Keep unfinished routes visible after turn changes and reflect completion or invalidation in `src/render/canvas/renderMapScene.ts`
- [x] T031 [US3] Show continuation, auto-advance, and invalidated-route status in `src/ui/hud/mapHud.ts`
- [x] T032 [US3] Coordinate end-turn route continuation and destination replacement in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: All three user stories are independently testable, including persistent and auto-advancing routes

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final visual polish, verification, and artifact consistency

- [x] T033 [P] Add shared route marker and dotted-line rendering helpers in `src/render/sprites/placeholders.ts`
- [x] T034 [P] Update route UX wording and player feedback details in `specs/006-pathfinding-route/contracts/route-preview-ux.md`
- [x] T035 Run pathfinding-focused verification commands documented in `specs/006-pathfinding-route/quickstart.md`
- [x] T036 Verify `spec.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/006-pathfinding-route/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all story work
- **Phase 3: US1**: Depends on Phase 2 and delivers the MVP
- **Phase 4: US2**: Depends on Phase 2 and builds on the preview state delivered by US1
- **Phase 5: US3**: Depends on Phase 2 and relies on preview and confirmation behavior from US1 and US2
- **Phase 6: Polish**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after foundational work
- **US2**: Depends on the preview ownership and stored-route behavior introduced in US1
- **US3**: Depends on the stored-route confirmation and partial progress behavior introduced in US2

### Within Each User Story

- Write behavior-level tests before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Finish engine/state seams before wiring controller, rendering, and HUD updates
- Validate each story against its independent test before moving forward

### Parallel Opportunities

- `T004`, `T005`, `T006`, and `T007` can run in parallel after `T003`
- Test tasks within each story marked `[P]` can run in parallel
- Engine, render, and HUD tasks marked `[P]` can run in parallel once shared seams exist

---

## Parallel Example: User Story 1

```text
T009 Add route preview ownership and clear-state contract coverage in tests/contract/route-preview-state.contract.test.ts
T010 Add reachable, unreachable, replacement, and hero-click clear integration coverage in tests/integration/map/routePreviewFlow.test.ts
T011 Add browser route preview and clear interaction coverage in tests/acceptance/route-preview.spec.ts

T012 Handle preview plotting, destination replacement, and hero-click route clearing in src/app/scene-controller/mapInputController.ts
T013 Surface unreachable-preview and preview-only feedback in src/engine/map/terrainFeedback.ts
T014 Render dotted route previews and destination markers on the map in src/render/canvas/renderMapScene.ts
```

---

## Parallel Example: User Story 3

```text
T025 Add route persistence and end-turn auto-advance contract coverage in tests/contract/route-persistence.contract.test.ts
T026 Add cross-turn continuation, revalidation, and auto-advance integration coverage in tests/integration/map/routePersistenceFlow.test.ts
T027 Add browser persistence and end-turn route continuation coverage in tests/acceptance/route-persistence.spec.ts

T028 Preserve, revalidate, and continue unfinished route previews across turns in src/app/state/gameState.ts
T029 Advance active routes during end turn and stop on the last legal affordable step in src/engine/turn/turnEngine.ts
T030 Keep unfinished routes visible after turn changes and reflect completion or invalidation in src/render/canvas/renderMapScene.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate route preview, replacement, and hero-click clear behavior independently

### Incremental Delivery

1. Build shared route-state and weighted pathfinding seams
2. Deliver US1 preview and cancellation as the MVP
3. Deliver US2 confirmation and partial traversal
4. Deliver US3 persistence, revalidation, and end-turn auto-advance
5. Finish with cross-cutting polish and verification

### Parallel Team Strategy

1. One developer prepares foundational route state and pathfinding seams
2. Another developer can prepare behavior-level tests once the contracts are stable
3. After the foundational phase:
   - Developer A: US1 preview and clear flow
   - Developer B: US2 confirmation and traversal flow
   - Developer C: US3 persistence and auto-advance flow

---

## Notes

- `[P]` tasks are good candidates for parallel execution because they target separate files or seams
- `[US1]`, `[US2]`, and `[US3]` maintain traceability back to the feature spec
- The current `plan.md` is still a template stub, so this task list is grounded in `spec.md`, `research.md`, `data-model.md`, `contracts/`, and the existing repo structure

## Verification Results

- [x] `npm run test:pathfinding`
- [x] `npm run verify:pathfinding`
- [x] `npm run build`
