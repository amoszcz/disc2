# Tasks: Grid Combat Tactics

**Input**: Design documents from `/specs/007-combat-grid/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract, integration, and acceptance coverage for each behavior-changing combat story.

**Organization**: Tasks are grouped by user story so each tactical combat slice can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Task can run in parallel with other `[P]` tasks in the same phase
- **[Story]**: Maps work to a specific user story from `spec.md`
- Every task includes the primary file path to change

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare combat-specific scripts, docs, and feature-scoped verification entry points

- [ ] T001 Add combat-focused verification scripts in `package.json`
- [ ] T002 Align combat feature execution notes in `specs/007-combat-grid/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish shared battle formation, targeting-state, and scenario-type seams required by all stories

**CRITICAL**: No user story work should begin before this phase is complete

- [ ] T003 Extend battle, unit, formation, attack-category, and defend-state types in `src/engine/scenario/types.ts`
- [ ] T004 [P] Create fixed-slot formation building and lookup helpers in `src/engine/battle/battleFormation.ts`
- [ ] T005 [P] Create legal-target resolution helpers for melee, ranged, and area attacks in `src/engine/battle/battleTargeting.ts`
- [ ] T006 [P] Extend battle creation to assign units into 3x4 formation slots and initialize targeting state in `src/engine/battle/createBattle.ts`
- [ ] T007 [P] Extend shared game state for selected battle target and battle interaction state in `src/app/state/gameState.ts`
- [ ] T008 Add foundational battle formation and targeting-state coverage in `tests/integration/battle/battleEngineFlow.test.ts`

**Checkpoint**: Formation layout and battle targeting seams are ready for player-facing combat interactions

---

## Phase 3: User Story 1 - Choose A Combat Target (Priority: P1) MVP

**Goal**: Let the player select a legal enemy target and then press strike during a player-controlled turn

**Independent Test**: Start a battle with multiple enemies, select a legal target during a player-controlled turn, press strike, and confirm only the selected target is hit when the acting unit requires a single target

### Tests for User Story 1

- [ ] T009 [P] [US1] Add battle targeting-state contract coverage in `tests/contract/battle-targeting-state.contract.test.ts`
- [ ] T010 [P] [US1] Add selected-target strike flow integration coverage in `tests/integration/battle/battleTargetSelectionFlow.test.ts`
- [ ] T011 [P] [US1] Add browser target-selection and strike interaction coverage in `tests/acceptance/battle-target-selection.spec.ts`

### Implementation for User Story 1

- [ ] T012 [P] [US1] Handle battle target selection and strike action input in `src/app/scene-controller/battleInputController.ts`
- [ ] T013 [P] [US1] Render battle formation slots, legal targets, and selected target state in `src/render/canvas/renderBattleScene.ts`
- [ ] T014 [P] [US1] Show active unit, selected target, and strike readiness in `src/ui/overlays/battleHud.ts`
- [ ] T015 [US1] Resolve selected-target strike actions and queue advancement in `src/engine/battle/battleTurnEngine.ts`
- [ ] T016 [US1] Wire target-selection state refresh into battle scene updates in `src/app/scene-controller/battleScene.ts`

**Checkpoint**: User Story 1 is independently playable as explicit target selection plus strike resolution

---

## Phase 4: User Story 2 - Use Attack Types With Different Reach (Priority: P1)

**Goal**: Enforce distinct melee, ranged, and area-of-effect targeting rules during battle

**Independent Test**: Run battles containing each attack type and verify melee column restrictions, ranged free targeting, and area damage to all living enemies

### Tests for User Story 2

- [ ] T017 [P] [US2] Add attack-category targeting contract coverage in `tests/contract/battle-attack-types.contract.test.ts`
- [ ] T018 [P] [US2] Add melee, ranged, and area targeting integration coverage in `tests/integration/battle/battleAttackTypesFlow.test.ts`
- [ ] T019 [P] [US2] Add browser coverage for attack-type targeting behavior in `tests/acceptance/battle-attack-types.spec.ts`

### Implementation for User Story 2

- [ ] T020 [P] [US2] Extend unit data with attack-category assignments in `src/engine/scenario/types.ts`
- [ ] T021 [P] [US2] Implement melee column scanning, ranged selection, and area coverage logic in `src/engine/battle/battleTargeting.ts`
- [ ] T022 [P] [US2] Apply attack-category damage resolution paths in `src/engine/battle/battleTurnEngine.ts`
- [ ] T023 [US2] Show attack-category-specific targeting feedback in `src/ui/overlays/battleHud.ts`
- [ ] T024 [US2] Update battle scene highlighting for legal targets by attack type in `src/render/canvas/renderBattleScene.ts`

**Checkpoint**: User Stories 1 and 2 together provide manual targeting with correct melee, ranged, and area rules

---

## Phase 5: User Story 3 - Defend Instead Of Attacking (Priority: P2)

**Goal**: Let the player choose defend to halve incoming damage until that unit’s next turn begins

