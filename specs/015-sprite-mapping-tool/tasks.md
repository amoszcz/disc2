# Tasks: Sprite Mapping Tool

**Input**: Design documents from `/specs/015-sprite-mapping-tool/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [sprite-mapping-tool.md](contracts/sprite-mapping-tool.md)

**Tests**: Contract, integration, and Playwright acceptance coverage is required for each changed developer-visible behavior and for the local save boundary.

**Organization**: Tasks are grouped by user story so review, alignment, and persistence can be implemented and demonstrated independently.

## Phase 1: Setup (Developer Tool Entry Point)

**Purpose**: Add a focused test command and preserve the configured WIP atlas as the one source reviewed by the tool.

- [x] T001 Add a `test:sprite-mapping` script targeting the feature's contract and integration tests in `package.json`.
- [x] T002 Verify and document the configured WIP image and coordinate-map source paths in `wip/sprite-atlas/` and `specs/015-sprite-mapping-tool/quickstart.md`.

---

## Phase 2: Foundational (Atlas Data, Validation, and Developer Scene)

**Purpose**: Create the shared raw-atlas model, coordinate-offset math, whole-map validation, and developer scene wiring required by all user stories.

**CRITICAL**: Complete this phase before user-story UI work.

- [x] T003 Create atlas source, mapping entry, alignment offset, and validation result types in `src/developer/sprite-mapping/atlasMapping.ts`.
- [x] T004 Implement JSON parsing, stable entry identity, shared x/y offset transformation, actual-dimension bounds validation, and metadata-preserving save-map construction in `src/developer/sprite-mapping/atlasMapping.ts`.
- [x] T005 Add Sprite Mapping editor state transitions for load, selection, pan, reset, validation, saving, success, and error in `src/developer/sprite-mapping/spriteMappingState.ts`.
- [x] T006 Add the `sprite-mapping` developer scene mode and state lifecycle in `src/engine/scenario/types.ts`, `src/app/state/gameState.ts`, and `src/app/scene-controller/sceneController.ts`.
- [x] T007 Add a main-menu developer entry that opens the Sprite Mapping scene in `src/ui/overlays/mainMenu.ts` and `src/app/bootstrap/startGame.ts`.
- [x] T008 Add foundational parser, dimension-mismatch, shared-offset, invalid-crop, and metadata-preservation tests in `tests/contract/sprite-mapping.contract.test.ts`.

**Checkpoint**: Raw atlas data can be loaded into developer state, transformed by one shared offset, and validated without touching gameplay template code.

---

## Phase 3: User Story 1 - Review Mapped Sprite Previews (Priority: P1) MVP

**Goal**: Let a developer enter the dedicated page, load the WIP atlas, review every mapping entry, identify invalid crops, and inspect a selected entry's coordinates.

**Independent Test**: Open the page, confirm the source dimensions are visible and any mismatch warning appears when applicable, verify every JSON entry appears in the gallery, select one entry, and verify its detail and crop boundary information update.

### Tests for User Story 1

- [x] T009 [P] [US1] Add gallery, selected-entry, declared-versus-actual dimension, and invalid-entry UI contract coverage in `tests/contract/sprite-mapping.contract.test.ts`.
- [x] T010 [P] [US1] Add loaded-atlas and selected-entry state integration coverage in `tests/integration/developer/spriteMappingReviewFlow.test.ts`.
- [x] T011 [P] [US1] Add browser acceptance coverage for opening the page, reviewing the full gallery, source dimensions, mismatch warning when applicable, and selecting an entry in `tests/acceptance/sprite-mapping-review.spec.ts`.

### Implementation for User Story 1

- [x] T012 [US1] Implement the read-only local atlas loader and decoded-image dimension reader in `src/developer/sprite-mapping/atlasMappingClient.ts`.
- [x] T013 [US1] Render the selected source image, fixed crop boundary, and loading/error states in `src/render/canvas/renderSpriteMappingScene.ts`.
- [x] T014 [US1] Render atlas dimensions, source warnings, selected-entry metadata, validation status, and a complete review gallery in `src/ui/overlays/spriteMappingPanel.ts`.
- [x] T015 [US1] Bind menu entry, atlas load, gallery selection, return-to-menu behavior, and preview-canvas rendering in `src/app/scene-controller/spriteMappingScene.ts` and `src/app/bootstrap/startGame.ts`.
- [x] T016 [US1] Add developer-page, gallery, selected-entry, validation-warning, and responsive review styles in `index.html`.

**Checkpoint**: Developers can review every WIP mapping record and see source dimensions, any applicable mismatch, and invalid crops without any coordinate editing.

---

## Phase 4: User Story 2 - Align the Source Image Against Map Coordinates (Priority: P1)

**Goal**: Let a developer pan the source image beneath fixed crop boundaries, see one shared x/y offset reflected everywhere, and reset a trial alignment.

**Independent Test**: Select a recognisable entry, drag in the alignment canvas, verify the selected and gallery preview positions update with the same displayed offset, then reset and verify all previews return to their loaded-map position.

### Tests for User Story 2

- [x] T017 [P] [US2] Add offset display, fixed-boundary, live-preview, and reset UI contract coverage in `tests/contract/sprite-mapping.contract.test.ts`.
- [x] T018 [P] [US2] Add drag-to-offset, shared-preview transformation, dirty-state, and reset integration coverage in `tests/integration/developer/spriteMappingAlignmentFlow.test.ts`.
- [x] T019 [P] [US2] Add pointer-drag and reset browser acceptance coverage in `tests/acceptance/sprite-mapping-alignment.spec.ts`.

### Implementation for User Story 2

- [x] T020 [US2] Implement source-image pan conversion from canvas pointer movement to source-image coordinate offsets in `src/app/scene-controller/spriteMappingScene.ts`.
- [x] T021 [US2] Update alignment-canvas rendering to translate the image while keeping selected mapping boundaries fixed in `src/render/canvas/renderSpriteMappingScene.ts`.
- [x] T022 [US2] Update gallery previews, offset readout, dirty state, and Reset action in `src/ui/overlays/spriteMappingPanel.ts`.
- [x] T023 [US2] Add pan cursor, fixed-boundary, offset-readout, gallery-preview, and reset styles in `index.html`.

**Checkpoint**: Developers can visually align the entire source image and safely abandon any unsaved trial without changing the JSON map.

---

## Phase 5: User Story 3 - Save a Corrected Coordinate Map (Priority: P1)

**Goal**: Persist a valid shared offset only through a narrowly scoped local development save path, then reload the corrected map and clear the unsaved alignment.

**Independent Test**: Apply a valid non-zero offset, save, reload, and verify every x/y changed by that offset while all non-coordinate metadata remains unchanged; verify invalid offsets cannot be saved.

### Tests for User Story 3

- [ ] T024 [P] [US3] Add save-request validation, allowed-path, production/preview rejection, and metadata-preservation contract coverage in `tests/contract/sprite-mapping-save.contract.test.ts`.
- [ ] T025 [P] [US3] Add successful save/reload, invalid-save prevention, and dirty-discard-warning state integration coverage in `tests/integration/developer/spriteMappingSaveFlow.test.ts`.
- [ ] T026 [P] [US3] Add local-development browser acceptance coverage for valid save/reload, invalid-save messaging, and unsaved navigation warning in `tests/acceptance/sprite-mapping-save.spec.ts`.

### Implementation for User Story 3

- [x] T027 [US3] Add a Vite development-only atlas read/save middleware restricted to `wip/sprite-atlas/game-atlas.json`, with whole-map validation and production/preview rejection, in `vite.config.ts`.
- [x] T028 [US3] Add local atlas-save request and reload behavior, including unavailable-save errors outside development, in `src/developer/sprite-mapping/atlasMappingClient.ts`.
- [x] T029 [US3] Bind explicit Save, invalid-entry feedback, post-save reload, and unsaved-discard confirmation in `src/app/scene-controller/spriteMappingScene.ts`.
- [x] T030 [US3] Add save availability, validation summary, success/error, and unsaved-warning presentation in `src/ui/overlays/spriteMappingPanel.ts` and `index.html`.

**Checkpoint**: A developer can persist one valid shared alignment to the WIP JSON without granting arbitrary file-write access or changing game-play behavior.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Validate local-only persistence, preserve existing game behavior, and reconcile the implementation with the feature contract.

- [x] T031 [P] Run and fix the focused sprite-mapping contract and integration suite through `package.json`.
- [ ] T032 [P] Run and fix existing menu, storybook, visual-template, mobile, and build regressions using `package.json` scripts and `tests/acceptance/` coverage.
- [ ] T033 Run the manual local-development save workflow in `specs/015-sprite-mapping-tool/quickstart.md`, restoring the WIP JSON to its intended fixture data after validation.
- [x] T034 Reconcile completed behavior with [spec.md](spec.md), [plan.md](plan.md), [data-model.md](data-model.md), and [sprite-mapping-tool.md](contracts/sprite-mapping-tool.md).

---

## Phase 7: Amendment Foundation (Effective Crop Rectangles)

**Purpose**: Extend the original position-only mapping model so all consumers use a complete effective x/y/width/height rectangle for each entry.

- [x] T035 Extend entry override, effective crop rectangle, validation, and save-map types in `src/developer/sprite-mapping/atlasMapping.ts`.
- [x] T036 Implement complete-rectangle resolution with loaded-field fallback and entry-override precedence in `src/developer/sprite-mapping/atlasMapping.ts`.
- [x] T037 Update editor change state and dirty/reset transitions for pending width and height overrides in `src/developer/sprite-mapping/spriteMappingState.ts`.
- [x] T038 Add effective-rectangle, width/height validation, and metadata-preservation contract coverage in `tests/contract/sprite-mapping.contract.test.ts`.

**Checkpoint**: Preview, validation, and save consumers can resolve one consistent crop rectangle without mutating the loaded atlas.

---

## Phase 8: User Story 4 - Independently Edit and Inspect a Crop (Priority: P1)

**Goal**: Let a developer change only the selected entry's x/y values and inspect it with zoom without changing unrelated mappings.

**Independent Test**: Edit one selected entry, select another unchanged entry, zoom/reset the view, and verify zoom did not alter either entry's rectangle.

- [ ] T039 [P] [US4] Add selected-only x/y edit, override-precedence, and zoom-does-not-edit-data coverage in `tests/contract/sprite-mapping.contract.test.ts`.
- [ ] T040 [P] [US4] Add selected-edit, sibling-unchanged, dirty/discard, and zoom-state integration coverage in `tests/integration/developer/spriteMappingEditFlow.test.ts` and `tests/integration/developer/spriteMappingZoomFlow.test.ts`.
- [ ] T041 [P] [US4] Add browser acceptance coverage for selected-only x/y editing and zoom/reset behavior in `tests/acceptance/sprite-mapping-edit.spec.ts` and `tests/acceptance/sprite-mapping-zoom.spec.ts`.
- [x] T042 [US4] Render selected x/y controls, edited-entry status, bounded zoom controls, and visible zoom value in `src/ui/overlays/spriteMappingPanel.ts`.
- [x] T043 [US4] Render the selected effective crop boundary at the current zoom and keep review-only navigation separate from mapping data in `src/render/canvas/renderSpriteMappingScene.ts` and `src/app/scene-controller/spriteMappingScene.ts`.

**Checkpoint**: Per-entry position editing and precise visual inspection are independently usable.

---

## Phase 9: User Story 5 - Drag and Resize the Selected Crop (Priority: P1)

**Goal**: Let a developer drag only the selected crop's x/y and adjust its width and height through sliders.

**Independent Test**: Drag one selected crop at a non-default zoom, change both size sliders, and verify only that entry's rectangle and preview change.

- [ ] T044 [P] [US5] Add zoom-aware selected-drag conversion, positive slider dimensions, and invalid-resize contract coverage in `tests/contract/sprite-mapping.contract.test.ts`.
- [ ] T045 [P] [US5] Add selected-drag, slider, invalid-crop, and sibling-unchanged integration coverage in `tests/integration/developer/spriteMappingDragResizeFlow.test.ts`.
- [ ] T046 [P] [US5] Add browser acceptance coverage for selected-only canvas drag and width/height sliders in `tests/acceptance/sprite-mapping-drag.spec.ts` and `tests/acceptance/sprite-mapping-resize.spec.ts`.
- [x] T047 [US5] Bind canvas pointer drag through current zoom to the selected entry's x/y override in `src/app/scene-controller/spriteMappingScene.ts`.
- [x] T048 [US5] Render selected width and height sliders, current crop-size values, and selected invalid-crop feedback in `src/ui/overlays/spriteMappingPanel.ts`.
- [x] T049 [US5] Render selected and gallery previews from effective width/height as well as x/y in `src/render/canvas/renderSpriteMappingScene.ts` and `src/app/scene-controller/spriteMappingScene.ts`.
- [x] T050 [US5] Add selected-drag, crop-size slider, and invalid-crop presentation styles in `index.html`.

**Checkpoint**: A developer can correct the full selected crop rectangle visually without affecting any other mapping.

---

## Phase 10: User Story 6 - Save Mixed Crop Corrections (Priority: P1)

**Goal**: Persist valid x/y/width/height overrides for multiple entries atomically and preserve all unrelated source data.

**Independent Test**: Change complete crop rectangles for two entries, save/reload, and verify both persist while an unedited record and its metadata are unchanged; an invalid rectangle blocks the save.

- [ ] T051 [P] [US6] Add rectangle change-set, stable-entry identity, complete-map validation, and metadata-preservation save contract coverage in `tests/contract/sprite-mapping-save.contract.test.ts`.
- [ ] T052 [P] [US6] Add mixed rectangle save/reload, invalid-save prevention, and discard-warning integration coverage in `tests/integration/developer/spriteMappingSaveFlow.test.ts`.
- [ ] T053 [P] [US6] Add browser acceptance coverage for valid rectangle save/reload, invalid-resize feedback, and discard warning in `tests/acceptance/sprite-mapping-save.spec.ts`.
- [x] T054 [US6] Send complete per-entry crop overrides and reload cleared editor state in `src/developer/sprite-mapping/atlasMappingClient.ts` and `src/app/scene-controller/spriteMappingScene.ts`.
- [x] T055 [US6] Resolve and validate x/y/width/height overrides atomically in the constrained local save route in `vite.config.ts`.
- [x] T056 [US6] Update save availability and mixed crop-change status in `src/ui/overlays/spriteMappingPanel.ts`.

**Checkpoint**: Valid position-and-size corrections persist atomically through the existing local-only write boundary.

---

## Phase 11: Amended Validation

- [x] T057 [P] Run and fix the focused Sprite Mapping contract and integration suite through `package.json`.
- [x] T058 [P] Run and fix Sprite Mapping browser acceptance tests in `tests/acceptance/sprite-mapping-*.spec.ts`.
- [ ] T059 Run the amended manual drag, slider, invalid-crop, and save/reload workflow in `specs/015-sprite-mapping-tool/quickstart.md`, restoring the WIP fixture afterward.
- [ ] T060 Reconcile amended implementation with `specs/015-sprite-mapping-tool/spec.md`, `plan.md`, `data-model.md`, and `contracts/sprite-mapping-tool.md`.

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Starts immediately.
- **Phase 2**: Depends on T001–T002 and blocks all story work because it establishes raw data, validation, editor state, and scene entry.
- **US1 (Phase 3)**: Depends on Phase 2 and is the MVP.
- **US2 (Phase 4)**: Depends on US1's loaded page and canvas, but remains non-persistent and independently demonstrable.
- **US3 (Phase 5)**: Depends on foundational validation and may be implemented after US1; it uses US2's offset state to make saving observable.
- **Polish (Phase 6)**: Depends on all desired stories.

### User Story Dependencies

- **US1 (P1)**: Starts after the foundational data/state seam; no dependency on alignment or persistence.
- **US2 (P1)**: Depends on US1's gallery and alignment canvas but does not depend on the local save adapter.
- **US3 (P1)**: Depends on the foundational offset/validation seam and uses US1's loaded source; it does not alter review or pan rendering rules.

### Parallel Opportunities

- T003–T005 can be parallelized after agreeing on exported atlas types because they target separate data/state responsibilities.
- T009–T011, T017–T019, and T024–T026 can be written in parallel as contract, integration, and browser coverage for their respective stories.
- After Phase 2, gallery/panel work and low-level canvas rendering can proceed in parallel while coordinating their shared presentation model.
- T031 and T032 can run in parallel after all implementation work completes.

## Parallel Example: User Story 1

```text
Task: "Add sprite mapping UI contract coverage in tests/contract/sprite-mapping.contract.test.ts"
Task: "Add loaded-atlas state integration coverage in tests/integration/developer/spriteMappingReviewFlow.test.ts"
Task: "Add gallery browser acceptance coverage in tests/acceptance/sprite-mapping-review.spec.ts"
```

## Parallel Example: User Story 3

```text
Task: "Add save-boundary contract coverage in tests/contract/sprite-mapping-save.contract.test.ts"
Task: "Add save/reload state integration coverage in tests/integration/developer/spriteMappingSaveFlow.test.ts"
Task: "Add local-development save browser coverage in tests/acceptance/sprite-mapping-save.spec.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001–T008 to establish data parsing, validation, scene state, and menu access.
2. Complete T009–T016 to deliver the read-only review page.
3. Run the review tests and inspect the real WIP source dimensions before adding editing.

### Incremental Delivery

1. Deliver US1 for reliable atlas inspection and invalid-data visibility.
2. Deliver US2 for reversible whole-image alignment.
3. Deliver US3 for explicit, validated local persistence.
4. Run cross-cutting gameplay regressions and the production build.

## Notes

- Every task follows the required checkbox, ID, optional parallel marker, story label, and file-path format.
- The local save adapter is intentionally limited to the configured WIP coordinate map; it must not become a general repository file API.
- The manual save validation must restore fixture data so it does not accidentally commit a test alignment.
- **Amended scope pending task generation**: Independent per-entry x/y editing, visual-only zoom, selected-only canvas drag, width/height sliders, and mixed rectangle persistence are specified in the amendment to `spec.md` and `plan.md`. Generate their implementation tasks from this authoritative feature directory before proceeding.
