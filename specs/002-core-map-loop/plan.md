# Implementation Plan: Core Map Loop

**Branch**: `001-fantasy-strategy-game` | **Date**: 2026-07-12 | **Spec**: [spec.md](/C:/programy/disc2/specs/002-core-map-loop/spec.md)

**Input**: Feature specification from `/specs/002-core-map-loop/spec.md`

**Note**: This plan covers the first playable browser slice only: turn flow, hero movement, resource pickups, guarded locations, minimal tactical combat, and default elimination victory.

## Summary

Build a browser-based 2D strategy prototype as a single frontend TypeScript application that renders the map and battles with the Canvas 2D API, keeps scenario state in a centralized game-state store, loads handcrafted scenario data from local content files, and proves behavior through acceptance and integration tests centered on turn flow, guarded encounters, and victory resolution.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Vite for app tooling, Vitest for integration-style browser logic tests, Playwright for acceptance coverage

**Storage**: In-memory runtime state plus static scenario definition files stored in the repository

**Testing**: Vitest integration suite for engine flows and Playwright acceptance coverage for the playable browser slice

**Target Platform**: Modern desktop browsers with keyboard and mouse input

**Project Type**: Single-project web application

**Performance Goals**: Maintain responsive interaction and smooth 2D rendering at 60 fps for a small handcrafted scenario with one active hero force and a small number of simultaneous battle units

**Constraints**: Browser-only runtime, Canvas 2D rendering, no backend service, no online multiplayer, no city management in this slice, deterministic turn and battle resolution for testability

**Scale/Scope**: One playable scenario, one player-controlled hero force, a small set of resource pickups, a few guarded locations, and a minimal neutral or enemy roster sufficient to prove the core loop

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving spec is [spec.md](/C:/programy/disc2/specs/002-core-map-loop/spec.md), and implementation will continue through `plan.md` and later `tasks.md` before code work starts.
- Independent slices: Pass. Story 1 is independently playable as map movement plus turn passing. Story 2 adds guarded progression on top of the same map flow. Story 3 adds the minimal combat rules required by Story 2. The only unavoidable dependency is that guarded progression depends on battle resolution existing.
- Feature-proving tests: Pass. Story 1 will be proven with Playwright acceptance coverage for movement, pickup collection, and turn ending plus Vitest integration tests for movement allowance and turn transitions. Story 2 will be proven with acceptance coverage for entering a guarded site and integration tests for blocked or cleared location rules. Story 3 will be proven with integration tests for agility queue order, one-action-per-turn enforcement, and battle end resolution, plus one browser acceptance flow that wins a guard battle and returns to the map.
- Minimal dependencies, real integrations: Pass. New dependencies are limited to Vite, Vitest, and Playwright. Rendering uses the native Canvas 2D API rather than adding a game engine. Real browser interactions will be exercised in Playwright instead of mocking the full runtime.
- Small, loosely coupled design: Pass. The design separates scenario loading, game state, map rules, battle rules, and rendering or input adapters. Combat resolution is isolated behind engine modules so map systems do not depend on rendering details.
- Artifact consistency: Pass. This plan adds `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` for the active feature and updates `AGENTS.md` to point collaborators to this plan.

### Post-Design Constitution Check

- Spec before code: Still passes. The feature remains anchored to the active spec and generated design artifacts.
- Independent slices: Still passes. Data model and contract boundaries preserve Story 1 as the first playable loop, with Story 2 and Story 3 layered without forcing city or economy systems into scope.
- Feature-proving tests: Still passes. The design exposes deterministic engine seams for integration testing and a small browser shell for acceptance tests.
- Minimal dependencies, real integrations: Still passes. No extra framework or game engine was introduced during design.
- Small, loosely coupled design: Still passes. Engine systems remain split by responsibility, and scenario content is data-driven rather than embedded across rendering code.
- Artifact consistency: Still passes. Plan, research, model, contracts, quickstart, and AGENTS references are aligned to the same feature slice.

## Project Structure

### Documentation (this feature)

```text
specs/002-core-map-loop/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- gameplay-ui.md
|   `-- scenario-format.md
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
|   |-- scenario/
|   |-- turn/
|   `-- victory/
|-- render/
|   |-- canvas/
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

**Structure Decision**: Use a single frontend web application. Keep gameplay rules in `src/engine/` and browser-specific rendering or interaction code in `src/render/` and `src/ui/` so turn logic and battle logic remain independently testable without depending on the DOM.

## Complexity Tracking

No constitution violations currently require justification.
