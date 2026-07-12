# Tasks: Core Map Loop

**Input**: Design documents from `/specs/002-core-map-loop/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated validation tasks are included for each user story. The task list prefers integration, contract, and acceptance-style coverage to prove gameplay behavior through public seams.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each slice.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Single project web application rooted at `src/` and `tests/`
- Gameplay rules live in `src/engine/`
- Browser rendering and interaction live in `src/render/`, `src/ui/`, and `src/app/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the browser app, tooling, and top-level folders from the implementation plan

- [x] T001 Create `package.json`, `tsconfig.json`, `vite.config.ts`, and `playwright.config.ts` at the repository root
- [x] T002 Create the initial source and test directory structure under `src/` and `tests/` per `specs/002-core-map-loop/plan.md`
- [x] T003 [P] Configure npm scripts for `dev`, `build`, `test`, `test:acceptance`, and `verify` in `package.json`
- [x] T004 [P] Add the Vite app shell in `index.html` and `src/main.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build the shared engine, scenario-loading, and scene orchestration required by all user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create core gameplay type definitions for scenario, player, hero, unit, pickup, guard, battle, and victory state in `src/engine/scenario/types.ts`
- [x] T006 [P] Implement scenario content validation and loading in `src/engine/scenario/loadScenario.ts`
- [x] T007 [P] Create the handcrafted default scenario data in `src/content/scenarios/core-map-loop.ts`
- [x] T008 Implement the authoritative game-state store and transition dispatcher in `src/app/state/gameState.ts`
- [x] T009 [P] Implement scene switching between map, battle, and victory states in `src/app/scene-controller/sceneController.ts`
- [x] T010 [P] Implement shared map coordinate and path validation helpers in `src/engine/map/mapRules.ts`
- [x] T011 [P] Implement turn ownership and per-turn reset helpers in `src/engine/turn/turnEngine.ts`
- [x] T012 [P] Implement default elimination victory evaluation in `src/engine/victory/checkVictory.ts`
- [x] T013 Wire scenario loading, state bootstrapping, and the initial render loop in `src/app/bootstrap/startGame.ts`
- [x] T014 Create shared engine integration coverage for scenario loading, turn reset, and victory evaluation in `tests/integration/foundation/gameStateFlow.test.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in priority order

---

## Phase 3: User Story 1 - Take a Complete Turn on the Adventure Map (Priority: P1) MVP

**Goal**: Let the player move a hero on the map, collect pickups, and end a turn with state preserved

**Independent Test**: Start the default scenario, move the hero within movement allowance, collect a resource pickup, end the turn, and confirm state persists into the next turn

### Tests for User Story 1

- [x] T015 [P] [US1] Add contract coverage for map-view HUD state and hero movement interactions in `tests/contract/gameplay-ui.map.contract.test.ts`
- [x] T016 [P] [US1] Add integration coverage for movement allowance, pickup collection, and turn advancement in `tests/integration/map/mapTurnFlow.test.ts`
- [x] T017 [P] [US1] Add browser acceptance coverage for the playable map-turn flow in `tests/acceptance/map-turn-flow.spec.ts`

### Implementation for User Story 1

- [x] T018 [P] [US1] Implement hero selection, movement allowance checks, and pickup collection rules in `src/engine/map/heroActions.ts`
- [x] T019 [P] [US1] Implement player resource stockpile updates and pickup state transitions in `src/engine/map/pickupResolution.ts`
- [x] T020 [P] [US1] Render the map board, hero, pickups, and traversable tiles in `src/render/canvas/renderMapScene.ts`
- [x] T021 [P] [US1] Implement map click handling and hero selection input in `src/app/scene-controller/mapInputController.ts`
- [x] T022 [P] [US1] Build the map HUD for active hero, remaining movement, current side, and resources in `src/ui/hud/mapHud.ts`
- [x] T023 [US1] Integrate map input, map rendering, and turn-ending behavior into the active map scene in `src/app/scene-controller/mapScene.ts`
- [x] T024 [US1] Add the end-turn control and turn transition wiring in `src/ui/panels/endTurnPanel.ts`

**Checkpoint**: User Story 1 should now be playable and independently testable as the MVP

---

## Phase 4: User Story 2 - Defeat Guards to Open the Map (Priority: P2)

**Goal**: Let the player challenge stationary guards and unlock blocked objectives after victory

