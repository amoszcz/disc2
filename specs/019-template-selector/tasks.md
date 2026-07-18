# Tasks: Switch Visual Templates

**Input**: Design documents from `/specs/019-template-selector/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [template-selection.md](contracts/template-selection.md), [quickstart.md](quickstart.md)

**Tests**: Automated contract, integration, and acceptance tasks are required for every behavior-changing story under the project constitution. Prefer public UI and adapter seams over implementation-detail-only assertions.

**Organization**: Tasks are grouped by user story so each surface can be implemented and proven independently once shared catalog foundations are in place.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel with other tasks in its phase when dependencies are satisfied
- **[Story]**: User story label; omitted only for setup, foundational, and cross-cutting work
- Every task includes an exact repository path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish the feature test command and canonical asset layout without introducing a second template inventory.

- [X] T001 Add the focused `test:template-selector` command covering the new contract and integration suites in `package.json`
- [X] T002 Move/copy the current atlas PNG and JSON map into the canonical pair `src/render/sprites/templates/default-template.png` and `src/render/sprites/templates/default-template.json`
- [X] T003 Move/copy the WIP atlas PNG and JSON map into the canonical pair `src/render/sprites/templates/wip-template.png` and `src/render/sprites/templates/wip-template.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the single catalog, configured default, session selection, and dynamic resolver seam required by every surface.

**CRITICAL**: Complete this phase before implementing dropdown behavior in gameplay, storybook, or mapper.

- [X] T004 Define catalog source, active-template, and game-configuration types in `src/engine/scenario/types.ts`
- [X] T005 Implement the single paired-source catalog, pair validation/diagnostics, and catalog-identifier lookup in `src/render/sprites/visualTemplateRegistry.ts`
- [X] T006 Define and validate the configured `defaultTemplateId` against the shared catalog in `src/render/sprites/visualTemplateConfig.ts`
- [X] T007 Extend initial, scenario-start, and menu-return state transitions to initialize or preserve the session-wide active template in `src/app/state/gameState.ts`
- [X] T008 Adapt the visual-template catalog/resolver boundary to build dedicated results from the active catalog entry while retaining existing fallbacks in `src/render/sprites/visualTemplateCatalog.ts` and `src/render/sprites/visualTemplateResolver.ts`
- [X] T009 [P] Add catalog/default-template public contract coverage in `tests/contract/templateCatalog.contract.test.ts`
- [X] T010 [P] Add active-template lifecycle and resolver integration coverage in `tests/integration/render/templateSelectionFlow.test.ts`

**Checkpoint**: The app has one validated source list, a configuration-owned default, and a session-level active template available to all subsequent surfaces.

---

## Phase 3: User Story 1 - Choose a Visual Template for Gameplay (Priority: P1) MVP

**Goal**: Let a game user view valid catalogued templates, start from the configured default, and switch active game visuals without losing progress.

**Independent Test**: Start a scenario, confirm the configured default is selected, choose each ready template from the gameplay control, and verify map/battle visuals change while scenario, hero, battle, and viewport state stay intact.

### Tests for User Story 1

- [X] T011 [P] [US1] Add gameplay selector UI contract coverage for catalog options, default state, and one active selection in `tests/contract/templateCatalog.contract.test.ts`
- [X] T012 [P] [US1] Add game-state/render integration coverage proving selection changes only visual inputs in `tests/integration/render/templateSelectionFlow.test.ts`
- [X] T013 [P] [US1] Add Playwright coverage for default selection and in-session map/battle template switching in `tests/acceptance/gameplay-template-selector.spec.ts`

### Implementation for User Story 1

- [X] T014 [US1] Render the active-template dropdown and catalog diagnostics in the map and battle HUDs in `src/ui/hud/mapHud.ts` and `src/ui/overlays/battleHud.ts`
- [X] T015 [US1] Bind gameplay selector changes to the shared active-template state and force resolver-backed scene refreshes without resetting play state in `src/app/bootstrap/startGame.ts`
- [X] T016 [US1] Pass the active catalog-derived resolver inputs through map and battle canvas rendering in `src/app/scene-controller/mapScene.ts`, `src/app/scene-controller/battleScene.ts`, `src/render/canvas/renderMapScene.ts`, and `src/render/canvas/renderBattleScene.ts`

**Checkpoint**: User Story 1 is independently demonstrable: game sessions begin with the configured default and can change only their visual template.

---

## Phase 4: User Story 2 - Review a Chosen Template in the Storybook (Priority: P1)

**Goal**: Let artists and developers inspect storybook subjects and state transitions using the same active catalog entry as gameplay.

**Independent Test**: Open the storybook from a running session, confirm it shows the gameplay selection, switch templates and subject states, and verify the preview uses the shared resolver and stays visible through fallbacks.

### Tests for User Story 2

- [X] T017 [P] [US2] Add storybook selector and shared-active-template UI contract coverage in `tests/contract/templateCatalog.contract.test.ts`
- [X] T018 [P] [US2] Add resolver-backed storybook selection/state integration coverage in `tests/integration/render/templateSelectionFlow.test.ts`
- [X] T019 [P] [US2] Add Playwright coverage for switching templates and states in the storybook in `tests/acceptance/storybook-template-selector.spec.ts`

### Implementation for User Story 2

- [X] T020 [US2] Render the shared active-template dropdown and source feedback in `src/ui/overlays/storybookPanel.ts`
- [X] T021 [US2] Bind storybook selector changes to the common active-template state while retaining subject/state selections where valid in `src/app/scene-controller/storybookScene.ts` and `src/app/state/gameState.ts`
- [X] T022 [US2] Resolve storybook preview tiles from the active catalog entry through the shared visual resolver in `src/render/canvas/renderStorybookScene.ts` and `src/render/sprites/visualTemplateResolver.ts`

