# Tasks: Dedicated Visual Templates

**Input**: Design documents from `/specs/011-unit-tile-templates/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include automated contract, integration, and acceptance coverage for each behavior-changing story because this feature changes visible map and battle rendering behavior.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-scoped verification entry points and shared asset directories for the new visual-template slice

- [x] T001 Create the dedicated asset folder structure in `src/render/sprites/assets/`
- [x] T002 Add visual-template validation scripts documentation and command notes in `specs/011-unit-tile-templates/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared catalog, resolver, and placeholder seams that all visual stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Extend rendering-facing visual template types in `src/engine/scenario/types.ts`
- [x] T004 [P] Create the shared visual template catalog in `src/render/sprites/visualTemplateCatalog.ts`
- [x] T005 [P] Create the shared visual template resolver in `src/render/sprites/visualTemplateResolver.ts`
- [x] T006 [P] Refactor shared placeholder fallback metadata in `src/render/sprites/placeholders.ts`
- [x] T007 Add foundational resolver and fallback integration coverage in `tests/integration/render/visualTemplateResolverFlow.test.ts`

**Checkpoint**: The renderer can resolve dedicated or fallback visuals through one shared seam before scene-specific adoption begins

---

## Phase 3: User Story 1 - Recognize Units And Map Objects Visually (Priority: P1) MVP

**Goal**: Render current units, heroes, guarded locations, and supported map objects through dedicated visual templates while preserving map and battle readability

**Independent Test**: Start the current scenarios and verify that units, heroes, guarded locations, and supported map objects resolve to dedicated templates when available and remain visually distinguishable in map and battle scenes.

### Tests for User Story 1

- [x] T008 [P] [US1] Add visual-template mapping contract coverage in `tests/contract/visual-template-mapping.contract.test.ts`
- [x] T009 [P] [US1] Add unit and object rendering integration coverage in `tests/integration/render/unitObjectTemplateFlow.test.ts`
- [x] T010 [P] [US1] Add browser coverage for unit and object visual readability in `tests/acceptance/unit-object-templates.spec.ts`

### Implementation for User Story 1

- [x] T011 [P] [US1] Add dedicated unit, hero, object, and guarded-location asset files in `src/render/sprites/assets/`
- [x] T012 [P] [US1] Extend the template catalog with unit, hero, movement-object, and guarded-location mappings in `src/render/sprites/visualTemplateCatalog.ts`
- [x] T013 [US1] Integrate resolver-driven unit visuals into `src/render/canvas/renderBattleScene.ts`
- [x] T014 [US1] Integrate resolver-driven hero, pickup-adjacent object, and movement-object visuals into `src/render/canvas/renderMapScene.ts`
- [x] T015 [US1] Integrate resolver-driven guarded-location visuals into `src/render/canvas/renderGuardedLocations.ts`
- [x] T016 [US1] Add shared image loading and render helper support for unit and object templates in `src/render/sprites/visualTemplateResolver.ts`
- [x] T016a [US1] Extend catalog mappings to support shared sprite-sheet regions with explicit crop coordinates in `src/render/sprites/visualTemplateCatalog.ts`
- [x] T016b [US1] Update render helper support to draw sprite-sheet entries with crop-aware placement in `src/render/sprites/visualTemplateResolver.ts`
- [x] T016c [US1] Refine map-scene placement for hero and movement-object sprite-sheet visuals in `src/render/canvas/renderMapScene.ts`

**Checkpoint**: User Story 1 is independently functional with dedicated visuals for current units and map objects plus battle/map readability preserved

---

## Phase 4: User Story 2 - Read Terrain From Tile Artwork (Priority: P1)

**Goal**: Render the currently supported terrain types through dedicated tile templates without harming navigation readability

**Independent Test**: Load the advanced terrain scenario and verify that each current terrain type uses its own dedicated tile template and remains readable during normal map play, including zoom and pan.

### Tests for User Story 2

- [x] T017 [P] [US2] Add map and battle readability contract coverage for tile templates in `tests/contract/map-battle-visual-readability.contract.test.ts`
- [x] T018 [P] [US2] Add terrain template rendering integration coverage in `tests/integration/render/terrainTemplateFlow.test.ts`
- [x] T019 [P] [US2] Add browser coverage for terrain tile readability in `tests/acceptance/terrain-tile-templates.spec.ts`

### Implementation for User Story 2

- [x] T020 [P] [US2] Add dedicated terrain tile asset files in `src/render/sprites/assets/`
- [x] T021 [P] [US2] Extend the template catalog with terrain mappings in `src/render/sprites/visualTemplateCatalog.ts`
- [x] T022 [US2] Integrate resolver-driven terrain tile rendering into `src/render/canvas/renderMapScene.ts`
- [x] T023 [US2] Adjust viewport-aware tile drawing support for dedicated tile templates in `src/render/canvas/viewportRender.ts`
- [x] T024 [US2] Update shared visual-template resolver support for terrain-specific map rendering in `src/render/sprites/visualTemplateResolver.ts`
- [x] T024a [US2] Replace approximate terrain sprite-sheet crop bounds with measured tile coordinates in `src/render/sprites/visualTemplateCatalog.ts`

**Checkpoint**: User Stories 1 and 2 together deliver dedicated visuals for current units, objects, and terrain with readable map and battle scenes

