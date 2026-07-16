# Implementation Plan: Submap Transitions

**Branch**: `010-submaps` | **Date**: 2026-07-16 | **Spec**: [spec.md](/workspaces/disc2/specs/010-submaps/spec.md)

**Input**: Feature specification from `/specs/010-submaps/spec.md`

## Summary

Add linked submaps to the browser strategy prototype so a scenario can move the player between the main map and secondary map spaces through triggers such as caves, teleports, and defined exits. The implementation should preserve the current scenario session, movement flow, battle rules, and victory rules while extending scenario data, map-state tracking, transition handling, rendering context, and validation coverage for connected map travel.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, Vitest for contract and integration tests, Playwright for acceptance coverage

**Storage**: In-memory runtime state plus static scenario definitions in repository source files

**Testing**: Vitest contract and integration suites for linked-map scenario state, transition routing, and repeated-travel continuity; Playwright acceptance coverage for entering and leaving submaps during real gameplay flows

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-project web application

**Performance Goals**: Keep map transitions visually responsive, preserve the current pace of route and battle flow, and keep repeated linked-map travel fast enough that transitions do not feel like scenario reloads

**Constraints**: Browser-only runtime, no new UI framework dependencies, preserve existing gameplay rules, keep linked-map travel inside one scenario session, and fail safely when scenario links are incomplete or invalid

**Scale/Scope**: One shared browser app, one scenario session model, one main map plus linked submaps per scenario, multiple entry and exit points, and repeated travel between connected maps within the same run

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The work is driven by [spec.md](/workspaces/disc2/specs/010-submaps/spec.md) and will continue through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 covers entering a linked submap, US2 covers returning through exit points, and US3 covers continuity across repeated travel and mixed trigger types.
- Feature-proving tests: Pass. US1 will be proven with integration and acceptance flows that enter a linked map from the main map. US2 will be proven with integration and acceptance flows that return through specific exit points. US3 will be proven with continuity-focused integration and acceptance coverage that repeats travel and verifies state persistence.
- Minimal dependencies, real integrations: Pass. The feature reuses the current TypeScript, Vite, Vitest, and Playwright stack and relies on current scenario data and state machinery rather than adding third-party event or scene libraries.
- Small, loosely coupled design: Pass. Linked-map definitions, active-map session state, transition routing, and rendering context can be added as focused seams around scenario types, map scene flow, and scenario loading without rewriting combat or turn resolution.
- Artifact consistency: Pass with planned updates. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` under `specs/010-submaps/`, and `.specify/feature.json` already points to this active feature directory.

### Post-Design Constitution Check

- Spec before code: Still passes. The design stays centered on linked-map travel inside the existing scenario flow and does not expand into general scripting or save-system redesign.
- Independent slices: Still passes. Entry transitions, exit transitions, and repeated-travel continuity remain separable enough for incremental delivery and proof.
- Feature-proving tests: Still passes. The design exposes public seams for scenario link definitions, active-map session state, transition routing, and scenario-level travel flows.
- Minimal dependencies, real integrations: Still passes. Existing repository tooling and runtime structures remain sufficient; no new external libraries are required.
- Small, loosely coupled design: Still passes. Active-map tracking, linked destination resolution, and transition feedback remain isolated from battle and turn logic except where scenario context must be read.
- Artifact consistency: Still passes. The plan, research, data model, contracts, quickstart, and active spec describe the same linked submap travel slice.

## Project Structure

### Documentation (this feature)

```text
specs/010-submaps/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── linked-map-data.md
│   └── map-travel-ux.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── bootstrap/
│   │   └── startGame.ts
│   ├── scene-controller/
│   │   ├── mapInputController.ts
│   │   ├── mapScene.ts
│   │   └── sceneController.ts
│   └── state/
│       └── gameState.ts
├── content/
│   └── scenarios/
│       └── [scenario definitions]
├── engine/
│   ├── map/
│   │   ├── heroActions.ts
│   │   ├── routeRules.ts
│   │   └── viewportMath.ts
│   └── scenario/
│       ├── loadScenario.ts
│       └── types.ts
├── render/
│   └── canvas/
│       ├── renderMapScene.ts
│       └── viewportRender.ts
└── ui/
    ├── hud/
    │   └── mapHud.ts
    └── overlays/
        └── errorOverlay.ts

tests/
├── acceptance/
├── contract/
└── integration/
```

**Structure Decision**: Keep the existing single frontend app and extend the current scenario data, game state, map controllers, and map rendering path for linked-map travel rather than introducing a separate scene graph or sub-application for submaps. The primary seams should live in `types.ts`, `loadScenario.ts`, scenario content files, `gameState.ts`, `heroActions.ts`, `mapInputController.ts`, and `renderMapScene.ts` so one scenario session can change active maps without changing the rest of the rules engine.

## Complexity Tracking

No constitution violations currently require justification.
