# Tasks: Animate Path Movement

**Input**: Design documents from `/specs/020-animate-path-movement/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [contracts/game-settings-and-traversal.md](contracts/game-settings-and-traversal.md), [quickstart.md](quickstart.md)

**Tests**: Automated tests are required for all behavior changes by the project constitution. Prefer contract, integration, and acceptance coverage.

**Organization**: Tasks are grouped by user story so each increment can be completed and proven independently.

## Phase 1: Setup

**Purpose**: Establish the feature's focused validation entry points.

- [X] T001 Add focused `test:settings` and `test:route-traversal` scripts in `package.json` for this feature's contract and integration suites.
- [X] T002 [P] Add the test identifiers specified by the UI contract to `specs/020-animate-path-movement/contracts/game-settings-and-traversal.md` only if implementation needs to refine their exact names.

---

## Phase 2: Foundational

**Purpose**: Create shared state and engine seams required by timed traversal and persisted preferences.

**CRITICAL**: Complete this phase before user-story work.

- [X] T003 Extend scene, settings, and traversal type definitions in `src/engine/scenario/types.ts` for movement behavior, active traversal state, settings return context, and a `settings` scene mode.
- [X] T004 Create validated versioned browser-settings load/save/default functions in `src/app/state/gameSettings.ts`, including safe fallback for malformed storage and unavailable template IDs.
- [X] T005 Refactor route execution in `src/engine/map/heroActions.ts` into reusable single-step and completion/continuation operations while preserving the existing immediate `confirmRoutePreview` outcome.
- [X] T006 Wire the default or persisted game settings and empty traversal state into state creation, scenario start, and return-to-menu transitions in `src/app/state/gameState.ts`.
- [X] T007 Add shared traversal cleanup rules for scene changes, battle entry, map travel, and forced stops in `src/app/state/gameState.ts` and `src/app/scene-controller/mapInputController.ts`.

**Checkpoint**: State, persistence validation, and one-step movement seams are ready for story work.

---

## Phase 3: User Story 1 - Watch a Hero Traverse a Confirmed Route (Priority: P1) MVP

**Goal**: A confirmed route visibly advances a hero through legal route tiles at one tile per second rather than teleporting to its endpoint.

**Independent Test**: Confirm a multi-tile route with animated behavior and observe ordered one-second steps, correct movement costs, and correct partial/forced-stop behavior.

### Tests for User Story 1

- [X] T008 [P] [US1] Add route-traversal timing, ordered-step, input-lock, partial-route, and forced-stop contract coverage in `tests/contract/route-traversal.contract.test.ts`.
- [X] T009 [P] [US1] Add fake-timer integration coverage for per-step map state updates, route continuation, travel links, and encounter stops in `tests/integration/map/routeTraversalFlow.test.ts`.
- [X] T010 [P] [US1] Add browser acceptance coverage for a multi-tile one-tile-per-second route in `tests/acceptance/animated-route-traversal.spec.ts`.

### Implementation for User Story 1

- [X] T011 [US1] Implement a single-active-traversal timer controller that advances one legal route step per second and disposes safely in `src/app/scene-controller/mapTraversalController.ts`.
- [X] T012 [US1] Route confirmed map input through the traversal controller, reject competing movement during traversal, and preserve existing immediate feedback in `src/app/scene-controller/mapInputController.ts`.
- [X] T013 [US1] Render active traversal status and current completed step in `src/ui/hud/mapHud.ts` and bind its state updates from `src/app/scene-controller/mapScene.ts`.
- [X] T014 [US1] Create, start, and dispose the traversal controller with application lifecycle events in `src/app/bootstrap/startGame.ts`.

**Checkpoint**: Animated route traversal is independently usable and proven without the settings page.

---

## Phase 4: User Story 2 - Configure Map Movement Behavior (Priority: P2)

**Goal**: Players can select animated or immediate movement, with animated as the default and the selected behavior surviving reloads.

**Independent Test**: Change movement behavior, confirm routes in both modes, reload the game, and verify the next route uses the saved selection without changing its legal endpoint.

### Tests for User Story 2

- [X] T015 [P] [US2] Add settings defaults, validation, persistence, and behavior-selection contract coverage in `tests/contract/game-settings.contract.test.ts`.
- [X] T016 [P] [US2] Add browser-storage integration coverage for load, malformed-value fallback, save, reload, and scenario-transition retention in `tests/integration/foundation/gameSettingsPersistenceFlow.test.ts`.
- [X] T017 [P] [US2] Add acceptance coverage for switching animated/immediate behavior and observing the next route's presentation in `tests/acceptance/game-settings.spec.ts`.

### Implementation for User Story 2

- [X] T018 [US2] Add game-settings state update actions that persist a validated movement behavior and expose it to route confirmation in `src/app/state/gameState.ts` and `src/app/state/gameSettings.ts`.
- [X] T019 [US2] Make `src/app/scene-controller/mapInputController.ts` choose immediate route execution or the active traversal controller based on the captured movement behavior at confirmation time.
- [X] T020 [US2] Implement movement behavior selection and current-value presentation in `src/ui/overlays/settingsPanel.ts`.

**Checkpoint**: Players can choose and persist animated or immediate movement; each route retains the behavior selected when it starts.

---

## Phase 5: User Story 3 - Manage Game Visuals in Dedicated Settings (Priority: P2)

**Goal**: A dedicated Settings page exposes both game preferences, preserves gameplay state when opened from a scenario, and relocates game template switching out of the map HUD.

**Independent Test**: Open Settings from the menu and map, choose a valid template, return without resetting the scenario, reload, and verify the chosen template remains active while storybook and mapper controls continue to work.

### Tests for User Story 3

- [X] T021 [P] [US3] Extend settings UI and game-template relocation contract coverage in `tests/contract/game-settings.contract.test.ts`.
- [X] T022 [P] [US3] Extend the settings acceptance flow for menu/map entry, return context, template persistence, and absence of `map-template-selector` in `tests/acceptance/game-settings.spec.ts`.
- [X] T023 [P] [US3] Update gameplay template-selector regression coverage to use Settings while retaining storybook and mapper coverage in `tests/acceptance/gameplay-template-selector.spec.ts`.

### Implementation for User Story 3

- [X] T024 [US3] Add settings navigation state and open/return actions that retain scenario, selected hero, map view, and route state in `src/app/state/gameState.ts`.
- [X] T025 [US3] Add Settings entry actions to the main menu and map controls in `src/ui/overlays/mainMenu.ts` and `src/ui/hud/mapHud.ts`.
- [X] T026 [US3] Reuse the shared ready-template selector and bind template plus movement updates in `src/ui/overlays/settingsPanel.ts` and `src/ui/visualTemplateSelector.ts`.
- [X] T027 [US3] Render and bind the `settings` scene, including return-to-origin behavior and visual-template refresh, in `src/app/bootstrap/startGame.ts` and `src/app/scene-controller/sceneController.ts`.
- [X] T028 [US3] Remove the gameplay template selector and its binding while leaving storybook and sprite-mapping selectors unchanged in `src/ui/hud/mapHud.ts` and `src/app/scene-controller/mapScene.ts`.

**Checkpoint**: Settings is a dedicated persisted game-preferences page, and gameplay template switching is exclusively located there.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Demonstrate compatibility and document final validation.

- [X] T029 [P] Run and resolve compatibility regressions in existing route and template suites through `package.json` commands `npm run test:pathfinding` and `npm run test:template-selector`.
- [X] T030 [P] Run the end-to-end scenarios in `specs/020-animate-path-movement/quickstart.md` and record any necessary validation notes in `specs/020-animate-path-movement/quickstart.md`.
- [X] T031 Review implemented behavior against [spec.md](spec.md), [plan.md](plan.md), and [contracts/game-settings-and-traversal.md](contracts/game-settings-and-traversal.md), updating only feature documentation under `specs/020-animate-path-movement/` if needed.

---

## Phase 7: User Story 2 Amendment - Immediate Is the Only Bypass (Priority: P2)

**Goal**: Ensure route confirmation starts timed traversal for every movement setting except `immediate`, so an additional non-immediate setting cannot accidentally make heroes teleport.

**Independent Test**: Confirm a route with `immediate` selected and with a non-immediate compatibility setting selected; only the immediate route completes synchronously, while the other route enters one-tile-per-second traversal.

### Tests for the User Story 2 Amendment

- [X] T032 [P] [US2] Add contract coverage that classifies `immediate` as the exclusive synchronous route mode and every other supported movement setting as animated in `tests/contract/game-settings.contract.test.ts`.
- [X] T033 [P] [US2] Add route-confirmation integration coverage for a non-immediate compatibility setting starting the traversal controller in `tests/integration/map/routeTraversalFlow.test.ts`.
- [X] T034 [P] [US2] Extend browser acceptance coverage to confirm that only the Immediate settings choice completes a route without traversal status in `tests/acceptance/game-settings.spec.ts`.

### Implementation for the User Story 2 Amendment

- [X] T035 [US2] Centralize the immediate-only route-execution predicate with validated movement-setting semantics in `src/app/state/gameSettings.ts` and `src/engine/scenario/types.ts`.
- [X] T036 [US2] Start immediate completion only for the immediate setting and delegate every other setting to `MapTraversalController` in `src/app/scene-controller/mapInputController.ts`.

**Checkpoint**: Immediate is the only synchronous route mode; all non-immediate settings retain one-tile-per-second traversal.

---

## Phase 8: Amendment Validation

**Purpose**: Verify the new immediate-only invariant across documented and compatibility workflows.

- [X] T037 [P] Run focused settings and traversal tests, plus the amended quickstart scenario, and record results in `specs/020-animate-path-movement/quickstart.md`.
- [X] T038 Verify [spec.md](spec.md), [plan.md](plan.md), [data-model.md](data-model.md), [contracts/game-settings-and-traversal.md](contracts/game-settings-and-traversal.md), and `tasks.md` preserve the immediate-only invariant in `specs/020-animate-path-movement/tasks.md`.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies.
- **Phase 2**: Depends on Phase 1 and blocks all stories.
- **US1 (Phase 3)**: Depends on Phase 2; delivers the MVP.
- **US2 (Phase 4)**: Depends on Phase 2 and integrates with US1's traversal controller for animated behavior.
- **US3 (Phase 5)**: Depends on Phase 2; uses US2's settings behavior and can be delivered after it.
- **Polish (Phase 6)**: Depends on all selected user-story phases.
- **US2 Amendment (Phase 7)**: Depends on the completed US2 settings and traversal work; it blocks amendment validation.
- **Amendment Validation (Phase 8)**: Depends on the Phase 7 amendment tasks.

### User Story Dependencies

```text
Foundational
    └── US1: animated traversal (MVP)
          └── US2: movement behavior selection + persistence
                └── US3: settings navigation + template relocation
          └── US2 amendment: immediate-only bypass
