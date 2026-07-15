# Implementation Plan: Start Menu Scenario Selection

**Branch**: `008-start-menu` | **Date**: 2026-07-15 | **Spec**: [spec.md](/workspaces/disc2/specs/008-start-menu/spec.md)

**Input**: Feature specification from `/specs/008-start-menu/spec.md`

## Summary

Add a main menu as the first screen of the game, list the currently available scenarios as explicit start choices, and let completed runs return to that menu without reloading the page. The implementation will extend the current single-app state model with a menu scene, scenario catalog metadata, fresh-session start/reset helpers, and end-of-scenario UI that routes back to the menu while preserving the existing map, battle, and victory flow once a scenario is active.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, Vitest for contract and integration tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario definitions in repository source files

**Testing**: Vitest contract and integration suites for menu state, scenario launch/reset, and completion return flow; Playwright acceptance coverage for launch-to-menu, scenario selection, and return-to-menu behavior

**Target Platform**: Modern desktop browsers with mouse input

**Project Type**: Single-project web application

**Performance Goals**: Keep initial load and menu-to-scenario transitions responsive with no visible delay beyond current scenario bootstrap work

**Constraints**: Browser-only runtime, no new menu framework dependencies, preserve existing in-scenario interaction once a scenario starts, and keep scenario sessions resettable entirely in memory

**Scale/Scope**: One main menu screen, two currently available scenarios, one return-to-menu path from scenario completion, and no mid-session save or quit flow

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The work is driven by [spec.md](/workspaces/disc2/specs/008-start-menu/spec.md) and will continue through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 delivers immediate user value by replacing auto-start with explicit scenario choice. US2 builds on that by closing the loop after scenario completion, but the first story remains independently shippable and testable.
- Feature-proving tests: Pass. US1 will be proven through UI contracts, integration coverage for state transitions, and acceptance flows that verify menu-first launch and scenario selection. US2 will be proven through end-state integration coverage and browser flows that finish a scenario and return to the menu.
- Minimal dependencies, real integrations: Pass. The feature uses the existing TypeScript/Vite/Vitest/Playwright stack and current scenario modules without new libraries or external services.
- Small, loosely coupled design: Pass. Menu state, scenario catalog data, session initialization/reset, and end-of-scenario UI can be separated into narrow seams without disturbing map or battle rules.
- Artifact consistency: Pass with planned updates. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` under `specs/008-start-menu/`, and `AGENTS.md` should point to this active plan for feature-scoped context.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains limited to menu-first entry and end-of-scenario return, without expanding into save/load systems or pause/quit flows.
- Independent slices: Still passes. Scenario selection can ship before return-to-menu, and the second story only depends on the menu scene and session bootstrap seam introduced in the first story.
- Feature-proving tests: Still passes. The design exposes public seams for current scene state, scenario option rendering, session reset, and completion navigation that can be covered through contract, integration, and acceptance tests.
- Minimal dependencies, real integrations: Still passes. Existing browser rendering and state update paths are reused directly; no abstraction or dependency is added beyond local helpers.
- Small, loosely coupled design: Still passes. Scenario catalog metadata, root scene rendering, and completion routing remain isolated enough to change independently.
- Artifact consistency: Still passes. The plan, research, data model, contracts, quickstart, and AGENTS guidance can all describe the same menu-first session flow without conflict.

## Project Structure

### Documentation (this feature)

```text
specs/008-start-menu/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── main-menu-ux.md
│   └── scenario-session-state.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── bootstrap/
│   │   └── startGame.ts
│   ├── scene-controller/
│   │   ├── battleInputController.ts
│   │   ├── battleScene.ts
│   │   ├── mapScene.ts
│   │   └── sceneController.ts
│   └── state/
│       └── gameState.ts
├── content/
│   └── scenarios/
│       ├── advanced-terrain-scenario.ts
│       └── core-map-loop.ts
├── engine/
│   ├── scenario/
│   │   ├── loadScenario.ts
│   │   └── types.ts
│   └── victory/
│       └── checkVictory.ts
└── ui/
    ├── hud/
    │   └── mapHud.ts
    ├── overlays/
    │   ├── battleHud.ts
    │   ├── errorOverlay.ts
    │   └── guardStatusOverlay.ts
    └── panels/
        └── endTurnPanel.ts

tests/
├── acceptance/
├── contract/
└── integration/
```

**Structure Decision**: Keep the existing single frontend app and add menu/session behavior to current bootstrap and state seams instead of creating a separate router or app shell. The main work should live in `startGame.ts`, `gameState.ts`, `loadScenario.ts`, and lightweight UI render helpers so map and battle logic remain unchanged once a scenario starts.

## Complexity Tracking

No constitution violations currently require justification.
