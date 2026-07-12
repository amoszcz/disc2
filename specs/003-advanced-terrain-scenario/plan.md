# Implementation Plan: Advanced Terrain Scenario

**Branch**: `003-advanced-terrain-scenario` | **Date**: 2026-07-12 | **Spec**: [spec.md](/C:/programy/disc2/specs/003-advanced-terrain-scenario/spec.md)

**Input**: Feature specification from `/specs/003-advanced-terrain-scenario/spec.md`

**Note**: This plan extends the existing browser strategy prototype with a 64x64 terrain-driven scenario, 8-direction movement, region-derived terrain lookup, variable movement costs, and blocked-water rules.

## Summary

Extend the current TypeScript/Vite browser game by replacing the small fixed map with a 64x64 terrain-aware scenario model that derives tile behavior from painted terrain regions, updates hero movement validation to use directional and terrain-cost rules, preserves blocked rivers and lakes without implicit crossings, and proves the behavior through engine integration tests plus browser acceptance coverage for route planning and illegal-move feedback.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite app tooling, Vitest for integration and contract tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario content files stored in the repository

**Testing**: Vitest contract and integration suites for terrain lookup and movement logic, plus Playwright acceptance tests for map readability and blocked-move behavior

**Target Platform**: Modern desktop browsers with keyboard and mouse input

**Project Type**: Single-project web application

**Performance Goals**: Maintain responsive map interaction and visually smooth rendering for a 64x64 scenario while keeping terrain lookup and movement validation effectively instantaneous to the player

**Constraints**: Browser-only runtime, Canvas 2D rendering, no backend service, no online multiplayer, no bridge or water-crossing exceptions, region-based terrain definitions, deterministic 8-direction movement and terrain-cost resolution

**Scale/Scope**: One larger 64x64 handcrafted scenario, terrain region definitions spanning the map, a terrain legend or equivalent route feedback, and movement behavior updates limited to roads, plains or grass, mud, woods, mountains, lakes, and rivers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving spec is [spec.md](/C:/programy/disc2/specs/003-advanced-terrain-scenario/spec.md), and implementation will proceed through this plan and a dedicated `tasks.md` before code changes start.
- Independent slices: Pass. US1 delivers the main value as terrain-aware movement over a 64x64 map. US2 adds blocked-water and impassable-boundary enforcement. US3 adds player-facing terrain readability and route feedback. The main dependency is that US3 builds on the terrain model established for US1.
- Feature-proving tests: Pass. US1 will be proven with Vitest integration coverage for terrain-region resolution and movement-cost spending plus one browser acceptance flow over a 64x64 map. US2 will be proven with integration tests for blocked mountains, rivers, lakes, and water-adjacent roads plus acceptance coverage for rejected moves. US3 will be proven with contract coverage for terrain presentation and acceptance tests that verify players can distinguish terrain classes and understand rejected movement.
- Minimal dependencies, real integrations: Pass. No new libraries are required beyond the existing toolchain. Terrain support will be implemented in internal engine and rendering modules, with real browser behavior exercised through Playwright.
- Small, loosely coupled design: Pass. Terrain-region parsing, tile resolution, movement-cost rules, route validation, and terrain presentation will be split into focused modules so movement logic remains independent from canvas rendering.
- Artifact consistency: Pass. This plan adds `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` for feature `003`, and updates `AGENTS.md` to point to the new active plan.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains anchored to the active spec and its clarifications.
- Independent slices: Still passes. Terrain model, blocked-tile rules, and terrain readability remain separable layers instead of one monolithic rewrite.
- Feature-proving tests: Still passes. The design exposes deterministic terrain lookup and movement seams suitable for integration testing, plus browser-visible terrain feedback for acceptance coverage.
- Minimal dependencies, real integrations: Still passes. The extension uses only the existing TypeScript/Vite/Vitest/Playwright stack.
- Small, loosely coupled design: Still passes. Terrain-region resolution is isolated from movement execution and from scene rendering, reducing coupling risk.
- Artifact consistency: Still passes. Plan, research, data model, contracts, quickstart, and AGENTS all reference the same terrain feature and assumptions.

## Project Structure

### Documentation (this feature)

```text
specs/003-advanced-terrain-scenario/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- scenario-terrain-format.md
|   `-- terrain-ux.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- bootstrap/
|   |-- state/
|   `-- scene-controller/
|-- content/
|   `-- scenarios/
|-- engine/
|   |-- battle/
|   |-- map/
|   |   |-- terrainRegions.ts
|   |   |-- terrainLookup.ts
|   |   |-- routeRules.ts
|   |   `-- heroActions.ts
|   |-- scenario/
|   |-- turn/
|   `-- victory/
|-- render/
|   |-- canvas/
|   |   |-- renderMapScene.ts
|   |   `-- renderTerrainLegend.ts
|   `-- sprites/
|-- ui/
|   |-- hud/
|   |-- panels/
|   `-- overlays/
`-- main.ts

tests/
|-- acceptance/
|-- contract/
`-- integration/
```

**Structure Decision**: Keep the existing single frontend web application and extend the current map engine. Add a terrain-focused seam inside `src/engine/map/` for region definitions, per-tile terrain resolution, and route validation, while limiting scene and canvas changes to terrain display and move-feedback integration.

## Complexity Tracking

No constitution violations currently require justification.