**Independent Test**: Choose defend on a player-controlled turn, take incoming damage before the next action, and confirm the unit receives half damage until its next turn begins and then loses the defend state

### Tests for User Story 3

- [ ] T025 [P] [US3] Add defend-state contract coverage in `tests/contract/battle-defend-state.contract.test.ts`
- [ ] T026 [P] [US3] Add defend mitigation and expiration integration coverage in `tests/integration/battle/battleDefendFlow.test.ts`
- [ ] T027 [P] [US3] Add browser defend-action coverage in `tests/acceptance/battle-defend.spec.ts`

### Implementation for User Story 3

- [ ] T028 [P] [US3] Add defend-state tracking and expiration handling in `src/engine/battle/battleTurnEngine.ts`
- [ ] T029 [P] [US3] Add defend action input and turn-spend behavior in `src/app/scene-controller/battleInputController.ts`
- [ ] T030 [P] [US3] Apply defend mitigation during incoming damage resolution in `src/engine/battle/battleTurnEngine.ts`
- [ ] T031 [US3] Show defend availability and protected-unit status in `src/ui/overlays/battleHud.ts`
- [ ] T032 [US3] Render defended-unit visual feedback in `src/render/canvas/renderBattleScene.ts`

**Checkpoint**: All three user stories are independently testable, including defend mitigation and expiration

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish shared presentation, verification, and artifact consistency for the combat slice

- [ ] T033 [P] Add battle-formation palette and slot markers in `src/render/sprites/placeholders.ts`
- [ ] T034 [P] Update battle UX wording and tactical feedback details in `specs/007-combat-grid/contracts/battle-formation-ux.md`
- [ ] T035 Run combat-focused verification commands documented in `specs/007-combat-grid/quickstart.md`
- [ ] T036 Verify `spec.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/007-combat-grid/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies
- **Phase 2: Foundational**: Depends on Phase 1 and blocks all story work
- **Phase 3: US1**: Depends on Phase 2 and delivers the MVP
- **Phase 4: US2**: Depends on Phase 2 and builds on the target-selection flow from US1
- **Phase 5: US3**: Depends on Phase 2 and relies on the action/turn model established by US1 and US2
- **Phase 6: Polish**: Depends on the desired user stories being complete

### User Story Dependencies

- **US1**: No dependency on other user stories after foundational work
- **US2**: Depends on the acting-unit and selected-target seams delivered by US1
- **US3**: Depends on the one-action-per-turn battle flow delivered by US1 and reused by US2

### Within Each User Story

- Add behavior-level tests before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Finish engine and state seams before wiring scene controller, HUD, and rendering updates
- Validate each story against its independent test before moving forward

### Parallel Opportunities

- `T004`, `T005`, `T006`, and `T007` can run in parallel after `T003`
- Test tasks within each story marked `[P]` can run in parallel
- Engine, UI, and rendering tasks marked `[P]` can run in parallel once shared seams exist

---

## Parallel Example: User Story 1

```text
T009 Add battle targeting-state contract coverage in tests/contract/battle-targeting-state.contract.test.ts
T010 Add selected-target strike flow integration coverage in tests/integration/battle/battleTargetSelectionFlow.test.ts
T011 Add browser target-selection and strike interaction coverage in tests/acceptance/battle-target-selection.spec.ts

T012 Handle battle target selection and strike action input in src/app/scene-controller/battleInputController.ts
T013 Render battle formation slots, legal targets, and selected target state in src/render/canvas/renderBattleScene.ts
T014 Show active unit, selected target, and strike readiness in src/ui/overlays/battleHud.ts
```

---

## Parallel Example: User Story 3

```text
T025 Add defend-state contract coverage in tests/contract/battle-defend-state.contract.test.ts
T026 Add defend mitigation and expiration integration coverage in tests/integration/battle/battleDefendFlow.test.ts
T027 Add browser defend-action coverage in tests/acceptance/battle-defend.spec.ts

T028 Add defend-state tracking and expiration handling in src/engine/battle/battleTurnEngine.ts
T029 Add defend action input and turn-spend behavior in src/app/scene-controller/battleInputController.ts
T032 Render defended-unit visual feedback in src/render/canvas/renderBattleScene.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate target selection and strike flow independently

### Incremental Delivery

1. Build shared formation, targeting, and battle-state seams
2. Deliver US1 player target selection and strike control as the MVP
3. Deliver US2 attack-category targeting rules
4. Deliver US3 defend-state mitigation and expiration
5. Finish with cross-cutting polish and verification

### Parallel Team Strategy

1. One developer prepares formation and targeting engine seams
2. Another developer can prepare behavior-level combat tests once the contracts are stable
3. After the foundational phase:
   - Developer A: US1 target selection and strike flow
   - Developer B: US2 attack-category rules
   - Developer C: US3 defend-state flow

---

## Notes

- `[P]` tasks are candidates for parallel execution because they target separate seams or files
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the combat feature spec
- This slice intentionally keeps battle positions fixed and does not introduce slot movement or extra action types
