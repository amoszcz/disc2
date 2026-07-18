# Implementation Plan: Relocate Map Controls

**Branch**: `014-relocate-map-controls` | **Date**: 2026-07-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/014-relocate-map-controls/spec.md`

## Summary

Relocate the existing map actions from the below-map sidebar into a narrow vertical icon bar adjacent to the map canvas, preserving their existing handlers and availability rules. Keep hover labels as a browser-native accessibility aid for pointer users while retaining touch activation. Move the battle turn queue out of the battle HUD into a horizontal strip below the canvas, where each entry uses the established dedicated-unit template or its fallback representation and exposes its unit name on hover. The design reuses the current Vite/TypeScript DOM shell, battle turn state, and visual-template catalog; no gameplay logic or external dependency changes are required.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, browser-native DOM/CSS, Canvas 2D renderer, Vitest, Playwright

**Storage**: In-memory gameplay state plus static visual-template assets and catalog metadata

**Testing**: Vitest contract and integration suites for control markup, existing action behavior, queue ordering, template/fallback selection, and responsive layout; Playwright acceptance coverage at phone and desktop viewports

**Target Platform**: Modern desktop and mobile browsers, including touch-capable phone browsers

**Project Type**: Single-project web application

**Performance Goals**: Control and queue updates remain visually immediate as scenes and battle turns change, with no perceptible canvas-layout shift during normal play

**Constraints**: Browser-only runtime; no new dependencies; preserve current map action behavior, battle turn-order rules, existing mobile touch support, and visual-template fallback behavior; required map actions must be reachable without document scrolling at supported phone viewports

**Scale/Scope**: One game shell; map HUD/end-turn/zoom controls; battle HUD and turn queue; current unit visual-template catalog; related contract, integration, and acceptance tests

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. [spec.md](spec.md) drives this non-trivial UI change, which continues through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 relocates working map actions for immediate mobile value; US2 adds discoverability to compact icons; US3 independently presents the existing battle order below the canvas. Shared shell layout work is limited to composition, not shared game-rule changes.
- Feature-proving tests: Pass. US1 will be proven through action-binding integration and phone/desktop browser flows; US2 through DOM contract and hover acceptance checks; US3 through queue-rendering contracts, battle-turn integration flows, and browser layout checks. Existing action and battle engine tests continue to prove rules are unchanged.
- Minimal dependencies, real integrations: Pass. Native button semantics, `title`/tooltip behavior, CSS layout, existing DOM rendering, and existing asset/template resolution meet the requirements; no library is introduced.
- Small, loosely coupled design: Pass. Extract map-action rendering/binding into a focused UI seam alongside the map canvas; introduce a focused battle-queue presentation helper that consumes existing battle state and template resolution; retain scene orchestration as the only composition point.
- Artifact consistency: Pass with planned additions. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and UI contracts under `specs/014-relocate-map-controls/`. No global templates or constitution changes are needed.

### Post-Design Constitution Check

- Spec before code: Still passes. Design work remains scoped to existing UI composition and rendering behavior.
- Independent slices: Still passes. Map actions, icon discoverability, and battle queue layout can be delivered and tested independently after their small shared composition seam is in place.
- Feature-proving tests: Still passes. Contracts specify the visible UI state, integration tests exercise real bound action handlers and battle state, and Playwright verifies the responsive player flow.
- Minimal dependencies, real integrations: Still passes. The design uses browser-native controls and existing template assets rather than introducing a component, icon, tooltip, or rendering package.
- Small, loosely coupled design: Still passes. Current action logic stays in `mapScene.ts`, current battle state stays in the battle engine, and new UI helpers only translate state into markup and presentation.
- Artifact consistency: Still passes. The plan, research, data model, UI contract, and quickstart all retain the same boundaries: relocated controls, hover labels, and a below-canvas battle queue.

## Project Structure

### Documentation (this feature)

```text
specs/014-relocate-map-controls/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── gameplay-control-layout.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── bootstrap/startGame.ts
│   └── scene-controller/
│       ├── battleScene.ts
│       └── mapScene.ts
├── engine/
│   ├── battle/
│   │   ├── battleTurnEngine.ts
│   │   └── battleTargeting.ts
│   └── scenario/types.ts
├── render/
│   ├── canvas/viewportRender.ts
│   └── sprites/
│       ├── visualTemplateCatalog.ts
│       └── visualTemplateResolver.ts
└── ui/
    ├── hud/mapHud.ts
    ├── overlays/battleHud.ts
    └── panels/endTurnPanel.ts

tests/
├── acceptance/
├── contract/
└── integration/
```

**Structure Decision**: Keep the single browser app. Let `startGame.ts` compose scene-specific DOM regions around the canvas, keep map action behavior and binding in the map-scene controller, and keep battle order as a read-only projection of `battle.turnQueue`. Reuse the existing unit visual-template resolver/catalog for queue imagery and its fallback path. Style layout in the existing application stylesheet in `index.html`; no game engine, scenario data, or Canvas rendering rewrite is necessary.

## Complexity Tracking

No constitution violations currently require justification.
