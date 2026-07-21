# Tasks: Strategy UX Clarity

**Input**: Design documents from `/specs/023-strategy-ux/`

**Tests**: Include contracts, integration flows, and desktop/mobile acceptance proof for every player-facing decision and recovery path.

## Phase 1: Setup

- [X] T001 Record the existing map, battle, and end-turn decision states and their retained game-rule boundaries in `specs/023-strategy-ux/contracts/strategy-ux-ui.md`

## Phase 2: Foundational Decision Presentation

- [ ] T002 Create shared derived decision-preview and availability-explanation helpers from current game state in `src/ui/`
- [X] T003 Add contract coverage for derived selection, consequence, availability, and recovery presentations in `tests/contract/strategy-ux.contract.test.ts`

## Phase 3: User Story 1 - Planned Map Actions (P1)

**Goal**: Let players understand, replace, or cancel a route before movement commits.

**Independent Test**: Desktop and touch flows show selection, cost, known effects, invalid-route reason, and cancellation without consuming movement.

- [X] T004 [P] [US1] Add map decision-preview and recovery contract coverage in `tests/contract/strategy-ux.contract.test.ts`
- [ ] T005 [P] [US1] Add route preview, replacement, cancellation, and stale-preview integration coverage in `tests/integration/map/strategyUxRouteFlow.test.ts`
- [X] T006 [US1] Render selected subject, known route consequences, confirmation state, and recovery affordance in `src/ui/hud/mapHud.ts`
- [ ] T007 [US1] Bind explicit route cancellation and preserve replacement behavior without changing movement rules in `src/app/scene-controller/mapInputController.ts` and `src/engine/map/routePreviewState.ts`
- [X] T008 [US1] Present invalid destination and traversal-blocked explanations in the relevant map context in `src/app/scene-controller/mapScene.ts` and `src/ui/panels/mapActionBar.ts`
- [ ] T009 [US1] Add desktop and touch acceptance coverage for map preview and recovery in `tests/acceptance/strategy-ux-map.spec.ts`

## Phase 4: User Story 2 - Battle and Turn Availability (P2)

**Goal**: Explain battle and end-turn availability and known consequences before commitment.

**Independent Test**: Legal and illegal strike, defend, and end-turn paths display a specific reason or consequence across desktop and mobile layouts.

- [X] T010 [P] [US2] Add battle and end-turn availability contract coverage in `tests/contract/strategy-ux.contract.test.ts`
- [ ] T011 [P] [US2] Add battle target replacement and unavailable-action integration coverage in `tests/integration/battle/strategyUxBattleFlow.test.ts`
- [X] T012 [US2] Render specific Strike and Defend blocking reasons, selected-target effect, and target recovery in `src/ui/overlays/battleHud.ts`
- [X] T013 [US2] Bind target clearing or replacement without changing battle resolution rules in `src/app/scene-controller/battleInputController.ts`
- [X] T014 [US2] Render a distinct end-turn consequence summary and unavailable reason in `src/ui/panels/mapActionBar.ts` and `src/ui/hud/mapHud.ts`
- [ ] T015 [US2] Add desktop and touch acceptance coverage for battle and end-turn clarity in `tests/acceptance/strategy-ux-battle-turn.spec.ts`

## Phase 5: User Story 3 - Consistent Direct Controls (P3)

**Goal**: Keep primary controls named, discoverable, and operable without hover across layouts.

**Independent Test**: Keyboard and touch-capable flows complete representative menu, map, battle, settings, and victory actions without hidden essential feedback.

- [ ] T016 [P] [US3] Add responsive placement and non-hover feedback contract coverage in `tests/contract/strategy-ux.contract.test.ts`
- [X] T017 [P] [US3] Add keyboard and mobile acceptance coverage for named primary controls in `tests/acceptance/strategy-ux-controls.spec.ts`
- [ ] T018 [US3] Apply shared visual hierarchy and visible availability/recovery feedback across map, battle, menu, settings, and victory UI in `src/ui/hud/mapHud.ts`, `src/ui/overlays/battleHud.ts`, `src/ui/overlays/mainMenu.ts`, `src/ui/overlays/settingsPanel.ts`, and `src/ui/overlays/victoryMenu.ts`
- [ ] T019 [US3] Preserve reachable, non-overlapping primary controls and visible focus feedback at mobile breakpoints in `index.html`

## Phase 6: Polish and Validation

- [X] T020 [P] Run the production build and resolve failures through `package.json`
- [X] T021 [P] Run focused map, battle, menu, mobile, and strategy UX suites from `specs/023-strategy-ux/quickstart.md`
- [X] T022 Execute desktop keyboard and touch-capable browser validation from `specs/023-strategy-ux/quickstart.md`
- [ ] T023 Verify delivered behavior matches `specs/023-strategy-ux/spec.md`, `specs/023-strategy-ux/plan.md`, and `specs/023-strategy-ux/contracts/strategy-ux-ui.md`

## Dependencies & Execution Order

- T001–T003 establish the shared decision presentation foundation.
- US1, US2, and US3 depend on the foundation; US1 is the MVP.
- T006–T008 and T012–T014 are sequential within their UI/controller files.
- Marked `[P]` tasks use separate files and can proceed in parallel.
- Complete T020–T023 after all desired stories.

## Parallel Example: User Story 1

```text
Task: "Add route decision contracts in tests/contract/strategy-ux.contract.test.ts"
Task: "Add route integration coverage in tests/integration/map/strategyUxRouteFlow.test.ts"
```

## Implementation Strategy

1. Complete the derived decision presentation foundation.
2. Deliver map clarity and recovery (US1), then validate it independently.
3. Deliver battle/turn explanations (US2) and cross-device consistency (US3).
4. Run all browser and regression validation before completion.
