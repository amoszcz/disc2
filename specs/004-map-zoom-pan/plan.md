# Implementation Plan: Map Zoom and Panning

**Branch**: `004-map-zoom-pan` | **Date**: 2026-07-12 | **Spec**: [spec.md](/C:/programy/disc2/specs/004-map-zoom-pan/spec.md)

**Input**: Feature specification from `/specs/004-map-zoom-pan/spec.md`

**Note**: This plan extends the existing browser strategy prototype with viewport state, cursor-focused zoom, middle-mouse drag panning, and interaction remapping that keeps map clicks accurate after navigation changes.

## Summary

Extend the current TypeScript/Vite browser game by introducing a dedicated adventure-map viewport model that stores zoom and pan state, applies bounded canvas transforms during rendering, remaps pointer input back into map coordinates, and preserves the adjusted view when the player leaves and returns to the map scene. The feature will be proven with Vitest integration coverage for viewport math and state persistence plus Playwright acceptance flows for panning, zooming, and post-navigation hero interaction.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite app tooling, Vitest for integration and contract tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario content files stored in the repository

**Testing**: Vitest integration and contract suites for viewport transforms, bounds, and restored view state, plus Playwright acceptance tests for real browser mouse-wheel, middle-mouse pan, and post-navigation map interaction

**Target Platform**: Modern desktop browsers with mouse and keyboard input

**Project Type**: Single-project web application

**Performance Goals**: Preserve responsive map interaction during repeated zoom and pan updates and keep visible canvas redraws effectively instantaneous to the player on the existing 896x640 canvas

**Constraints**: Browser-only runtime, Canvas 2D rendering, no backend service, no new third-party viewport library, zoom anchored to cursor position, panning on middle-mouse drag, view bounded to map edges, and view state preserved while switching away from and back to the adventure map

**Scale/Scope**: One viewport system shared by the existing core map loop and advanced terrain scenario, bounded zoom levels suitable for both small and large scenarios, pointer-remapping support for selection and movement, and map-scene-only navigation behavior

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving spec is [spec.md](/C:/programy/disc2/specs/004-map-zoom-pan/spec.md), and implementation will proceed through this plan and a dedicated `tasks.md` before code changes start.
- Independent slices: Pass. US1 delivers panning over oversized maps. US2 adds zoom-level changes and cursor-focused scaling. US3 preserves map interaction accuracy and restored view state after scene changes. The only intentional dependency is that US2 and US3 rely on the shared viewport model introduced for US1.
- Feature-proving tests: Pass. US1 will be proven with integration tests for viewport bounds plus browser panning coverage. US2 will be proven with integration tests for zoom clamping and cursor anchoring plus acceptance coverage for visible zoom behavior. US3 will be proven with integration tests for view-state persistence and coordinate remapping plus browser acceptance tests for selecting and moving after zoom/pan.
- Minimal dependencies, real integrations: Pass. No new libraries are required beyond the existing Vite, Vitest, and Playwright toolchain. Canvas transforms and mouse-input handling will use browser-native APIs and be exercised through real browser acceptance tests.
- Small, loosely coupled design: Pass. Viewport state, transform math, rendering offsets, and pointer translation will be isolated into focused seams so scene control and movement logic stay small and testable.
- Artifact consistency: Pass. This plan adds `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` for feature `004`, and updates `AGENTS.md` to point to this new active plan.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains anchored to the clarified zoom/pan spec and does not introduce unrelated camera features.
- Independent slices: Still passes. Panning, zoom behavior, and reliable post-navigation interaction remain separable deliverables with clear test seams.
- Feature-proving tests: Still passes. The design exposes deterministic viewport calculations for integration tests and user-visible browser navigation for acceptance coverage.
- Minimal dependencies, real integrations: Still passes. The feature uses only the existing TypeScript/Vite/Vitest/Playwright stack and browser-native canvas/input behavior.
- Small, loosely coupled design: Still passes. Viewport state and transform helpers are separated from hero movement mutation and from sidebar presentation.
- Artifact consistency: Still passes. Plan, research, data model, contracts, quickstart, and AGENTS reference the same zoom/pan feature boundaries and input decisions.

## Project Structure

### Documentation (this feature)

```text
specs/004-map-zoom-pan/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- map-navigation-input.md
|   `-- viewport-behavior.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- bootstrap/
|   |-- scene-controller/
|   `-- state/
|-- engine/
|   |-- map/
|   |   |-- heroActions.ts
|   |   `-- viewportMath.ts
|   `-- scenario/
|-- render/
|   |-- canvas/
|   |   |-- renderMapScene.ts
|   |   `-- viewportRender.ts
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

**Structure Decision**: Keep the existing single frontend web application and extend the current map scene. Add a viewport-focused seam for zoom bounds, cursor anchoring, and pointer remapping while limiting scene changes to map rendering, input handling, and persisted map-view state.

## Complexity Tracking

No constitution violations currently require justification.
