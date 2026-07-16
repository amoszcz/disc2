# Tasks: Asset Storybook

**Input**: Design documents from `/specs/013-asset-storybook/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include the automated validation tasks needed to prove changed behavior. Add test tasks by default for every feature or story that changes behavior, preferring integration, contract, or acceptance-style coverage over implementation-detail tests.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (e.g. `[US1]`, `[US2]`, `[US3]`)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature-scoped documentation and validation entry points for the storybook slice

- [X] T001 Create the feature task scaffold in `specs/013-asset-storybook/tasks.md`
- [X] T002 Add storybook validation command notes to `specs/013-asset-storybook/quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the shared scene, state, and preview catalog seams that all storybook user stories depend on

**CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Extend storybook-facing runtime types in `src/engine/scenario/types.ts`
- [X] T004 [P] Extend menu/session state helpers for storybook scene support in `src/app/state/gameState.ts`
- [X] T005 [P] Add shared storybook preview catalog helpers in `src/render/sprites/visualTemplateCatalog.ts`
- [X] T006 [P] Add isolated storybook preview resolution helpers in `src/render/sprites/visualTemplateResolver.ts`
- [X] T007 Add foundational storybook state and resolver integration coverage in `tests/integration/storybook/storybookPreviewResolutionFlow.test.ts`

**Checkpoint**: A dedicated storybook scene/state seam and shared preview catalog exist before menu or UI work begins

---

## Phase 3: User Story 1 - Open The Asset Storybook From The Menu (Priority: P1) MVP

**Goal**: Let the user enter and leave a dedicated storybook scene from the main menu without affecting scenario session flow

**Independent Test**: Open the game, enter the storybook from the main menu, return to the main menu, and verify the app never starts or mutates a scenario session during that navigation.

### Tests for User Story 1

- [X] T008 [P] [US1] Add main-menu storybook entry contract coverage in `tests/contract/storybookMenu.contract.test.ts`
- [X] T009 [P] [US1] Add storybook navigation integration coverage in `tests/integration/storybook/storybookNavigationFlow.test.ts`
- [X] T010 [P] [US1] Add browser coverage for storybook menu access in `tests/acceptance/storybook-menu-access.spec.ts`

### Implementation for User Story 1

- [X] T011 [P] [US1] Extend `SceneMode` and storybook session state structures in `src/engine/scenario/types.ts`
- [X] T012 [P] [US1] Add storybook session creation and menu return helpers in `src/app/state/gameState.ts`
- [X] T013 [US1] Add a storybook entry action to the main menu overlay in `src/ui/overlays/mainMenu.ts`
- [X] T014 [US1] Add a dedicated storybook scene controller/sidebar renderer in `src/app/scene-controller/storybookScene.ts`
- [X] T015 [US1] Integrate storybook scene selection and menu/storybook routing in `src/app/bootstrap/startGame.ts`

**Checkpoint**: User Story 1 is independently functional with a reachable storybook scene and safe return-to-menu flow

---

## Phase 4: User Story 2 - Inspect Every Supported Subject In Its Available States (Priority: P1)

**Goal**: Show each supported preview subject in an isolated tile with a subject-specific state selector driven by shared gameplay resolution logic

**Independent Test**: Open the storybook, inspect entries from at least hero, battle-unit, and object categories, switch their states, and confirm the preview updates through the same resolver-backed logic used elsewhere in the game.

### Tests for User Story 2

- [X] T016 [P] [US2] Add preview catalog contract coverage in `tests/contract/storybookPreviewCatalog.contract.test.ts`
- [X] T017 [P] [US2] Add storybook preview state-switching integration coverage in `tests/integration/storybook/storybookPreviewResolutionFlow.test.ts`
- [X] T018 [P] [US2] Add browser coverage for storybook preview state selection in `tests/acceptance/storybook-preview-states.spec.ts`

### Implementation for User Story 2

- [X] T019 [P] [US2] Add derived storybook preview-subject catalog structures in `src/render/sprites/visualTemplateCatalog.ts`
- [X] T020 [P] [US2] Add storybook preview request/response helpers in `src/render/sprites/visualTemplateResolver.ts`
- [X] T021 [US2] Add storybook preview state storage and update helpers in `src/app/state/gameState.ts`
- [X] T022 [US2] Implement isolated storybook tile rendering in `src/render/canvas/renderStorybookScene.ts`
- [X] T023 [US2] Implement storybook sidebar controls and state dropdown UI in `src/ui/overlays/storybookPanel.ts`
- [X] T024 [US2] Connect storybook scene rendering and sidebar behavior in `src/app/scene-controller/storybookScene.ts`

**Checkpoint**: User Stories 1 and 2 together provide a usable storybook with isolated previews and subject-appropriate state switching

---

## Phase 5: User Story 3 - Verify Fallbacks And State Transitions Visually (Priority: P2)

**Goal**: Make the storybook useful for checking missing-state fallbacks and visible transitions between supported states

**Independent Test**: Use the storybook to switch a subject across states, intentionally remove one dedicated mapping, and confirm the preview remains readable while exposing the dedicated-versus-fallback distinction.

### Tests for User Story 3

- [X] T025 [P] [US3] Add fallback preview contract coverage in `tests/contract/storybookPreviewFallback.contract.test.ts`
- [X] T026 [P] [US3] Add mixed dedicated-and-fallback storybook integration coverage in `tests/integration/storybook/storybookFallbackPreviewFlow.test.ts`
- [X] T027 [P] [US3] Add browser coverage for storybook fallback readability in `tests/acceptance/storybook-fallback-preview.spec.ts`

