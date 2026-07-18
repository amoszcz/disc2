# Tasks: Relocate Map Controls

**Input**: Design documents from `/specs/014-relocate-map-controls/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [gameplay-control-layout.md](contracts/gameplay-control-layout.md)

**Tests**: Automated contract, integration, and Playwright acceptance coverage is required for every changed player-visible behavior, per the project constitution.

**Organization**: Tasks are grouped by user story so each slice can be implemented, validated, and demonstrated independently.

## Phase 1: Setup (Shared Test Entry Point)

**Purpose**: Make focused feature validation repeatable without adding dependencies.

- [X] T001 Add a `test:controls` script covering the feature's contract and integration test files in `package.json`.

---

## Phase 2: Foundational (Shared Scene Composition)

**Purpose**: Establish dedicated DOM regions around the canvas that scene-specific controls can use without changing map or battle game rules.

**CRITICAL**: Complete this phase before starting either P1 story.

- [X] T002 Add stable scene-specific adjacent-to-canvas and below-canvas mount regions, with scene/layout data attributes, in `src/app/bootstrap/startGame.ts`.
- [X] T003 Style the shared mount regions to preserve canvas sizing and responsive phone/desktop placement in `index.html`.
- [X] T004 Add a shell-layout contract covering the mount-region placement and responsive data attributes in `tests/contract/gameplay-control-layout.contract.test.ts`.

**Checkpoint**: The shared shell is ready for a map side bar and a battle-below-canvas queue without modifying gameplay engines.

---

## Phase 3: User Story 1 - Reach Map Actions Without Page Scrolling (Priority: P1) MVP

**Goal**: Present all required existing map actions, including End Turn and map zoom, as a narrow vertical icon bar beside the map and retain their exact current behavior on phone and desktop layouts.

**Independent Test**: At a 390 × 844 touch viewport and a desktop viewport, start a scenario, activate Zoom In, Zoom Out, and End Turn from the side bar without document scrolling, and verify the same viewport/turn outcomes as existing controls.

### Tests for User Story 1

- [X] T005 [P] [US1] Add map-action-bar markup, available/disabled state, accessible-name, and one-control-per-action contract coverage in `tests/contract/gameplay-control-layout.contract.test.ts`.
- [X] T006 [P] [US1] Add real map action binding and state-transition coverage for zoom and End Turn in `tests/integration/map/mapActionBarFlow.test.ts`.
- [X] T007 [P] [US1] Add phone and desktop no-document-scroll action-bar acceptance coverage in `tests/acceptance/map-action-bar.spec.ts`.

### Implementation for User Story 1

- [X] T008 [US1] Create the ordered Map Action Presentation renderer for End Turn, Zoom In, and Zoom Out, with stable IDs and icon-only visible labels, in `src/ui/panels/mapActionBar.ts`.
- [X] T009 [US1] Extract/reuse the existing End Turn and centered zoom action handlers so `src/app/scene-controller/mapScene.ts` binds the new map action bar without duplicating game-state mutations.
- [X] T010 [US1] Mount the map action bar only for map scenes and remove the relocated controls from the sidebar markup in `src/app/bootstrap/startGame.ts`, `src/ui/hud/mapHud.ts`, and `src/ui/panels/endTurnPanel.ts`.
- [X] T011 [US1] Add thin vertical map-action-bar icon, available, disabled, and responsive adjacent-to-map styles in `index.html`.

**Checkpoint**: A player can complete required map actions beside the map without page scrolling, while map rules and existing sidebar information remain intact.

---

## Phase 4: User Story 3 - Follow Battle Turn Order Below the Canvas (Priority: P1)

**Goal**: Show the current battle turn order horizontally below the battle canvas using dedicated unit templates or readable fallbacks, and update it from the existing battle state.

**Independent Test**: Start a battle, verify the ordered queue below the canvas matches `battle.turnQueue`, confirm each entry identifies its unit and uses a resolved template/fallback, then take actions and verify the active entry and order update.

### Tests for User Story 3

- [X] T012 [P] [US3] Add contract coverage for horizontal below-canvas queue markup, order, active entry, unit label, and template/fallback markers in `tests/contract/gameplay-control-layout.contract.test.ts`.
- [X] T013 [P] [US3] Add battle-state integration coverage proving queue presentations track queue advancement and omit defeated/ineligible units in `tests/integration/battle/battleQueuePresentationFlow.test.ts`.
- [X] T014 [P] [US3] Add browser acceptance coverage for below-canvas horizontal placement, current-order updates, and template/fallback queue entries in `tests/acceptance/battle-turn-queue.spec.ts`.

### Implementation for User Story 3

- [X] T015 [US3] Create a Battle Queue Entry Presentation renderer that derives ordered unit entries, active state, labels, and resolved unit visual templates from current battle state in `src/ui/panels/battleTurnQueue.ts`.
- [X] T016 [US3] Add a reusable DOM-safe visual-template thumbnail/fallback rendering seam for queue entries, reusing existing unit template resolution and invalidation behavior, in `src/render/sprites/visualTemplateResolver.ts`.
- [X] T017 [US3] Remove the sidebar text queue and mount/bind the horizontal battle queue below the canvas for battle scenes in `src/ui/overlays/battleHud.ts`, `src/app/scene-controller/battleScene.ts`, and `src/app/bootstrap/startGame.ts`.
- [X] T018 [US3] Add responsive horizontal queue, active-entry, dedicated-template, fallback, and overflow-without-canvas-overlap styles in `index.html`.

**Checkpoint**: Battles show an accurate, horizontal, template-backed unit queue below the canvas without altering initiative or battle actions.

---

## Phase 5: User Story 2 - Understand Compact Icon Controls (Priority: P2)

**Goal**: Make every compact map icon discoverable on pointer-capable devices while keeping touch activation independent of hover.

**Independent Test**: At a desktop pointer viewport, hover every map action icon and confirm its tooltip is the exact action name; at a touch viewport, activate the same icons without hover.

### Tests for User Story 2

- [X] T019 [P] [US2] Add contract coverage requiring action-name tooltip metadata and unchanged icon-only presentation in `tests/contract/gameplay-control-layout.contract.test.ts`.
- [X] T020 [P] [US2] Add pointer-hover tooltip and touch-activation acceptance coverage for every map action icon in `tests/acceptance/map-action-bar.spec.ts`.

### Implementation for User Story 2

- [X] T021 [US2] Add exact action-name tooltip metadata and accessible names to every map action icon in `src/ui/panels/mapActionBar.ts`.
- [X] T022 [US2] Finalize hover/focus-visible styling so tooltip affordances stay readable within the viewport and do not permanently widen the side bar in `index.html`.

**Checkpoint**: Pointer users can discover each compact icon by name, while touch-only users continue to operate all required map actions directly.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Validate that the three delivered UI slices remain consistent with existing mobile, combat, and visual-template behavior.

- [X] T023 [P] Run and fix focused control-layout validation through the `test:controls` script in `package.json`.
- [X] T024 [P] Run and fix mobile, combat, and visual-template regression suites using `package.json` scripts and `tests/acceptance/` coverage.
- [X] T025 Run the production build and perform the manual scenarios in `specs/014-relocate-map-controls/quickstart.md`.
- [X] T026 Reconcile completed work with [spec.md](spec.md), [plan.md](plan.md), and [gameplay-control-layout.md](contracts/gameplay-control-layout.md), updating only feature artifacts that are inaccurate.

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: Starts immediately.
- **Phase 2**: Depends on T001; it blocks the two P1 story implementations because it establishes the mount regions and responsive composition.
- **US1 (Phase 3)**: Depends on Phase 2. It is the MVP and has no dependency on US2 or US3.
- **US3 (Phase 4)**: Depends on Phase 2. It has no gameplay dependency on US1 or US2 and may proceed in parallel with US1 when staffed.
- **US2 (Phase 5)**: Depends on the US1 action-bar renderer and its compact icon markup (T008–T011).
- **Polish (Phase 6)**: Depends on all desired story phases being complete.

### User Story Dependencies

- **US1 (P1)**: Independent after the shared shell; owns existing map action relocation and behavior preservation.
- **US3 (P1)**: Independent after the shared shell; owns read-only battle queue presentation and has no dependency on map actions.
- **US2 (P2)**: Depends only on the compact map-action bar created by US1; it does not change map action behavior.

### Parallel Opportunities

- T005–T007 can be authored in parallel because they cover different test layers.
- T012–T014 can be authored in parallel because they cover different test layers.
- After Phase 2, US1 and US3 may be implemented by separate developers; coordinate shared edits to `src/app/bootstrap/startGame.ts` and `index.html`.
- T019 and T020 can be written in parallel after the US1 markup contract is stable.
- T023 and T024 can run in parallel after implementation completes.

## Parallel Example: User Story 1

```text
Task: "Add map action-bar markup contract coverage in tests/contract/gameplay-control-layout.contract.test.ts"
Task: "Add map action binding integration coverage in tests/integration/map/mapActionBarFlow.test.ts"
Task: "Add phone and desktop action-bar acceptance coverage in tests/acceptance/map-action-bar.spec.ts"
```

## Parallel Example: User Story 3

```text
Task: "Add battle queue contract coverage in tests/contract/gameplay-control-layout.contract.test.ts"
Task: "Add battle queue state integration coverage in tests/integration/battle/battleQueuePresentationFlow.test.ts"
Task: "Add below-canvas queue browser acceptance coverage in tests/acceptance/battle-turn-queue.spec.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001–T004 to establish a stable shell and focused test entry point.
2. Complete T005–T011 to deliver the map side bar and preserve map actions.
3. Run the US1-focused tests and manually verify a phone viewport before proceeding.

### Incremental Delivery

1. Deliver US1 for immediately reachable map actions.
2. Deliver US3 as an independent battle-information improvement.
3. Deliver US2 to improve icon discoverability without changing behavior.
4. Run cross-cutting regressions and the production build.

## Notes

- Every task follows the required checkbox, ID, optional parallel marker, story label, and file-path format.
- The battle engine, turn engine, scenario data, and Canvas battle/map rules are intentionally excluded from implementation tasks because this feature must not change them.