---

## Phase 5: User Story 3 - Keep A Lightweight Placeholder Path For Testing (Priority: P2)

**Goal**: Keep the existing placeholder presentation available as a first-class fallback whenever dedicated assets are missing or intentionally incomplete

**Independent Test**: Run scenes with incomplete asset coverage and verify that the resolver falls back to current placeholder visuals without blank or unreadable map or battle elements.

### Tests for User Story 3

- [x] T025 [P] [US3] Add fallback resolution contract coverage in `tests/contract/visual-template-fallback.contract.test.ts`
- [x] T026 [P] [US3] Add mixed dedicated-and-fallback rendering integration coverage in `tests/integration/render/visualTemplateFallbackFlow.test.ts`
- [x] T027 [P] [US3] Add browser fallback-coverage validation in `tests/acceptance/visual-template-fallback.spec.ts`

### Implementation for User Story 3

- [x] T028 [P] [US3] Extend the resolver with explicit fallback reporting for tests and runtime diagnostics in `src/render/sprites/visualTemplateResolver.ts`
- [x] T029 [P] [US3] Preserve and normalize category-level fallback metadata in `src/render/sprites/placeholders.ts`
- [x] T030 [US3] Add mixed-coverage fallback handling for map rendering in `src/render/canvas/renderMapScene.ts`
- [x] T031 [US3] Add mixed-coverage fallback handling for battle rendering in `src/render/canvas/renderBattleScene.ts`
- [x] T032 [US3] Document incomplete-asset and fallback validation flow in `specs/011-unit-tile-templates/quickstart.md`

**Checkpoint**: All user stories are independently testable, including incomplete-asset fallback behavior

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, verification, and artifact consistency for the dedicated visual-template slice

- [x] T033 [P] Add renderer-facing asset-loading notes and visual catalog maintenance guidance in `specs/011-unit-tile-templates/contracts/visual-template-mapping.md`
- [x] T034 [P] Refine readability guidance for mixed dedicated/fallback scenes in `specs/011-unit-tile-templates/contracts/map-battle-visual-readability.md`
- [x] T035 Run the quickstart validation flow for dedicated templates and fallback coverage in `specs/011-unit-tile-templates/quickstart.md`
- [x] T036 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/011-unit-tile-templates/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - serves as the MVP
- **User Story 2 (P1)**: Can start after Foundational and reuses the catalog/resolver seam established for US1
- **User Story 3 (P2)**: Can start after Foundational and should be applied after the dedicated-template paths exist for meaningful mixed-coverage validation

### Within Each User Story

- Add automated tests for changed behavior before closing the story
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Add or update dedicated assets before wiring renderers to consume them
- Extend the shared catalog and resolver before scene-specific rendering changes
- Complete story validation before moving to the next priority when working sequentially

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each user story marked `[P]` can run in parallel
- Asset creation and catalog extension tasks within a story marked `[P]` can run in parallel
- US1 and US2 can be staffed in parallel after the foundational phase, though US1 remains the recommended MVP

---

## Parallel Example: User Story 1

```text
T008 Add visual-template mapping contract coverage in tests/contract/visual-template-mapping.contract.test.ts
T009 Add unit and object rendering integration coverage in tests/integration/render/unitObjectTemplateFlow.test.ts
T010 Add browser coverage for unit and object visual readability in tests/acceptance/unit-object-templates.spec.ts

T011 Add dedicated unit, hero, object, and guarded-location asset files in src/render/sprites/assets/
T012 Extend the template catalog with unit, hero, movement-object, and guarded-location mappings in src/render/sprites/visualTemplateCatalog.ts
```

---

## Parallel Example: User Story 3

```text
T025 Add fallback resolution contract coverage in tests/contract/visual-template-fallback.contract.test.ts
T026 Add mixed dedicated-and-fallback rendering integration coverage in tests/integration/render/visualTemplateFallbackFlow.test.ts
T027 Add browser fallback-coverage validation in tests/acceptance/visual-template-fallback.spec.ts

T028 Extend the resolver with explicit fallback reporting for tests and runtime diagnostics in src/render/sprites/visualTemplateResolver.ts
T029 Preserve and normalize category-level fallback metadata in src/render/sprites/placeholders.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate unit and object dedicated-template behavior independently

### Incremental Delivery

1. Build the shared visual-template catalog, resolver, and fallback seams
2. Deliver US1 dedicated visuals for units and map objects as the MVP
3. Deliver US2 dedicated terrain tile templates for map readability
4. Deliver US3 fallback hardening for incomplete asset coverage
5. Finish with documentation, quickstart validation, and artifact consistency

### Parallel Team Strategy

1. One developer builds the shared visual-template catalog and resolver seams
2. Another developer prepares feature-level rendering tests once the contracts are stable
3. After the foundational phase:
   - Developer A: US1 units and objects
   - Developer B: US2 terrain tiles
   - Developer C: US3 fallback-path hardening

---

## Notes

- `[P]` tasks target different files or independent seams and are good parallel candidates
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the spec’s user stories
- The first slice intentionally stays within current scenarios and supported content types instead of building a future-proof art pipeline
- The implemented slice now supports a mixed asset strategy: standalone dedicated assets, shared sprite-sheet regions, and category-level fallback placeholders