**Independent Test**: Move the hero to a guarded location, trigger a guard battle, win or lose the encounter, and verify the location remains blocked or becomes accessible based on the result

### Tests for User Story 2

- [x] T025 [P] [US2] Add contract coverage for guarded-location blocking and post-battle accessibility in `tests/contract/gameplay-ui.guards.contract.test.ts`
- [x] T026 [P] [US2] Add integration coverage for guarded location entry, blocked access, and guard defeat updates in `tests/integration/map/guardedLocationFlow.test.ts`
- [x] T027 [P] [US2] Add browser acceptance coverage for clearing a guarded location from the map in `tests/acceptance/guarded-location.spec.ts`

### Implementation for User Story 2

- [x] T028 [P] [US2] Implement guard-force and guarded-location state transitions in `src/engine/map/guardRules.ts`
- [x] T029 [P] [US2] Implement map-to-battle encounter creation for guarded locations in `src/engine/map/startGuardEncounter.ts`
- [x] T030 [P] [US2] Render blocked and cleared guarded locations distinctly in `src/render/canvas/renderGuardedLocations.ts`
- [x] T031 [P] [US2] Add guarded-location status messaging and outcome feedback in `src/ui/overlays/guardStatusOverlay.ts`
- [x] T032 [US2] Integrate guarded-location checks into the map action flow in `src/app/scene-controller/mapScene.ts`
- [x] T033 [US2] Apply post-battle location unlocking and ownership updates in `src/app/state/applyBattleOutcome.ts`

**Checkpoint**: User Stories 1 and 2 should both work, with guarded objectives gating map progress

---

## Phase 5: User Story 3 - Resolve a Minimal Tactical Battle (Priority: P3)

**Goal**: Provide a minimal tactical battle loop with agility-based turn order, one action per unit turn, and scenario updates on victory or defeat

**Independent Test**: Trigger battle from a guarded location, confirm queue ordering by agility, take one action per unit turn, resolve one side's defeat, and return the result to the map or victory screen

### Tests for User Story 3

- [x] T034 [P] [US3] Add contract coverage for battle queue display and one-action-per-turn behavior in `tests/contract/gameplay-ui.battle.contract.test.ts`
- [x] T035 [P] [US3] Add integration coverage for battle queue ordering, action resolution, and battle completion in `tests/integration/battle/battleEngineFlow.test.ts`
- [x] T036 [P] [US3] Add browser acceptance coverage for winning a guard battle and returning to the map in `tests/acceptance/battle-resolution.spec.ts`

### Implementation for User Story 3

- [x] T037 [P] [US3] Implement battle initialization, participant collection, and agility queue sorting in `src/engine/battle/createBattle.ts`
- [x] T038 [P] [US3] Implement one-action-per-turn battle resolution and queue advancement in `src/engine/battle/battleTurnEngine.ts`
- [x] T039 [P] [US3] Implement battle defeat detection, hero experience rewards, and outcome construction in `src/engine/battle/resolveBattleOutcome.ts`
- [x] T040 [P] [US3] Render the battle board, units, active turn, and queue in `src/render/canvas/renderBattleScene.ts`
- [x] T041 [P] [US3] Implement battle input handling and legal action selection in `src/app/scene-controller/battleInputController.ts`
- [x] T042 [P] [US3] Build battle overlays for queue order, active unit, and action prompts in `src/ui/overlays/battleHud.ts`
- [x] T043 [US3] Integrate battle scene lifecycle, action dispatch, and return-to-map flow in `src/app/scene-controller/battleScene.ts`
- [x] T044 [US3] Trigger default elimination victory from battle and end-of-turn resolution in `src/app/scene-controller/checkScenarioEnd.ts`

**Checkpoint**: All user stories should now be independently functional and playable in sequence

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish quality, workflow validation, and cross-story refinements

