# Implementation Plan: Bridges and Movement Objects

**Branch**: `005-bridge-movement-objects` | **Date**: 2026-07-12 | **Spec**: [spec.md](/C:/programy/disc2/specs/005-bridge-movement-objects/spec.md)

**Input**: Feature specification from `/specs/005-bridge-movement-objects/spec.md`

**Note**: This plan extends the existing browser strategy prototype with painted movement-object regions, bridge-enabled river crossings, stacked movement modifiers, and player-facing feedback that explains why those objects changed passability or movement cost.

## Summary

Extend the current TypeScript/Vite browser game by adding a dedicated movement-object layer on top of the terrain system. Scenario content will author bridge, milestone, and rubble objects as painted regions, movement resolution will combine their effects with existing terrain rules, bridge placement on non-river tiles will fail scenario validation, and stacked object effects will resolve deterministically with a minimum final movement cost of 1. The feature will be proven with Vitest integration and contract coverage for object-region resolution plus Playwright acceptance flows for bridged crossings, stacked movement modifiers, and visible movement-object feedback.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite app tooling, Vitest for integration and contract tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario content files stored in the repository

**Testing**: Vitest integration and contract suites for scenario validation, region-derived movement-object resolution, and stacked movement effects, plus Playwright acceptance tests for bridged crossings and movement-object readability

**Target Platform**: Modern desktop browsers with mouse and keyboard input

**Project Type**: Single-project web application

**Performance Goals**: Maintain responsive route evaluation and canvas rendering while combining terrain lookup with movement-object region resolution across the existing 64x64 scenario scale

**Constraints**: Browser-only runtime, Canvas 2D rendering, no backend service, no new third-party rules engine, painted region authoring for movement objects, stacked object effects with deterministic ordering, minimum final movement cost of 1, and strict scenario validation for bridges placed outside river terrain

**Scale/Scope**: One movement-object system shared by the existing terrain scenario model, with support for bridge, milestone, and rubble object regions, stacked effects on overlapping tiles, and player-visible explanation of resulting movement changes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving spec is [spec.md](/C:/programy/disc2/specs/005-bridge-movement-objects/spec.md), and implementation will proceed through this plan and a dedicated `tasks.md` before code changes start.
- Independent slices: Pass. US1 delivers bridge-enabled river crossings as the MVP slice. US2 adds additional movement-modifier objects and stacked effects. US3 adds player-visible object readability and route explanation. The only intentional dependency is that US2 and US3 build on the shared movement-object resolution introduced for US1.
- Feature-proving tests: Pass. US1 will be proven with scenario-validation and movement-resolution integration tests plus browser acceptance coverage for bridged versus unbridged rivers. US2 will be proven with integration tests for milestone/rubble stacking and contract coverage for deterministic object resolution. US3 will be proven with contract and browser acceptance tests that verify movement-object presentation and route-feedback messaging.
- Minimal dependencies, real integrations: Pass. No new libraries are required beyond the existing Vite, Vitest, and Playwright toolchain. Movement-object behavior will reuse and extend the current terrain engine rather than adding a new external rule system.
- Small, loosely coupled design: Pass. Movement-object region parsing, placement validation, effect stacking, and feedback generation will live in focused seams so terrain lookup, movement mutation, and rendering stay independently testable.
- Artifact consistency: Pass. This plan adds `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` for feature `005`, and updates `AGENTS.md` to point to this new active plan.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains anchored to the clarified movement-object spec and does not broaden into dynamic construction or combat effects.
- Independent slices: Still passes. Bridge crossings, additional movement modifiers, and readability/feedback remain separable slices with their own proofs.
- Feature-proving tests: Still passes. The design exposes deterministic region-resolution and validation seams for integration tests plus visible browser behavior for acceptance coverage.
- Minimal dependencies, real integrations: Still passes. The feature uses only the existing TypeScript/Vite/Vitest/Playwright stack and extends the current terrain data path.
- Small, loosely coupled design: Still passes. Movement-object resolution is isolated from hero action mutation and from viewport/render orchestration.
- Artifact consistency: Still passes. Plan, research, data model, contracts, quickstart, and AGENTS reference the same first-slice movement-object rules and examples.

## Project Structure

### Documentation (this feature)

```text
specs/005-bridge-movement-objects/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- movement-object-format.md
|   `-- movement-object-ux.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- bootstrap/
|   |-- scene-controller/
|   `-- state/
|-- content/
|   `-- scenarios/
|-- engine/
|   |-- map/
|   |   |-- heroActions.ts
|   |   |-- routeRules.ts
|   |   |-- terrainLookup.ts
|   |   |-- terrainFeedback.ts
|   |   |-- movementObjectRegions.ts
|   |   |-- movementObjectLookup.ts
|   |   `-- movementObjectRules.ts
|   `-- scenario/
|-- render/
|   |-- canvas/
|   `-- sprites/
|-- ui/
|   |-- hud/
|   `-- overlays/
`-- main.ts

tests/
|-- acceptance/
|-- contract/
`-- integration/
```

**Structure Decision**: Keep the existing single frontend web application and extend the current terrain-aware map engine. Add a movement-object seam inside `src/engine/map/` for painted object-region normalization, tile-level object resolution, validation, and stacked-effect application, while limiting UI changes to movement-object rendering and feedback.

## Complexity Tracking

No constitution violations currently require justification.
