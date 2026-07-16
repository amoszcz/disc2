# Tasks: Unit And Object Animation States

**Input**: Design documents from `/specs/012-unit-animation-states/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include the automated validation tasks needed to prove changed behavior. Add test tasks by default for every feature or story that changes behavior, preferring integration, contract, or acceptance-style coverage over implementation-detail tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g. `[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-scoped validation entry points and documentation references for the animation-state slice

- [X] T001 Create the feature task scaffold in `specs/012-unit-animation-states/tasks.md`
- [X] T002 Add animation-state validation command notes to `specs/012-unit-animation-states/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared state vocabulary, resolver inputs, and diagnostics seam that all stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Extend rendering-facing animation-state types in `src/engine/scenario/types.ts`
- [X] T004 [P] Add shared animation-state catalog structures to `src/render/sprites/visualTemplateCatalog.ts`
- [X] T005 [P] Add animation-state aware resolution helpers to `src/render/sprites/visualTemplateResolver.ts`
- [X] T006 [P] Preserve category-level fallback state metadata in `src/render/sprites/placeholders.ts`
- [X] T007 Add foundational state-resolution integration coverage in `tests/integration/render/animationStateResolverFlow.test.ts`

**Checkpoint**: The renderer can resolve dedicated or fallback animation states through one shared seam before scene-specific adoption begins

---

## Phase 3: User Story 1 - Read Hero Movement On The Map (Priority: P1) MVP

**Goal**: Render current hero map behavior through directional and event-aware state selection while preserving map readability

**Independent Test**: Start a scenario, move the hero in each supported direction, trigger a map interaction, and verify that the map scene resolves the expected hero states without changing route or turn behavior.

### Tests for User Story 1

- [X] T008 [P] [US1] Add hero state-catalog contract coverage in `tests/contract/heroAnimationStateCatalog.contract.test.ts`
- [X] T009 [P] [US1] Add map hero state-selection integration coverage in `tests/integration/render/heroMapAnimationStateFlow.test.ts`
- [X] T010 [P] [US1] Add browser coverage for hero movement-state readability in `tests/acceptance/hero-map-animation-states.spec.ts`

### Implementation for User Story 1

- [X] T011 [P] [US1] Extend hero state profile mappings in `src/render/sprites/visualTemplateCatalog.ts`
- [X] T012 [P] [US1] Add hero movement and event state resolution helpers in `src/render/sprites/visualTemplateResolver.ts`
- [X] T013 [US1] Feed hero map-state selection signals from route and interaction context in `src/engine/map/heroActions.ts`
- [X] T014 [US1] Integrate state-aware hero rendering into `src/render/canvas/renderMapScene.ts`
- [X] T015 [US1] Expose hero animation-state diagnostics through the bootstrap seam in `src/app/bootstrap/startGame.ts`

**Checkpoint**: User Story 1 is independently functional with readable hero idle, movement, stop, and interaction state selection on the map

---

## Phase 4: User Story 2 - Read Combat And Defeat States Clearly (Priority: P1)

**Goal**: Render current battle-capable units through action, reaction, and outcome state selection without changing combat rules

**Independent Test**: Trigger battle flows that exercise ready, attack, defend, hit, victory, and perish moments and verify that battle rendering selects the expected unit states while preserving existing HUD cues.

### Tests for User Story 2

- [X] T016 [P] [US2] Add battle unit state-catalog contract coverage in `tests/contract/battleAnimationStateCatalog.contract.test.ts`
- [X] T017 [P] [US2] Add battle state-selection integration coverage in `tests/integration/render/battleAnimationStateFlow.test.ts`
- [X] T018 [P] [US2] Add browser coverage for battle animation-state readability in `tests/acceptance/battle-animation-states.spec.ts`

### Implementation for User Story 2

- [X] T019 [P] [US2] Extend unit state profile mappings for melee, ranged, and area roles in `src/render/sprites/visualTemplateCatalog.ts`
- [X] T020 [P] [US2] Add battle state resolution helpers for ready, attack, cast, shoot, hit, defend, victory, and perish in `src/render/sprites/visualTemplateResolver.ts`
- [X] T021 [US2] Feed acting, defending, hit, and outcome state signals from current battle flow in `src/engine/battle/battleTurnEngine.ts`
- [X] T022 [US2] Align battle targeting-driven state selection inputs in `src/engine/battle/battleTargeting.ts`
- [X] T023 [US2] Integrate state-aware unit rendering into `src/render/canvas/renderBattleScene.ts`

**Checkpoint**: User Stories 1 and 2 together deliver readable hero and battle-unit state selection for current map and combat flows

---

## Phase 5: User Story 3 - Maintain A Shared State Vocabulary For Assets (Priority: P2)

**Goal**: Keep object states, asset guidance, and fallback behavior consistent so future art can be prepared without guessing

**Independent Test**: Review current object and guarded-location coverage, remove at least one dedicated state intentionally, and verify that the catalog, resolver, and docs still expose a stable required/optional state story with readable fallback behavior.

### Tests for User Story 3

- [X] T024 [P] [US3] Add state-vocabulary contract coverage for object and fallback profiles in `tests/contract/objectAnimationStateCatalog.contract.test.ts`
- [X] T025 [P] [US3] Add mixed dedicated-and-fallback state rendering integration coverage in `tests/integration/render/animationStateFallbackFlow.test.ts`
- [X] T026 [P] [US3] Add browser fallback coverage for object-state readability in `tests/acceptance/object-animation-state-fallback.spec.ts`

### Implementation for User Story 3

- [X] T027 [P] [US3] Extend object and guarded-location state profile mappings in `src/render/sprites/visualTemplateCatalog.ts`
- [X] T028 [P] [US3] Add object-state fallback resolution and reporting in `src/render/sprites/visualTemplateResolver.ts`
- [X] T029 [US3] Integrate state-aware guarded-location and movement-object rendering into `src/render/canvas/renderGuardedLocations.ts`
- [X] T030 [US3] Integrate state-aware movement-object rendering paths into `src/render/canvas/renderMapScene.ts`
- [X] T031 [US3] Document required versus optional hero, unit, and object states in `specs/012-unit-animation-states/contracts/animation-state-catalog.md`

**Checkpoint**: All user stories are independently testable, including object-state guidance and mixed dedicated/fallback coverage

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, validation, and artifact consistency for the animation-state slice

- [X] T032 [P] Add readability guidance for mixed animated and fallback scenes in `specs/012-unit-animation-states/contracts/map-battle-animation-readability.md`
- [X] T033 [P] Add asset-preparation and naming guidance for animation-state coverage in `specs/012-unit-animation-states/research.md`
- [X] T034 Run the quickstart validation flow for animation-state coverage in `specs/012-unit-animation-states/quickstart.md`
- [X] T035 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/012-unit-animation-states/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - serves as the MVP
- **User Story 2 (P1)**: Can start after Foundational and reuses the shared state-vocabulary and resolver seams established for US1
- **User Story 3 (P2)**: Can start after Foundational and is most valuable once the hero and battle state-selection paths already exist

### Within Each User Story

- Automated tests for changed behavior MUST be added unless an explicit exception is documented
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Extend catalog and resolver seams before scene-specific rendering changes
- Feed gameplay-state selection signals before closing renderer integration tasks
- Complete story validation before moving to the next priority when working sequentially

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each user story marked `[P]` can run in parallel
- Catalog and resolver extension tasks within a story marked `[P]` can run in parallel
- US1 and US2 can be staffed in parallel after the foundational phase, though US1 remains the recommended MVP

---

## Parallel Example: User Story 1

```text
T008 Add hero state-catalog contract coverage in tests/contract/heroAnimationStateCatalog.contract.test.ts
T009 Add map hero state-selection integration coverage in tests/integration/render/heroMapAnimationStateFlow.test.ts
T010 Add browser coverage for hero movement-state readability in tests/acceptance/hero-map-animation-states.spec.ts

T011 Extend hero state profile mappings in src/render/sprites/visualTemplateCatalog.ts
T012 Add hero movement and event state resolution helpers in src/render/sprites/visualTemplateResolver.ts
```

---

## Parallel Example: User Story 2

```text
T016 Add battle unit state-catalog contract coverage in tests/contract/battleAnimationStateCatalog.contract.test.ts
T017 Add battle state-selection integration coverage in tests/integration/render/battleAnimationStateFlow.test.ts
T018 Add browser coverage for battle animation-state readability in tests/acceptance/battle-animation-states.spec.ts

T019 Extend unit state profile mappings for melee, ranged, and area roles in src/render/sprites/visualTemplateCatalog.ts
T020 Add battle state resolution helpers for ready, attack, cast, shoot, hit, defend, victory, and perish in src/render/sprites/visualTemplateResolver.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate hero map-state behavior independently

### Incremental Delivery

1. Build the shared state catalog, resolver inputs, and fallback seams
2. Deliver US1 directional hero state selection as the MVP
3. Deliver US2 battle-unit action and outcome state selection
4. Deliver US3 object-state governance and mixed fallback hardening
5. Finish with documentation and artifact-consistency validation

### Parallel Team Strategy

1. One developer builds the shared state catalog and resolver seams
2. Another developer prepares feature-level rendering tests once the contracts are stable
3. After the foundational phase:
   - Developer A: US1 hero map states
   - Developer B: US2 battle states
   - Developer C: US3 object-state and fallback governance

---

## Notes

- `[P]` tasks target different files or independent seams and are good parallel candidates
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the spec's user stories
- The first slice intentionally focuses on animation-state selection and coverage, not final frame timing or a new animation engine
