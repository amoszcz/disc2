# Tasks: Shared Tactile Button Component

**Input**: Design documents from `/specs/022-button-component/`

**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), and [button-ui-contract.md](contracts/button-ui-contract.md)

**Tests**: Automated contract and browser-level checks are included because this feature changes every user-facing control and its interaction feedback.

**Organization**: Tasks are grouped by user story so each slice can be validated independently after the shared renderer foundation is available.

## Phase 1: Setup (Shared Inventory)

**Purpose**: Establish the migration scope and test targets before changing control markup.

- [X] T001 Audit current rendered button locations and record their retained IDs, test hooks, action data, and availability rules in `specs/022-button-component/contracts/button-ui-contract.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Provide the shared renderer required by every user story.

**CRITICAL**: No user-story migration begins until this phase is complete.

- [X] T002 Create the common button renderer with native button semantics, content, identity, accessibility, action-data, and availability inputs in `src/ui/components/button.ts`
- [X] T003 Add foundational contract coverage for default button output, supplied identity metadata, disabled behavior, and icon-only accessible naming in `tests/contract/button.contract.test.ts`

**Checkpoint**: The application has one usable shared button seam; individual UI surfaces can be migrated without changing controller binding logic.

---

## Phase 3: User Story 1 - Use Consistent Buttons Throughout the Game (Priority: P1) MVP

**Goal**: Route every existing rendered control through the shared renderer while retaining its action identity and availability behavior.

**Independent Test**: Render all menu, gameplay, victory, storybook, settings, and sprite-mapping surfaces; verify current labels or icons, IDs, test hooks, action data, and disabled conditions remain present.

### Tests for User Story 1

- [X] T004 [P] [US1] Extend menu and gameplay-control contracts to assert migrated controls retain their current test hooks and action metadata in `tests/contract/gameplay-ui.menu.contract.test.ts` and `tests/contract/gameplay-control-layout.contract.test.ts`
- [X] T005 [P] [US1] Extend battle, mobile, and sprite-mapping contracts to preserve disabled controls and icon-control accessibility in `tests/contract/gameplay-ui.battle.contract.test.ts`, `tests/contract/gameplay-ui.mobile-layout.contract.test.ts`, and `tests/contract/sprite-mapping.contract.test.ts`

### Implementation for User Story 1

- [X] T006 [P] [US1] Migrate scenario, storybook, settings, and sprite-mapping entry controls to the shared renderer in `src/ui/overlays/mainMenu.ts`, `src/ui/overlays/settingsPanel.ts`, and `src/ui/overlays/spriteMappingPanel.ts`
- [X] T007 [P] [US1] Migrate map HUD settings, map action-bar icon controls, and end-turn control to the shared renderer without changing their existing bindings in `src/ui/hud/mapHud.ts`, `src/ui/panels/mapActionBar.ts`, and `src/ui/panels/endTurnPanel.ts`
- [X] T008 [P] [US1] Migrate battle actions and return-to-menu controls to the shared renderer while preserving each current disabled rule in `src/ui/overlays/battleHud.ts`, `src/ui/overlays/storybookPanel.ts`, and `src/ui/overlays/victoryMenu.ts`
- [X] T009 [US1] Search all UI renderers for independently authored base button markup and migrate any remaining instances through `src/ui/components/button.ts`
- [X] T010 [US1] Run and resolve the retained-control regression suites in `tests/contract/gameplay-ui.menu.contract.test.ts`, `tests/contract/gameplay-control-layout.contract.test.ts`, `tests/contract/gameplay-ui.battle.contract.test.ts`, and `tests/contract/sprite-mapping.contract.test.ts`

**Checkpoint**: All current controls use the shared renderer and existing player/developer workflows remain operable. This is the MVP.

---

## Phase 4: User Story 2 - Receive Tactile Interaction Feedback (Priority: P2)

**Goal**: Make enabled, pressed, focused, disabled, busy, and selected controls visibly and semantically distinct across desktop and mobile layouts.

**Independent Test**: Exercise representative controls in a browser and verify hover where supported, pressed, keyboard focus, disabled, busy, and selected feedback without changing control behavior.

### Tests for User Story 2

- [X] T011 [P] [US2] Extend shared-button contract assertions for pressed, busy, selected, and variant state semantics in `tests/contract/button.contract.test.ts`
- [X] T012 [P] [US2] Add browser interaction-state coverage for hover, pressed, keyboard focus, disabled, and mobile press feedback in `tests/acceptance/button-interaction-states.spec.ts`

### Implementation for User Story 2

- [X] T013 [US2] Add shared rest, hover, active/pressed, visible-focus, and disabled presentation rules in `index.html`
- [X] T014 [US2] Add secondary, quiet, icon, selected, and busy presentation rules that remain distinct from focus and disabled states in `index.html`
- [X] T015 [US2] Verify responsive shared-button sizing and tactile feedback remain usable at the existing mobile breakpoint in `index.html`
- [X] T016 [US2] Run browser interaction-state checks and repair any state that does not meet the contract in `tests/acceptance/button-interaction-states.spec.ts`

**Checkpoint**: Players receive clear tactile and keyboard feedback without losing mobile usability or control availability rules.

---

## Phase 5: User Story 3 - Configure Current Button Scenarios Without Custom Markup (Priority: P3)

**Goal**: Complete and protect the shared configuration interface for every current button scenario.

**Independent Test**: Render representative primary, secondary, quiet, icon, compact, selected, pressed, disabled, and busy controls and verify their supplied metadata and semantics.

### Tests for User Story 3

- [X] T017 [P] [US3] Add exhaustive configuration-table coverage for button types, sizes, variants, selected, pressed, disabled, busy, tooltips, and action data in `tests/contract/button.contract.test.ts`
- [X] T018 [P] [US3] Add a contract check that no UI renderer emits base button markup outside the shared renderer in `tests/contract/button-migration.contract.test.ts`

### Implementation for User Story 3

- [X] T019 [US3] Complete the shared button property interface and its default, validation, state-precedence, and pass-through behavior in `src/ui/components/button.ts`
- [X] T020 [US3] Apply the shared selected and pressed semantics to selectable sprite-mapping entries in `src/ui/overlays/spriteMappingPanel.ts`
- [X] T021 [US3] Review every shared-renderer call site for supported-property use and remove any remaining custom base-button state markup in `src/ui/hud/mapHud.ts`, `src/ui/overlays/`, and `src/ui/panels/`
- [X] T022 [US3] Run the full shared-button configuration and migration contracts in `tests/contract/button.contract.test.ts` and `tests/contract/button-migration.contract.test.ts`

**Checkpoint**: Maintainers can express every current button scenario through the shared interface without duplicating base markup.

---

## Phase 6: Polish & Cross-Cutting Validation

**Purpose**: Prove the completed feature across the application and keep its artifacts aligned.

- [X] T023 [P] Run the production build and resolve type or bundling failures through `package.json`
- [X] T024 [P] Run the focused map, battle, menu, mobile, and sprite-mapping regression suites referenced by `specs/022-button-component/quickstart.md`
- [X] T025 Execute the manual desktop and mobile interaction checks in `specs/022-button-component/quickstart.md`
- [X] T026 Verify feature artifacts remain aligned with delivered behavior in `specs/022-button-component/spec.md`, `specs/022-button-component/plan.md`, and `specs/022-button-component/contracts/button-ui-contract.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Starts immediately.
- **Foundational (Phase 2)**: Depends on T001 and blocks every user-story migration.
- **User Story 1 (Phase 3)**: Depends on T002–T003; delivers the MVP.
- **User Story 2 (Phase 4)**: Depends on T002–T003 and can begin after the shared renderer exists; it does not require the complete P1 migration to validate representative controls.
- **User Story 3 (Phase 5)**: Depends on T002–T003 and can begin after the shared interface exists; its final migration-invariant review follows P1.
- **Polish (Phase 6)**: Depends on all desired stories being complete.

