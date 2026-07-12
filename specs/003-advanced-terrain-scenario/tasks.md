# Tasks: Advanced Terrain Scenario

**Input**: Design documents from `/specs/003-advanced-terrain-scenario/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated validation tasks are included for every user story. The task list prioritizes contract, integration, and acceptance coverage for terrain resolution, blocked movement, and player-visible terrain feedback.

**Organization**: Tasks are grouped by user story to keep terrain movement, blocked-boundary rules, and terrain readability independently implementable and testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Existing single-project web application rooted at `src/` and `tests/`
- Terrain and route logic extend `src/engine/map/`
- Canvas rendering changes stay in `src/render/canvas/`
- Player-facing route feedback remains in `src/ui/` and `src/app/scene-controller/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repository and scenario workspace for a second gameplay slice without disrupting the current core-map-loop implementation

- [x] T001 Add terrain-feature verification notes and any missing script expectations for the new slice in `package.json`
- [x] T002 Create the new terrain scenario documentation placeholders already referenced by the plan in `specs/003-advanced-terrain-scenario/`
- [x] T003 [P] Add or update ignore coverage for generated terrain test artifacts in `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Introduce the shared terrain data structures, lookup seams, and scenario-loading support required before any terrain story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create terrain type, terrain region, resolved tile, and route-attempt definitions in `src/engine/scenario/types.ts`
- [x] T005 [P] Implement terrain-region normalization and precedence helpers in `src/engine/map/terrainRegions.ts`
- [x] T006 [P] Implement resolved tile lookup from region membership in `src/engine/map/terrainLookup.ts`
- [x] T007 [P] Implement direction and route legality helpers for 8-direction movement in `src/engine/map/routeRules.ts`
- [x] T008 [P] Extend scenario loading and validation for 64x64 region-defined terrain in `src/engine/scenario/loadScenario.ts`
- [x] T009 [P] Create the 64x64 advanced terrain scenario content in `src/content/scenarios/advanced-terrain-scenario.ts`
- [x] T010 Update the game-state bootstrap to choose the terrain scenario when this feature is active in `src/app/state/gameState.ts`
- [x] T011 Create foundational integration coverage for terrain-region resolution, 64x64 bounds, and deterministic tile lookup in `tests/integration/foundation/terrainScenarioLoad.test.ts`

**Checkpoint**: Terrain data and lookup foundation are ready for user-story implementation

---

## Phase 3: User Story 1 - Travel Across a Large Terrain Map (Priority: P1) MVP

**Goal**: Let the player move across a 64x64 terrain-aware scenario where roads, standard terrain, difficult terrain, and diagonal movement use the clarified movement-cost rules

**Independent Test**: Load the advanced terrain scenario, move the hero over road, plains or grass, mud or woods, and diagonal destinations, and verify that movement spends 1, 2, or 3 based on the destination terrain while preserving consistent state across turns

### Tests for User Story 1

- [x] T012 [P] [US1] Add contract coverage for terrain-aware movement cost feedback in `tests/contract/terrain-cost-feedback.contract.test.ts`
- [x] T013 [P] [US1] Add integration coverage for road, standard, difficult, and diagonal destination-cost spending in `tests/integration/map/terrainMovementCostFlow.test.ts`
- [x] T014 [P] [US1] Add browser acceptance coverage for moving across a 64x64 terrain map with mixed movement costs in `tests/acceptance/advanced-terrain-movement.spec.ts`

### Implementation for User Story 1

- [x] T015 [P] [US1] Extend hero movement execution to consume destination terrain cost from resolved tiles in `src/engine/map/heroActions.ts`
- [x] T016 [P] [US1] Integrate 8-direction adjacency and diagonal legality into movement validation in `src/engine/map/routeRules.ts`
- [x] T017 [P] [US1] Update remaining-movement and route-attempt state handling for terrain-aware movement in `src/app/state/gameState.ts`
- [x] T018 [P] [US1] Render a 64x64 terrain-driven map with distinct road, standard, and difficult tile classes in `src/render/canvas/renderMapScene.ts`
- [x] T019 [P] [US1] Update map click-to-move handling for terrain-aware destination selection on the larger grid in `src/app/scene-controller/mapInputController.ts`
- [x] T020 [US1] Wire terrain movement results and turn persistence into the map scene in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 1 should now provide a playable terrain-aware movement loop over the advanced scenario

---

## Phase 4: User Story 2 - Respect Blocked Terrain Boundaries (Priority: P2)

**Goal**: Enforce blocked mountains, lakes, rivers, and no implicit road-water crossings without spending movement on rejected attempts

**Independent Test**: Attempt orthogonal and diagonal movement into mountains, rivers, and lakes, including road-adjacent water boundaries, and verify every illegal move is rejected without changing position or remaining movement

### Tests for User Story 2

- [x] T021 [P] [US2] Add contract coverage for blocked-terrain rejection messaging in `tests/contract/blocked-terrain-feedback.contract.test.ts`
- [x] T022 [P] [US2] Add integration coverage for blocked mountains, rivers, lakes, and road-to-water rejection in `tests/integration/map/blockedTerrainFlow.test.ts`
- [x] T023 [P] [US2] Add browser acceptance coverage for blocked-terrain movement rejection on the large scenario in `tests/acceptance/blocked-terrain-boundaries.spec.ts`

### Implementation for User Story 2

- [x] T024 [P] [US2] Implement blocked-terrain and water-boundary checks using resolved tiles in `src/engine/map/routeRules.ts`
- [x] T025 [P] [US2] Extend movement failure handling so blocked moves preserve position and movement in `src/engine/map/heroActions.ts`
- [x] T026 [P] [US2] Encode river and lake non-crossing behavior even when roads border them in `src/engine/map/terrainLookup.ts`
- [x] T027 [P] [US2] Surface blocked-terrain failure reasons in the map overlay and message feed in `src/ui/overlays/errorOverlay.ts`
- [x] T028 [US2] Integrate blocked-boundary feedback into map scene updates in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Stories 1 and 2 should now provide consistent large-map movement with enforced impassable terrain

---

## Phase 5: User Story 3 - Read Terrain Information While Planning Routes (Priority: P3)

**Goal**: Make terrain categories and route consequences legible enough that players can predict low-cost, standard, difficult, and blocked movement outcomes before clicking

**Independent Test**: Open the advanced terrain scenario, inspect the rendered terrain classes, select candidate destinations, and verify the UI communicates terrain class, route cost, and blocked reasons clearly enough to support planning

### Tests for User Story 3

- [x] T029 [P] [US3] Add contract coverage for terrain legend and route-feedback presentation in `tests/contract/terrain-ux.contract.test.ts`
- [x] T030 [P] [US3] Add integration coverage for route-feedback generation from resolved terrain in `tests/integration/map/terrainFeedbackFlow.test.ts`
- [x] T031 [P] [US3] Add browser acceptance coverage for identifying terrain classes and understanding blocked moves in `tests/acceptance/terrain-readability.spec.ts`

### Implementation for User Story 3

- [x] T032 [P] [US3] Implement route-feedback derivation for terrain labels, movement cost, and blocked reasons in `src/engine/map/terrainFeedback.ts`
- [x] T033 [P] [US3] Render a terrain legend and route-preview helpers in `src/render/canvas/renderTerrainLegend.ts`
- [x] T034 [P] [US3] Add terrain legend and route-cost display to the HUD in `src/ui/hud/mapHud.ts`
- [x] T035 [P] [US3] Add terrain-preview and blocked-move explanation overlays in `src/ui/overlays/guardStatusOverlay.ts`
- [x] T036 [US3] Integrate terrain preview, legend, and move-explanation updates into the map scene controller in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: All user stories should now be independently functional, with terrain behavior both correct and understandable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish terrain-slice validation, cleanup, and documentation alignment

- [x] T037 [P] Add any shared terrain color constants and legend sprite helpers in `src/render/sprites/placeholders.ts`
- [x] T038 [P] Update the advanced terrain run instructions and scenario notes in `specs/003-advanced-terrain-scenario/quickstart.md`
- [x] T039 Run the full terrain verification flow and record results in `specs/003-advanced-terrain-scenario/tasks.md`
- [x] T040 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain consistent after implementation in `specs/003-advanced-terrain-scenario/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion and delivers the MVP
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds directly on US1 terrain movement
- **User Story 3 (Phase 5)**: Depends on Foundational completion and uses the terrain-resolution model established by US1
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational completion and is the MVP slice
- **User Story 2 (P2)**: Depends on the terrain-aware movement model created in US1
- **User Story 3 (P3)**: Depends on the terrain model from US1 and benefits from the blocked-move reasons added in US2

