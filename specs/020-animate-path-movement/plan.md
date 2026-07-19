# Implementation Plan: Animate Path Movement

**Branch**: `020-animate-path-movement` | **Date**: 2026-07-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/020-animate-path-movement/spec.md`

## Summary

Replace synchronous route teleportation with a cancellable map-traversal flow that executes confirmed route steps at one tile per second for every non-immediate movement setting. Treat immediate as the sole bypass for synchronous completion. Add a persisted settings scene for movement and visual-template selection, moving template switching out of the map HUD while preserving the shared template catalog and existing storybook/mapper controls.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, Vitest, Playwright; browser-native timers and local storage

**Storage**: Browser-local storage for normalized game settings; in-memory game and traversal state

**Testing**: Vitest contract and integration tests plus Playwright acceptance flows

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-project browser application

**Performance Goals**: Complete visible traversal ticks at a stable one-second cadence; keep map input and settings changes responsive between ticks

**Constraints**: No new dependencies; preserve route legality, costs, continuation, encounters, map travel, and visual-template fallbacks; settings survive reloads and later sessions

**Scale/Scope**: One active hero traversal at a time, an immediate bypass plus one or more non-immediate movement settings, one dedicated settings scene, and the existing shared visual-template catalog

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. Work is driven by [spec.md](spec.md) and proceeds through this plan and follow-up tasks.
- Independent slices: Pass. P1 delivers observable timed traversal; P2 makes immediate the sole selectable bypass and preserves animation for every other setting; P2 centralizes visual-template selection without changing storybook or mapper workflows.
- Feature-proving tests: Pass. Contract coverage will define settings and traversal behavior; integration coverage will exercise timing, cancellation, partial routes, and persistence; Playwright will prove player-facing settings and movement flows.
- Minimal dependencies, real integrations: Pass. Browser timers and local storage meet the requirement without third-party packages; tests exercise browser-backed persistence rather than mocks alone.
- Small, loosely coupled design: Pass. Route execution, persisted settings, settings UI, and scene navigation form separate seams around the existing route engine and presentation layers.
- Artifact consistency: Pass. This plan, [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md), and [contracts/game-settings-and-traversal.md](contracts/game-settings-and-traversal.md) describe the same feature.

### Post-Design Constitution Check

- Spec before code: Still passes; no implementation work has begun.
- Independent slices: Still passes; timed traversal can be proven before settings and template relocation are added.
- Feature-proving tests: Still passes; every changed user-facing behavior has contract, integration, or acceptance evidence defined.
- Minimal dependencies, real integrations: Still passes; native browser capabilities remain sufficient.
- Small, loosely coupled design: Still passes; the design avoids placing timers in the renderer or persistence logic in scenario state.
- Artifact consistency: Still passes; all Phase 0 and Phase 1 artifacts align with the specification.

## Project Structure

### Documentation (this feature)

```text
specs/020-animate-path-movement/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── game-settings-and-traversal.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── bootstrap/startGame.ts
│   ├── scene-controller/
│   │   ├── mapInputController.ts
│   │   ├── mapScene.ts
│   │   └── sceneController.ts
│   └── state/
│       ├── gameSettings.ts              # new persisted-preference seam
│       └── gameState.ts
├── engine/
│   ├── map/heroActions.ts
│   └── scenario/types.ts
├── ui/
│   ├── hud/mapHud.ts
│   ├── overlays/mainMenu.ts
│   ├── overlays/settingsPanel.ts        # new dedicated settings UI
│   └── visualTemplateSelector.ts
└── render/sprites/
    ├── visualTemplateRegistry.ts
    └── visualTemplateResolver.ts

tests/
├── contract/
│   ├── game-settings.contract.test.ts
│   └── route-traversal.contract.test.ts
├── integration/
│   ├── foundation/gameSettingsPersistenceFlow.test.ts
│   └── map/routeTraversalFlow.test.ts
└── acceptance/
    ├── animated-route-traversal.spec.ts
    └── game-settings.spec.ts
```

**Structure Decision**: Extend the existing single frontend app. Keep route legality and one-step movement in the map engine; add a focused app-layer traversal controller for timed scheduling; add a small persistence adapter for game settings; and render Settings through the existing scene-controller/bootstrap pattern. Reuse the existing template catalog and selector binding, relocating only the game-facing selector.

## Implementation Approach

1. Extract a route-execution result that can expose and apply one legal route step while retaining the current synchronous immediate path.
2. Add traversal state/controller ownership in the app layer. Start it for animated confirmations, schedule one tick per second, disable competing map movement, and clean it up on completion, cancellation, scene change, battle, travel, or forced stop.
3. Define a typed, versioned game-settings adapter. Load validated preferences at bootstrap; preserve them through `createInitialState`, scenario starts, and returns to menu; persist changes immediately.
4. Add the `settings` scene and settings panel with entry/return actions. Relocate the gameplay template selector into this page; retain storybook and sprite-mapping selectors.
5. Add focused contract, integration, and acceptance coverage, including an invariant that every non-immediate setting starts timed traversal, then run existing route and template tests to demonstrate compatibility.

## Complexity Tracking

No constitution violations require justification.