### User Story Dependencies

- **US1 (P1)**: Requires the shared-renderer foundation only; no dependency on US2 or US3.
- **US2 (P2)**: Requires the foundation; styling can be developed independently of migration work, then validated against migrated controls.
- **US3 (P3)**: Requires the foundation; property-completeness tests can be developed independently, while its no-custom-markup check follows US1's migration.

### Parallel Opportunities

- T004 and T005 can run in parallel because they cover different contract files.
- T006, T007, and T008 can run in parallel after T002 because they modify separate UI surfaces.
- T011 and T012 can run in parallel; T013 and T014 must remain sequential because they edit the shared stylesheet.
- T017 and T018 can run in parallel because they use separate test files.
- T023 and T024 can run in parallel after implementation is complete.

## Parallel Example: User Story 1

```text
Task: "Migrate scenario, storybook, settings, and sprite-mapping entry controls in src/ui/overlays/mainMenu.ts, src/ui/overlays/settingsPanel.ts, and src/ui/overlays/spriteMappingPanel.ts"
Task: "Migrate map HUD, map action-bar, and end-turn controls in src/ui/hud/mapHud.ts, src/ui/panels/mapActionBar.ts, and src/ui/panels/endTurnPanel.ts"
Task: "Migrate battle and return-to-menu controls in src/ui/overlays/battleHud.ts, src/ui/overlays/storybookPanel.ts, and src/ui/overlays/victoryMenu.ts"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001–T003 to establish the shared renderer and its basic contract.
2. Complete T004–T010 to migrate every current control while retaining behavior.
3. Run the retained-control regression suites before continuing.

### Incremental Delivery

1. Deliver shared renderer plus complete control migration (US1).
2. Add and prove tactile interaction feedback (US2).
3. Complete the configuration matrix and migration guardrail (US3).
4. Run the cross-cutting build, regression, browser, and artifact checks.

## Notes

- All 26 tasks use the required checkbox, ID, story-label (for story work), and file-path format.
- No additional dependency or external integration is introduced.