- [x] T045 [P] Add placeholder sprite or shape definitions shared by map and battle rendering in `src/render/sprites/placeholders.ts`
- [x] T046 Improve cross-scene error states and invalid-scenario feedback in `src/ui/overlays/errorOverlay.ts`
- [x] T047 [P] Update the implementation run instructions and verification notes in `specs/002-core-map-loop/quickstart.md`
- [x] T048 Run the full verification flow and document final results in `specs/002-core-map-loop/tasks.md`
- [x] T049 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain consistent after implementation in `specs/002-core-map-loop/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and uses the map flow from User Story 1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and is required to fully satisfy User Story 2 guarded encounters
- **Polish (Phase 6)**: Depends on the desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational completion and is the MVP slice
- **User Story 2 (P2)**: Depends on User Story 1 map interactions and on User Story 3 battle capability for the win path
- **User Story 3 (P3)**: Can be built after Foundational completion, but it is most useful once User Story 1 map flow exists to launch encounters

### Within Each User Story

- Write automated tests for changed behavior before marking the story complete
- Prefer contract, integration, and acceptance tests over low-level isolated helpers
- Implement engine rules before scene orchestration
- Implement rendering and UI adapters before the final scene wiring task
- Validate the story through its independent test before moving on

### Parallel Opportunities

- Setup tasks marked `[P]` can run in parallel after the initial project files exist
- In Foundational, scenario loading, scene switching, map helpers, turn helpers, and victory helpers can be built in parallel after type definitions exist
- For each story, tests marked `[P]` can run in parallel
- Engine, rendering, and UI tasks marked `[P]` within the same story can run in parallel when they touch separate files

---

## Parallel Example: User Story 1

```text
T015 Contract coverage for map-view HUD state and hero movement interactions in tests/contract/gameplay-ui.map.contract.test.ts
T016 Integration coverage for movement allowance, pickup collection, and turn advancement in tests/integration/map/mapTurnFlow.test.ts
T017 Browser acceptance coverage for the playable map-turn flow in tests/acceptance/map-turn-flow.spec.ts

T018 Implement hero selection, movement allowance checks, and pickup collection rules in src/engine/map/heroActions.ts
T019 Implement player resource stockpile updates and pickup state transitions in src/engine/map/pickupResolution.ts
T020 Render the map board, hero, pickups, and traversable tiles in src/render/canvas/renderMapScene.ts
T021 Implement map click handling and hero selection input in src/app/scene-controller/mapInputController.ts
T022 Build the map HUD for active hero, remaining movement, current side, and resources in src/ui/hud/mapHud.ts
```

---

## Parallel Example: User Story 3

```text
T034 Contract coverage for battle queue display and one-action-per-turn behavior in tests/contract/gameplay-ui.battle.contract.test.ts
T035 Integration coverage for battle queue ordering, action resolution, and battle completion in tests/integration/battle/battleEngineFlow.test.ts
T036 Browser acceptance coverage for winning a guard battle and returning to the map in tests/acceptance/battle-resolution.spec.ts

T037 Implement battle initialization, participant collection, and agility queue sorting in src/engine/battle/createBattle.ts
T038 Implement one-action-per-turn battle resolution and queue advancement in src/engine/battle/battleTurnEngine.ts
T039 Implement battle defeat detection, hero experience rewards, and outcome construction in src/engine/battle/resolveBattleOutcome.ts
T040 Render the battle board, units, active turn, and queue in src/render/canvas/renderBattleScene.ts
T041 Implement battle input handling and legal action selection in src/app/scene-controller/battleInputController.ts
T042 Build battle overlays for queue order, active unit, and action prompts in src/ui/overlays/battleHud.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate movement, pickup collection, and turn passing through the listed tests
5. Demo the map loop before adding guards or battle depth

### Incremental Delivery

1. Deliver Setup + Foundational as the reusable base for all gameplay
2. Deliver User Story 1 as the first playable map loop
3. Deliver User Story 3 battle mechanics and wire them into User Story 2 guarded encounters
4. Deliver User Story 2 guarded progression with the completed battle outcome flow
5. Finish with Polish and full verification

### Parallel Team Strategy

With multiple developers:

1. One developer completes the bootstrap and state foundation
2. A second developer can prepare scenario content and map rendering once core types exist
3. After Foundational completion:
   - Developer A: User Story 1 map rules and HUD
   - Developer B: User Story 3 battle engine and battle rendering
   - Developer C: User Story 2 guarded-location integration and acceptance flows

---

## Notes

- `[P]` tasks touch separate files and are candidates for concurrent work
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the spec
- User Story 2 depends on battle capability for its successful path, even though it remains a distinct slice in the spec
- Keep implementation aligned with `specs/002-core-map-loop/quickstart.md` as the executable demo flow
- Verification completed successfully with `npm run build` and `npm run verify` on 2026-07-12.