**Checkpoint**: User Story 2 is independently demonstrable: storybook preview and state switching share exactly the template selected by gameplay.

---

## Phase 5: User Story 3 - Select an Atlas in the Asset Mapper (Priority: P1)

**Goal**: Let a developer select a catalogued template in the mapper and safely review, export, or save only that template's coordinate map.

**Independent Test**: Select each catalog entry in the mapper; verify its source image, gallery, and map load; make a change to one source; confirm a dirty-switch warning and verify a successful save cannot alter another source.

### Tests for User Story 3

- [X] T023 [P] [US3] Add template-scoped mapper load/save and dirty-switch UI contract coverage in `tests/contract/sprite-mapping.contract.test.ts`
- [X] T024 [P] [US3] Add selected-source client, validation, export, and save-isolation integration coverage in `tests/integration/developer/spriteMappingSaveFlow.test.ts`
- [X] T025 [P] [US3] Add Playwright coverage for mapper source switching, discard confirmation, and selected-map-only save in `tests/acceptance/sprite-mapping-template-selector.spec.ts`

### Implementation for User Story 3

- [ ] T026 [US3] Make local Vite atlas list/load/image/save middleware resolve only registered catalog identifiers and write only the selected pair's JSON map in `vite.config.ts`
- [ ] T027 [US3] Add catalog-identifier parameters to mapper list/load/save client calls in `src/developer/sprite-mapping/atlasMappingClient.ts`
- [ ] T028 [US3] Add the shared active-template dropdown, source-specific status, and dirty-switch affordance to `src/ui/overlays/spriteMappingPanel.ts`
- [ ] T029 [US3] Load mapper state by active catalog identifier, confirm dirty source replacement, isolate changes by loaded identifier, and refresh only the saved source in `src/app/scene-controller/spriteMappingScene.ts`

**Checkpoint**: User Story 3 is independently demonstrable: mapper editing and persistence are safely scoped to the selected catalog entry.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete three-surface workflow, protect regressions, and keep artifacts aligned.

- [ ] T030 [P] Add incomplete-pair, invalid-default, missing-state fallback, and cross-surface-consistency regression coverage in `tests/contract/templateCatalog.contract.test.ts` and `tests/integration/render/templateSelectionFlow.test.ts`
- [ ] T031 [P] Update legacy visual-template and sprite-mapping focused test commands to include relevant selector regressions in `package.json`
- [ ] T032 Run the end-to-end validation scenarios in `specs/019-template-selector/quickstart.md` and record any fixture limitations in `specs/019-template-selector/quickstart.md`
- [ ] T033 Verify implementation and test evidence against [spec.md](spec.md), [plan.md](plan.md), and [template-selection.md](contracts/template-selection.md); update only these feature artifacts if behavior changed during implementation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies; establish catalog assets and the focused test command.
- **Phase 2**: Depends on Phase 1; blocks all dropdown and selected-source behavior.
- **US1 (Phase 3)**: Depends on Phase 2; delivers the MVP active-template behavior.
- **US2 (Phase 4)**: Depends on Phase 2 and consumes the shared session/resolver seam; it does not require the gameplay UI to be complete to be integration-testable.
- **US3 (Phase 5)**: Depends on Phase 2 and the canonical catalog assets; it does not require storybook UI work.
- **Phase 6**: Depends on the desired user-story phases being complete.

### User Story Dependencies

- **US1 (P1)**: First delivery/MVP; proves the configured default and session-wide visual switch.
- **US2 (P1)**: Uses the Phase 2 active-template seam and verifies cross-surface consistency with US1 once both are present.
- **US3 (P1)**: Uses the Phase 2 catalog seam and establishes source-scoped mapper persistence; it can be implemented in parallel with US2 after foundation work.

### Parallel Opportunities

- T002 and T003 can proceed in parallel once the canonical catalog naming convention is chosen.
- T009 and T010 can proceed in parallel after T004–T008 establish public seams.
- Within US1, T011–T013 can proceed in parallel; implementation remains ordered T014 → T015 → T016.
- US2 tests T017–T019 can proceed in parallel; US2 can be implemented alongside US3 after Phase 2.
- US3 tests T023–T025 can proceed in parallel; T026 can proceed alongside test authoring, followed by T027 → T028/T029.

---

## Parallel Example: User Story 2 and User Story 3

```text
Task: "Add storybook selector and shared-active-template UI contract coverage in tests/contract/storybookTemplateSelector.contract.test.ts"
Task: "Add selected-source client, validation, export, and save-isolation integration coverage in tests/integration/developer/spriteMappingTemplateSelectionFlow.test.ts"
Task: "Add Playwright coverage for switching templates and states in the storybook in tests/acceptance/storybook-template-selector.spec.ts"
Task: "Add Playwright coverage for mapper source switching, discard confirmation, and selected-map-only save in tests/acceptance/sprite-mapping-template-selector.spec.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2 so the catalog, configured default, session selection, and resolver seam exist.
2. Complete Phase 3 and run its contract, integration, and acceptance tests.
3. Demonstrate default selection plus safe in-session gameplay switching before adding review/editor surfaces.

### Incremental Delivery

1. Deliver US1 as the default-configured gameplay template selector.
2. Deliver US2 as resolver-identical storybook review.
3. Deliver US3 as catalog-scoped mapper review and persistence.
4. Complete Phase 6 regression coverage and the quickstart workflow.