### Implementation for User Story 3

- [X] T028 [P] [US3] Extend storybook preview metadata for fallback-reviewable states in `src/render/sprites/visualTemplateCatalog.ts`
- [X] T029 [P] [US3] Extend storybook preview diagnostics and fallback reporting in `src/render/sprites/visualTemplateResolver.ts`
- [X] T030 [US3] Add visual state-transition feedback for storybook entry updates in `src/app/state/gameState.ts`
- [X] T031 [US3] Surface fallback and selected-state readability hints in `src/ui/overlays/storybookPanel.ts`
- [X] T032 [US3] Integrate fallback review rendering behavior in `src/render/canvas/renderStorybookScene.ts`

**Checkpoint**: All user stories are independently functional, including fallback visibility and state-transition review

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish documentation, validation, and artifact consistency for the storybook slice

- [X] T033 [P] Document menu-access behavior for the storybook in `specs/013-asset-storybook/contracts/storybook-menu-access.md`
- [X] T034 [P] Document isolated preview and fallback readability guidance in `specs/013-asset-storybook/contracts/storybook-preview-readability.md`
- [X] T035 [P] Add final asset-review and validation guidance in `specs/013-asset-storybook/research.md`
- [X] T036 Run the storybook quickstart validation flow in `specs/013-asset-storybook/quickstart.md`
- [X] T037 Verify `spec.md`, `plan.md`, `data-model.md`, `contracts/`, and `tasks.md` remain aligned in `specs/013-asset-storybook/tasks.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Stories (Phase 3+)**: Depend on Foundational completion
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - serves as the MVP
- **User Story 2 (P1)**: Can start after Foundational and reuses the storybook scene/state seam established for US1
- **User Story 3 (P2)**: Can start after Foundational and is most valuable once isolated previews and state switching already exist

### Within Each User Story

- Automated tests for changed behavior MUST be added unless an explicit exception is documented
- Prefer contract, integration, and acceptance coverage over implementation-detail unit tests
- Extend shared catalog/resolver or state seams before scene-specific UI wiring
- Add rendering behavior before closing scene-controller integration tasks
- Complete story validation before moving to the next priority when working sequentially

### Parallel Opportunities

- `T004`, `T005`, and `T006` can run in parallel after `T003`
- Test tasks within each user story marked `[P]` can run in parallel
- Catalog and resolver extension tasks within a story marked `[P]` can run in parallel
- Once Foundational completes, US1 and US2 can be staffed in parallel if the team accepts shared integration coordination

---

## Parallel Example: User Story 1

```text
T008 Add main-menu storybook entry contract coverage in tests/contract/storybookMenu.contract.test.ts
T009 Add storybook navigation integration coverage in tests/integration/storybook/storybookNavigationFlow.test.ts
T010 Add browser coverage for storybook menu access in tests/acceptance/storybook-menu-access.spec.ts

T011 Extend SceneMode and storybook session state structures in src/engine/scenario/types.ts
T012 Add storybook session creation and menu return helpers in src/app/state/gameState.ts
```

---

## Parallel Example: User Story 2

```text
T016 Add preview catalog contract coverage in tests/contract/storybookPreviewCatalog.contract.test.ts
T017 Add storybook preview state-switching integration coverage in tests/integration/storybook/storybookPreviewResolutionFlow.test.ts
T018 Add browser coverage for storybook preview state selection in tests/acceptance/storybook-preview-states.spec.ts

T019 Add derived storybook preview-subject catalog structures in src/render/sprites/visualTemplateCatalog.ts
T020 Add storybook preview request/response helpers in src/render/sprites/visualTemplateResolver.ts
```

---

## Parallel Example: User Story 3

```text
T025 Add fallback preview contract coverage in tests/contract/storybookPreviewFallback.contract.test.ts
T026 Add mixed dedicated-and-fallback storybook integration coverage in tests/integration/storybook/storybookFallbackPreviewFlow.test.ts
T027 Add browser coverage for storybook fallback readability in tests/acceptance/storybook-fallback-preview.spec.ts

T028 Extend storybook preview metadata for fallback-reviewable states in src/render/sprites/visualTemplateCatalog.ts
T029 Extend storybook preview diagnostics and fallback reporting in src/render/sprites/visualTemplateResolver.ts
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate menu-to-storybook navigation independently

### Incremental Delivery

1. Build the shared storybook scene/state and preview catalog seams
2. Deliver US1 menu access as the MVP entry point
3. Deliver US2 isolated preview listing and state switching
4. Deliver US3 fallback and transition review hardening
5. Finish with documentation and artifact-consistency validation

### Parallel Team Strategy

1. One developer prepares the shared scene/state and preview catalog seams
2. Another developer prepares contract and acceptance coverage for storybook navigation once the UI contract is stable
3. After the foundational phase:
   - Developer A: US1 menu/storybook navigation
   - Developer B: US2 preview catalog and isolated rendering
   - Developer C: US3 fallback-review and transition-readability hardening

---

## Notes

- `[P]` tasks target different files or independent seams and are good parallel candidates
- `[US1]`, `[US2]`, and `[US3]` preserve traceability back to the spec's user stories
- The first slice intentionally focuses on menu access, isolated previewing, and shared resolver-backed state switching rather than advanced animation-authoring controls