### Within Each User Story

- Add automated tests for the changed behavior before marking the story complete
- Prefer contract, integration, and acceptance tests over low-level helper-only coverage
- Build terrain resolution and route logic before scene and HUD wiring
- Finish player-visible feedback before considering the story complete
- Validate the story through its independent test before moving to the next phase

### Parallel Opportunities

- Foundational tasks marked `[P]` can run in parallel once type updates are in place
- For each story, contract, integration, and acceptance tests marked `[P]` can run in parallel
- Engine, rendering, and UI tasks touching separate files can be developed in parallel inside a story after the relevant shared model exists

---

## Parallel Example: User Story 1

```text
T012 Contract coverage for terrain-aware movement cost feedback in tests/contract/terrain-cost-feedback.contract.test.ts
T013 Integration coverage for road, standard, difficult, and diagonal destination-cost spending in tests/integration/map/terrainMovementCostFlow.test.ts
T014 Browser acceptance coverage for moving across a 64x64 terrain map with mixed movement costs in tests/acceptance/advanced-terrain-movement.spec.ts

T015 Extend hero movement execution to consume destination terrain cost from resolved tiles in src/engine/map/heroActions.ts
T016 Integrate 8-direction adjacency and diagonal legality into movement validation in src/engine/map/routeRules.ts
T018 Render a 64x64 terrain-driven map with distinct road, standard, and difficult tile classes in src/render/canvas/renderMapScene.ts
T019 Update map click-to-move handling for terrain-aware destination selection on the larger grid in src/app/scene-controller/mapInputController.ts
```

