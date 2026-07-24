# Implementation Plan: Migrate Campaign Map

**Branch**: `024-migrate-campaign-map` | **Date**: 2026-07-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/024-migrate-campaign-map/spec.md`

## Summary

Migrate the present scenario-defined, grid-rendered world maps into a deterministic semantic campaign-map layer that preserves the current hero movement, route-preview, fog, scenario, and UI flows. Introduce the new system in stages: adapt existing world maps first; make a cached illustrated renderer consume semantic data; then add deterministic fields, biomes, constrained locations, roads, rivers, validation, and diagnostics. Gameplay decisions remain in map and route services, never in rendering or decorative pixels.

## Technical Context

**Language/Version**: TypeScript 5.9, strict browser application

**Primary Dependencies**: Vite 7, Vitest 3, Playwright 1; browser Canvas 2D APIs

**Storage**: Scenario definitions and active game session are in memory; browser local storage currently persists player settings only. There is no general campaign save/load format.

**Testing**: Vitest contract and integration tests, plus Playwright acceptance flows; render tests use a mock Canvas context and existing visual-template diagnostics.

**Target Platform**: Modern desktop and touch-capable mobile browsers

**Project Type**: Single-project browser game

**Performance Goals**: Keep normal pan, zoom, selection, and movement visually responsive; static map content is generated outside the interaction/render path and cached so dynamic frames only draw viewport-visible state and overlays.

**Constraints**: Preserve existing scenarios, world-map/submap transitions, hero traversal, fog of war, route feedback, Canvas camera transforms, and UI ownership; no new dependency unless a plan-stage need proves browser and project utilities insufficient.

**Scale/Scope**: Three current scenarios, including a 64×64 terrain scenario and linked submaps; migrate main campaign maps first while retaining a compatibility adapter for compact and submap content.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. [spec.md](./spec.md) is the governing artifact; this work proceeds through the plan and a dependency-ordered `tasks.md` before implementation.
- Independent slices: Pass. US1 establishes a semantic adapter plus readable renderer while retaining route play; US2 supplies deterministic strategic generation and validation; US3 adds zoom-aware polish and diagnostics. The renderer adapter is shared enabling work, but each story retains demonstrable outcomes.
- Feature-proving tests: Pass. Contract and integration coverage will prove deterministic semantic output, validator failures, legal route compatibility, fog-safe presentation, cache invalidation, and geometry. Playwright flows will prove map readability, route preview/cancel/commit, and desktop/mobile pan-zoom interaction.
- Minimal dependencies, real integrations: Pass. The design uses the existing Canvas 2D, typed arrays, `requestAnimationFrame`, and test stack. Noise, graph, routing, and cache helpers remain small repository modules; no library is currently justified.
- Small, loosely coupled design: Pass. `campaignMap` generation/model/validation, `mapAdapter`, route-cost lookup, render cache/layers, label layout, and developer diagnostics are separate seams. Existing `heroActions`, `routePathfinding`, and viewport math remain gameplay and coordinate authorities.
- Strategy UX clarity: Pass. Existing route preview, confirmation, cancellation, and unavailable-route feedback remain the primary interaction. The new renderer must place them above terrain and fog without relying on hover; HUD wording continues to expose consequence and recovery for touch and desktop.
- Artifact consistency: Pass. This plan adds `research.md`, `data-model.md`, `quickstart.md`, and contracts under this feature. Future implementation updates scenario typing, map services, renderer seams, developer diagnostics, and relevant tests; no generic Spec Kit templates require changes.

### Post-Design Constitution Check

- Spec before code: Still passes. The design documents a staged migration with testable artifacts before implementation.
- Independent slices: Still passes. The compatibility adapter lets US1 ship with existing authored maps before US2 changes generation and before US3 adds optional debug and visual polish.
- Feature-proving tests: Still passes. Contracts in [`contracts/`](./contracts/) identify the public state and rendered-behavior seams that acceptance and integration coverage must exercise.
- Minimal dependencies, real integrations: Still passes. Browser-native Canvas caching and deterministic repository utilities cover the required work.
- Small, loosely coupled design: Still passes. Semantic map data is independent of renderer caches; routing reads traversal attributes through an adapter; visual decorations cannot alter movement semantics.
- Strategy UX clarity: Still passes. Selection, path, cost, rejection, confirmation, cancellation, fog behavior, and touch input are preserved as explicit renderer/HUD contracts.
- Artifact consistency: Still passes. [research.md](./research.md), [data-model.md](./data-model.md), [quickstart.md](./quickstart.md), and the UI/data contracts describe the same incremental migration.

## Current Architecture

- **Generation entry point**: none exists. `src/content/scenarios/*.ts` author `ScenarioDefinition` maps, rectangular terrain regions, movement-object regions, heroes, locations, and links.
- **Map data and loading**: `src/engine/scenario/types.ts` defines `MapDefinition`, regions, map links, and game state. `src/engine/scenario/loadScenario.ts` clones, materializes, applies, and validates scenario maps.
- **Traversal and collision**: `src/engine/map/routePathfinding.ts`, `routeRules.ts`, `movementObjectRules.ts`, and `terrainLookup.ts` implement 8-way shortest paths, terrain costs, bridges, blocked tiles, and route feedback. `heroActions.ts` owns preview, cancel, confirmation, movement, and fog refresh.
- **Rendering and camera**: `src/render/canvas/renderMapScene.ts` iterates visible tiles and draws terrain, objects, routes, units, and fog. `viewportMath.ts` and `viewportRender.ts` own world/screen transforms and culling bounds; `mapInputController.ts` owns pointer/touch interaction.
- **Persistence and debug**: only game settings use local storage. Visual-template diagnostics are exposed for tests; there is no campaign save format, map debug panel, or map regeneration control.

## Project Structure

### Documentation (this feature)

```text
specs/024-migrate-campaign-map/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── campaign-map-data.md
│   └── campaign-map-ui.md
└── tasks.md                 # created by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── scene-controller/
│   │   ├── mapInputController.ts
│   │   └── mapScene.ts
│   └── state/gameState.ts
├── content/scenarios/
├── developer/campaign-map/              # new diagnostics state/panel seam
├── engine/
│   ├── campaign-map/                    # new model, adapter, generation, validation, geometry
│   ├── map/                             # existing movement, fog, viewport, route seams
│   └── scenario/
│       ├── loadScenario.ts
│       └── types.ts
├── render/canvas/
│   ├── campaign-map/                    # new layers, stamps, labels, caches
│   └── renderMapScene.ts                # orchestration only
└── ui/
    ├── hud/mapHud.ts
    └── overlays/ and panels/

tests/
├── contract/
├── integration/
│   ├── campaign-map/                    # new semantic, validation, cache, renderer seams
│   └── map/                             # existing traversal compatibility flows
└── acceptance/
```

**Structure Decision**: Keep the single browser app. Add feature-local `engine/campaign-map` and `render/canvas/campaign-map` modules rather than expanding the existing renderer or scenario type file into an all-purpose map engine. Current scenario loading, route behavior, viewport transforms, and UI controllers remain entry points and consume the adapter during migration.

## Migration Stages

1. Define semantic campaign-map types, deterministic seed streams, validation result, and an adapter that turns current rectangular authored maps into semantic cells, locations, connections, and regions without changing traversal.
2. Replace the map presentation with a layered cached renderer over the adapter output, retaining hero, route, fog, interaction, and current asset-template layers. Remove visible tile borders from campaign-map presentation while retaining logical cells for movement.
3. Introduce seeded terrain fields, cleaned biome regions, mountain ranges, rivers, constrained landmarks, and route graph generation for migrated main maps. Preserve legacy scenario maps and submaps through the adapter until explicitly migrated.
4. Make the route and movement seams resolve costs and legal crossings from semantic data, while retaining the existing preview/cancel/confirm API and world-to-screen math.
5. Add strategic validation, developer overlays, save-schema versioning only if persistent campaign saves are introduced, and regression/performance coverage.

## Complexity Tracking

No constitution violations require justification.
