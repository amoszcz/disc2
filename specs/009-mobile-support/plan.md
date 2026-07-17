# Implementation Plan: Mobile Browser Support

**Branch**: `009-mobile-support` | **Date**: 2026-07-16 | **Spec**: [spec.md](/workspaces/disc2/specs/009-mobile-support/spec.md)

**Input**: Feature specification from `/specs/009-mobile-support/spec.md`

## Summary

Make the existing browser strategy prototype playable in a mobile browser by adapting the game shell to narrow viewports, replacing mouse-only interactions with touch-capable controls, centering the initial scenario view on the starting hero, supporting two-finger map zoom on touch devices, normalizing map zoom bounds across scenarios to the Border Watch tile-size baseline, accounting for longer diagonal route distance than orthogonal movement, and keeping the active session usable across viewport changes such as orientation shifts and browser chrome expansion. The implementation should preserve the current menu, map, battle, and victory rules while extending bootstrap layout, canvas sizing, viewport state, input controllers, and route-distance calculation to support phone-browser play without introducing new dependencies.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, Vitest for contract and integration tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario definitions in repository source files

**Testing**: Vitest contract and integration suites for responsive layout state, starting-hero viewport centering, touch-capable map and battle input flow including two-finger zoom gestures, cross-scenario zoom-bound normalization, diagonal-versus-orthogonal route-cost validation, plus viewport-resize behavior; Playwright acceptance coverage using mobile-sized browser contexts

**Target Platform**: Modern mobile and desktop browsers, with primary support for touch-capable phone browsers

**Project Type**: Single-project web application

**Performance Goals**: Keep gameplay interactions visually responsive on mobile, maintain current scene transition speed, and keep viewport/layout updates fast enough to avoid visible lag during resize, drag, or two-finger zoom navigation

**Constraints**: Browser-only runtime, no new UI framework dependencies, preserve existing desktop behavior, retain current gameplay rules except for the newly specified diagonal-aware route-distance costing, keep the feature fully playable through touch-capable controls in a narrow viewport, ensure in-canvas two-finger zoom does not fall through to browser page zoom, and keep minimum/maximum tile sizes consistent across scenarios using Border Watch as the reference baseline

**Scale/Scope**: One shared browser app, two currently available scenarios, one responsive game shell, touch-capable menu/map/battle/victory flows, in-canvas two-finger map zoom, cross-scenario zoom-scale normalization, and viewport-change handling for phone-sized screens

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The work is driven by [spec.md](/workspaces/disc2/specs/009-mobile-support/spec.md) and will continue through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 delivers mobile entry, scenario launch, and starting-hero framing, US2 makes the scenario fully playable through touch-capable controls including normalized zoom bounds, and US3 adds resilience for viewport changes after the core mobile loop works.
- Feature-proving tests: Pass. US1 will be proven with UI contracts plus browser flows for menu readability, scenario launch, and initial hero-centered framing on mobile-sized viewports. US2 will be proven through integration coverage for touch input translation, including two-finger map zoom, Border Watch-aligned zoom-bound normalization across scenarios, and diagonal-versus-orthogonal route-distance behavior, plus acceptance flows that complete real gameplay actions without mouse input. US3 will be proven through viewport-resize integration coverage and browser flows that rotate or resize the mobile viewport mid-session.
- Minimal dependencies, real integrations: Pass. The feature reuses the current TypeScript, Vite, Vitest, and Playwright stack and should rely on browser-native pointer/touch and resize capabilities rather than adding third-party gesture or responsive-layout libraries.
- Small, loosely coupled design: Pass. Mobile layout sizing, scenario-start viewport framing, touch input handling, viewport normalization, zoom-scale baseline handling, diagonal-aware route costing, and mobile-specific HUD wording can be introduced as focused seams around the existing bootstrap, scene controller, rendering paths, and route preview logic without broad changes to scenario content.
- Artifact consistency: Pass with planned updates. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` under `specs/009-mobile-support/`, and `AGENTS.md` now points to this active plan for feature-scoped context.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains centered on mobile browser playability and does not expand into native packaging, offline support, or rule changes.
- Independent slices: Still passes. The design keeps menu/layout entry work including starting-hero framing, touch gameplay controls including normalized zoom bounds, and viewport-resilience behavior separable enough for independent delivery and validation.
- Feature-proving tests: Still passes. The design exposes public seams for game-shell layout mode, responsive viewport sizing, initial hero-centered map framing, touch-capable map and battle actions, in-canvas two-finger zoom handling, cross-scenario zoom-baseline assertions, diagonal route-cost assertions, and mobile acceptance flows.
- Minimal dependencies, real integrations: Still passes. Existing browser APIs and repository tooling remain sufficient; no new libraries are required.
- Small, loosely coupled design: Still passes. Screen layout state, scenario-start framing, canvas sizing, input translation, zoom-baseline state, route-cost calculation, and UI copy remain isolated enough to evolve independently from scenario and combat rules.
- Artifact consistency: Still passes. The plan, research, data model, contracts, quickstart, and AGENTS guidance now describe the same mobile-browser support slice.

## Project Structure

### Documentation (this feature)

```text
specs/009-mobile-support/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── mobile-layout-ux.md
│   └── touch-session-controls.md
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
│   │   ├── mapInputController.ts
│   │   ├── mapScene.ts
│   │   └── sceneController.ts
│   └── state/
│       └── gameState.ts
├── engine/
│   ├── map/
│   │   └── viewportMath.ts
│   └── scenario/
│       └── types.ts
├── render/
│   └── canvas/
│       ├── renderBattleScene.ts
│       ├── renderMapScene.ts
│       └── viewportRender.ts
└── ui/
    ├── hud/
    │   └── mapHud.ts
    ├── overlays/
    │   ├── battleHud.ts
    │   ├── mainMenu.ts
    │   └── victoryMenu.ts
    └── panels/
        └── endTurnPanel.ts

tests/
├── acceptance/
├── contract/
└── integration/
```

**Structure Decision**: Keep the existing single frontend app and extend the current bootstrap, input controllers, viewport math, HUD rendering, and route-distance calculation for mobile rather than introducing a router, separate mobile bundle, or third-party gesture layer. The primary seams should live in `startGame.ts`, `mapInputController.ts`, `battleInputController.ts`, `viewportMath.ts`, `types.ts`, route preview and movement logic, and lightweight UI render helpers so initial scenario framing centers on the starting hero, two-finger zoom stays in the same input pipeline as the rest of map navigation, scenario zoom bounds are normalized through shared viewport scaling rules instead of per-map maxima, and diagonal path steps can be priced longer than orthogonal steps without rewriting scene flow.

## Complexity Tracking

No constitution violations currently require justification.