---

## Parallel Example: User Story 3

```text
T029 Contract coverage for terrain legend and route-feedback presentation in tests/contract/terrain-ux.contract.test.ts
T030 Integration coverage for route-feedback generation from resolved terrain in tests/integration/map/terrainFeedbackFlow.test.ts
T031 Browser acceptance coverage for identifying terrain classes and understanding blocked moves in tests/acceptance/terrain-readability.spec.ts

T032 Implement route-feedback derivation for terrain labels, movement cost, and blocked reasons in src/engine/map/terrainFeedback.ts
T033 Render a terrain legend and route-preview helpers in src/render/canvas/renderTerrainLegend.ts
T034 Add terrain legend and route-cost display to the HUD in src/ui/hud/mapHud.ts
T035 Add terrain-preview and blocked-move explanation overlays in src/ui/overlays/guardStatusOverlay.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate 64x64 terrain-aware movement through the listed tests
5. Demo the advanced terrain scenario before adding blocked-boundary polish and richer feedback

### Incremental Delivery

1. Deliver the shared terrain model and region lookup foundation
2. Deliver User Story 1 as the first playable terrain-aware map loop
3. Deliver User Story 2 blocked-terrain enforcement and water-boundary rules
4. Deliver User Story 3 terrain readability, legend, and route explanations
5. Finish with verification and documentation cleanup

### Parallel Team Strategy

With multiple developers:

1. One developer updates scenario types and loading
2. Another developer can build terrain rendering and legend support once the lookup seam exists
3. After Foundational completion:
   - Developer A: US1 movement-cost logic and movement tests
   - Developer B: US2 blocked-terrain rules and rejection messaging
   - Developer C: US3 terrain legend, route feedback, and browser readability flows

---

## Notes

- `[P]` tasks touch separate files and are candidates for concurrent work
- `[US1]`, `[US2]`, and `[US3]` preserve direct traceability back to the active spec
- The terrain slice intentionally extends the current map engine rather than changing battle systems or city systems
- Keep implementation aligned with `specs/003-advanced-terrain-scenario/quickstart.md` as the executable demo flow

## Verification Record

- 2026-07-12: `npm run build` passed
- 2026-07-12: `npm run test` passed
- 2026-07-12: `npm run test:terrain` passed
- 2026-07-12: `npx playwright test` passed
- 2026-07-12: `npx playwright test tests/acceptance/advanced-terrain-movement.spec.ts tests/acceptance/blocked-terrain-boundaries.spec.ts tests/acceptance/terrain-readability.spec.ts` passed

## Consistency Notes

- The implementation matches the terrain contracts: 64x64 map size, rectangle-based region precedence, road/plains-or-grass/mud-or-woods movement costs, and blocked mountains-lakes-rivers.
- The quickstart now documents the exact scenario query string and the terrain-specific verification command set.
- The legacy `core-map-loop` scenario remains intact so feature 003 extends the engine without regressing feature 002 behavior.
