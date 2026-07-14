# Tasks: Bridges and Movement Objects

**Input**: Design documents from `/specs/005-bridge-movement-objects/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Automated validation tasks are included for every behavior-changing story. The task list favors contract, integration, and acceptance coverage for movement-object region authoring, bridge validation, stacked movement effects, and player-visible route feedback.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g. [US1], [US2], [US3])
- Include exact file paths in descriptions

## Path Conventions

- Existing single-project web application rooted at `src/` and `tests/`
- Movement-object rules extend `src/engine/map/` and `src/engine/scenario/`
- Scenario content changes stay in `src/content/scenarios/`
- Player-facing movement-object rendering and feedback stay in `src/render/` and `src/ui/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the repository and active feature workspace for a movement-object slice on top of the existing terrain system

- [x] T001 Add movement-object verification notes or scripts for the new slice in `package.json`
- [x] T002 Ensure the active feature documentation set is present and aligned in `specs/005-bridge-movement-objects/`
- [x] T003 [P] Update generated-artifact ignore coverage if needed for movement-object acceptance outputs in `.gitignore`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Introduce the shared movement-object data structures, validation seams, and tile-resolution hooks required before any user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create movement-object region, object-type, resolved stack, and movement-feedback definitions in `src/engine/scenario/types.ts`
- [x] T005 [P] Implement movement-object region normalization and overlap ordering helpers in `src/engine/map/movementObjectRegions.ts`
- [x] T006 [P] Implement movement-object tile lookup and stacking resolution in `src/engine/map/movementObjectLookup.ts`
- [x] T007 [P] Implement combined passability and final-cost application rules in `src/engine/map/movementObjectRules.ts`
- [x] T008 [P] Extend scenario loading and validation for movement-object regions and invalid bridge placement checks in `src/engine/scenario/loadScenario.ts`
- [x] T009 [P] Create a scenario content variant with bridge, milestone, and rubble object regions in `src/content/scenarios/advanced-terrain-scenario.ts`
- [x] T010 Create foundational integration coverage for movement-object region resolution and scenario validation in `tests/integration/foundation/movementObjectScenarioLoad.test.ts`

**Checkpoint**: Shared movement-object model and validation seams are ready for story implementation

---

## Phase 3: User Story 1 - Cross Rivers Through Bridges (Priority: P1) MVP

**Goal**: Let the player cross rivers only where bridge object regions explicitly make those tiles traversable

**Independent Test**: Load a scenario with bridged and unbridged river sections, attempt both moves, and confirm only the bridged route becomes legal

### Tests for User Story 1

- [x] T011 [P] [US1] Add contract coverage for bridge-region authoring and validation in `tests/contract/movement-object-format.contract.test.ts`
- [x] T012 [P] [US1] Add integration coverage for bridged versus unbridged river movement in `tests/integration/map/bridgeCrossingFlow.test.ts`
- [x] T013 [P] [US1] Add browser acceptance coverage for bridge-enabled river crossings in `tests/acceptance/bridge-crossing.spec.ts`

### Implementation for User Story 1

- [x] T014 [P] [US1] Extend route resolution to make bridge-covered river tiles traversable with bridge cost in `src/engine/map/movementObjectRules.ts`
- [x] T015 [P] [US1] Integrate bridge-aware resolved movement tiles into hero movement execution in `src/engine/map/heroActions.ts`
- [x] T016 [P] [US1] Update route validation to preserve blocked behavior on unbridged river tiles in `src/engine/map/routeRules.ts`
- [x] T017 [US1] Wire bridge-aware movement outcomes into map scene updates and message flow in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: User Story 1 should now provide legal bridge crossings and blocked unbridged rivers

---

## Phase 4: User Story 2 - Encounter Static Objects That Change Movement Cost (Priority: P2)

**Goal**: Let milestone and rubble object regions modify final movement cost, including deterministic stacking with other supported movement objects

**Independent Test**: Load a scenario with milestone, rubble, and overlapping object regions, move across them, and confirm the final cost reflects the combined supported effects

### Tests for User Story 2

- [x] T018 [P] [US2] Add contract coverage for stacked movement-object resolution in `tests/contract/movement-object-stacking.contract.test.ts`
- [x] T019 [P] [US2] Add integration coverage for milestone, rubble, and stacked-cost movement in `tests/integration/map/movementObjectCostFlow.test.ts`
- [x] T020 [P] [US2] Add browser acceptance coverage for movement-cost changes caused by object regions in `tests/acceptance/movement-object-costs.spec.ts`

### Implementation for User Story 2

- [x] T021 [P] [US2] Add milestone and rubble effect application plus final-cost clamping in `src/engine/map/movementObjectRules.ts`
- [x] T022 [P] [US2] Extend movement-object lookup to return deterministic multi-object stacks per tile in `src/engine/map/movementObjectLookup.ts`
- [x] T023 [P] [US2] Update resolved movement feedback generation for stacked cost modifiers in `src/engine/map/terrainFeedback.ts`
- [x] T024 [US2] Surface stacked movement-object outcomes in map HUD or overlay state in `src/ui/hud/mapHud.ts`

**Checkpoint**: User Stories 1 and 2 should now provide bridge legality and stacked movement-cost modifiers

---

## Phase 5: User Story 3 - Understand Why Map Objects Change Movement (Priority: P3)

**Goal**: Make bridges, milestones, rubble, and their combined route effects legible from the map and movement feedback

**Independent Test**: Open a scenario with visible movement-object regions, inspect the map and route feedback, and verify the player can tell why a route is newly legal, cheaper, or more expensive

### Tests for User Story 3