```

### Parallel Opportunities

- T004 and test-scaffolding work can proceed independently after the type contract in T003 is settled.
- T008–T010 can be authored in parallel; they target separate test layers.
- T015–T017 can be authored in parallel; they target separate test layers.
- T021–T023 can be authored in parallel; they target separate test files.
- T029 and T030 can run in parallel after all feature work is complete.
- T032–T034 can run in parallel before T035 and T036; T037 can run after the amendment implementation is complete.

## Parallel Example: User Story 1

```text
Task: "Add traversal contract coverage in tests/contract/route-traversal.contract.test.ts"
Task: "Add traversal integration coverage in tests/integration/map/routeTraversalFlow.test.ts"
Task: "Add traversal browser acceptance coverage in tests/acceptance/animated-route-traversal.spec.ts"
```

## Implementation Strategy

### MVP First

1. Complete Phases 1 and 2.
2. Complete US1 (T008–T014).
3. Run the US1 contract, integration, and acceptance tests.
4. Demonstrate a one-tile-per-second multi-tile route before adding settings.

### Incremental Delivery

1. Add the persisted behavior choice (US2) only after timed traversal works.
2. Add Settings navigation and template relocation (US3) without changing storybook or mapper selection flows.
3. Finish with existing route/template regression suites and the quickstart scenarios.
4. Add the US2 amendment tests and immediate-only predicate, then validate that no non-immediate setting bypasses traversal.

## Notes

- Every task uses the required checkbox, ID, optional parallel marker, story label where applicable, and explicit file path.
- Tests are feature-proving and must pass before the corresponding story checkpoint is considered complete.