- [x] T025 [P] [US3] Add contract coverage for movement-object readability and feedback in `tests/contract/movement-object-ux.contract.test.ts`
- [x] T026 [P] [US3] Add integration coverage for movement-object feedback generation in `tests/integration/map/movementObjectFeedbackFlow.test.ts`
- [x] T027 [P] [US3] Add browser acceptance coverage for visible movement-object explanation in `tests/acceptance/movement-object-readability.spec.ts`

### Implementation for User Story 3

- [x] T028 [P] [US3] Render bridge, milestone, and rubble markers over terrain in `src/render/canvas/renderMapScene.ts`
- [x] T029 [P] [US3] Extend route feedback to explain bridge-enabled legality and stacked object modifiers in `src/engine/map/terrainFeedback.ts`
- [x] T030 [P] [US3] Update sidebar overlays to explain visible movement-object effects in `src/ui/overlays/guardStatusOverlay.ts`
- [x] T031 [US3] Integrate movement-object readability and explanation updates into the map scene controller in `src/app/scene-controller/mapScene.ts`

**Checkpoint**: All user stories should now be independently functional with readable movement-object behavior

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish validation, cleanup, and documentation alignment across the movement-object slice

- [x] T032 [P] Add any shared movement-object visual constants or sprite helpers in `src/render/sprites/placeholders.ts`
- [x] T033 [P] Update movement-object run instructions and scenario notes in `specs/005-bridge-movement-objects/quickstart.md`
- [x] T034 Run the full movement-object verification flow and record results in `specs/005-bridge-movement-objects/tasks.md`
- [x] T035 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain consistent after implementation in `specs/005-bridge-movement-objects/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion and delivers the MVP
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds on the shared movement-object resolution introduced for US1
- **User Story 3 (Phase 5)**: Depends on Foundational completion and relies on the movement-object resolution model from US1 and US2
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational completion and is the MVP slice
- **User Story 2 (P2)**: Depends on the shared movement-object model and bridge-aware resolved tiles established in US1
- **User Story 3 (P3)**: Depends on the movement-object lookup and feedback seams introduced in US1 and US2

### Within Each User Story

- Add automated tests for changed behavior before marking the story complete
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Build movement-object lookup and rule seams before scene wiring
- Finish player-visible explanation before considering a story complete
- Validate the story through its independent test before moving to the next phase

### Parallel Opportunities

- Foundational tasks marked `[P]` can run in parallel after the type updates are in place
- Within each story, contract, integration, and acceptance tests marked `[P]` can run in parallel
- Engine, rendering, and UI tasks touching separate files can run in parallel once their shared seams exist

---

## Parallel Example: User Story 1

```text
T011 Contract coverage for bridge-region authoring and validation in tests/contract/movement-object-format.contract.test.ts
T012 Integration coverage for bridged versus unbridged river movement in tests/integration/map/bridgeCrossingFlow.test.ts
T013 Browser acceptance coverage for bridge-enabled river crossings in tests/acceptance/bridge-crossing.spec.ts

T014 Extend route resolution to make bridge-covered river tiles traversable with bridge cost in src/engine/map/movementObjectRules.ts
T015 Integrate bridge-aware resolved movement tiles into hero movement execution in src/engine/map/heroActions.ts
T016 Update route validation to preserve blocked behavior on unbridged river tiles in src/engine/map/routeRules.ts
```

---

## Parallel Example: User Story 3

```text
T025 Contract coverage for movement-object readability and feedback in tests/contract/movement-object-ux.contract.test.ts
T026 Integration coverage for movement-object feedback generation in tests/integration/map/movementObjectFeedbackFlow.test.ts
T027 Browser acceptance coverage for visible movement-object explanation in tests/acceptance/movement-object-readability.spec.ts

T028 Render bridge, milestone, and rubble markers over terrain in src/render/canvas/renderMapScene.ts
T029 Extend route feedback to explain bridge-enabled legality and stacked object modifiers in src/engine/map/terrainFeedback.ts
T030 Update sidebar overlays to explain visible movement-object effects in src/ui/overlays/guardStatusOverlay.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate bridged river crossings independently
5. Demo the bridge-crossing MVP before adding extra movement modifiers and richer readability

### Incremental Delivery

1. Deliver shared movement-object regions, validation, and resolution seams
2. Deliver User Story 1 bridge-enabled river crossings as the MVP slice
3. Deliver User Story 2 stacked milestone and rubble cost modifiers
4. Deliver User Story 3 movement-object rendering and explanatory feedback
5. Finish with verification and documentation cleanup

### Parallel Team Strategy

With multiple developers:

1. One developer prepares movement-object region and validation seams
2. Another developer can prepare contract and acceptance coverage once the object contracts are clear
3. After Foundational completion:
   - Developer A: US1 bridge crossing behavior and tests
   - Developer B: US2 stacked cost modifiers and tests
   - Developer C: US3 object readability and feedback

---

## Notes

- `[P]` tasks touch separate files and are candidates for concurrent work
- `[US1]`, `[US2]`, and `[US3]` preserve direct traceability back to the active spec
- The movement-object slice intentionally extends the current terrain-aware map engine rather than adding construction systems or combat modifiers
- Keep implementation aligned with `specs/005-bridge-movement-objects/quickstart.md` as the executable demo flow

## Verification Results

- [x] `npm test`
- [x] `npm run verify:movement-objects`

## Consistency Notes

- [x] The implemented object set remains limited to `bridge`, `milestone`, and `rubble`.
- [x] Bridge validation still fails when non-river tiles are covered.
- [x] Stacked movement objects resolve deterministically with bridge passability first and final movement cost clamped to a minimum of 1.
- [x] Quickstart, contracts, and tests all point to `advanced-terrain-scenario` as the active movement-object demo.
