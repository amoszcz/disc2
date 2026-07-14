# Implementation Plan: Pathfinding Route Preview

**Branch**: `005-bridge-movement-objects` | **Date**: 2026-07-14 | **Spec**: [spec.md](/C:/programy/disc2/specs/006-pathfinding-route/spec.md)

**Input**: Feature specification from `/specs/006-pathfinding-route/spec.md`

**Note**: The active branch currently remains `005-bridge-movement-objects` while planning is being produced for feature `006-pathfinding-route`. The design below targets the new spec directory and should ideally be implemented from a matching feature branch before coding starts.

## Summary

Extend the existing TypeScript/Vite browser strategy prototype with weighted map pathfinding, preview-first route interaction, and persistent multi-turn route intent. A first click on a destination should calculate and display the shortest legal route by total movement cost, a second click on that same destination should commit movement along the stored route, and partial traversal should stop on the last affordable step while keeping the destination visible for later continuation. The feature will be proven with Vitest integration and contract coverage for route computation, preview ownership, and continuation behavior, plus Playwright acceptance tests for click-to-preview, click-to-confirm, and multi-turn route persistence.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite app tooling, Vitest for integration and contract tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario content files stored in the repository

**Testing**: Vitest contract and integration suites for weighted route calculation, preview confirmation state, and partial route continuation, plus Playwright acceptance tests for route plotting, confirmation, and cross-turn persistence

**Target Platform**: Modern desktop browsers with mouse and keyboard input

**Project Type**: Single-project web application

**Performance Goals**: Keep route plotting and canvas rendering responsive on the existing 64x64 scenario scale while recalculating weighted routes on click-driven interaction

**Constraints**: Browser-only runtime, Canvas 2D rendering, no backend service, no new third-party pathfinding library, reuse the existing terrain, movement-object, and guard legality rules, preserve explicit second-click confirmation, and keep route intent stable across end-turn transitions until replaced, invalidated, or completed

**Scale/Scope**: One selected-hero pathfinding flow shared by the current adventure map, including reachable preview, confirmation, partial movement, route persistence, and destination replacement behavior

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving spec is [spec.md](/C:/programy/disc2/specs/006-pathfinding-route/spec.md), and implementation should proceed through this plan and a dedicated `tasks.md` before behavior changes begin.
- Independent slices: Pass. US1 delivers route preview without committing movement and is independently valuable for planning. US2 adds confirmation and partial route traversal on top of the stored preview. US3 adds cross-turn persistence and route continuation. The intentional dependency is that US2 and US3 build on the preview state introduced in US1.
- Feature-proving tests: Pass. US1 will be proven with integration and browser acceptance flows that validate reachable and unreachable route preview behavior. US2 will be proven with route-confirmation integration tests plus acceptance coverage for partial traversal and no-recalculation confirmation behavior. US3 will be proven with contract and acceptance tests covering route ownership, end-turn persistence, and destination replacement.
- Minimal dependencies, real integrations: Pass. No new libraries are required beyond the existing Vite, Vitest, and Playwright toolchain. Weighted routefinding will be implemented as a focused engine seam instead of adding an external pathfinding package.
- Small, loosely coupled design: Pass. Path computation, preview state, route rendering, and click-confirmation orchestration can live in distinct seams so the map engine, scene controller, and canvas rendering stay locally understandable.
- Artifact consistency: Pass. This plan adds `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` for feature `006`, and updates `AGENTS.md` to point to this new active plan.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains anchored to click-driven route preview and continuation rather than broadening into automation or multiplayer path queues.
- Independent slices: Still passes. Preview, confirmation/partial traversal, and cross-turn continuation remain separable user stories with independent proofs.
- Feature-proving tests: Still passes. The design exposes public seams for weighted route generation, preview ownership, and click-driven continuation that can be exercised through integration and acceptance coverage.
- Minimal dependencies, real integrations: Still passes. The feature uses only the existing TypeScript/Vite/Vitest/Playwright stack and reuses the current movement-rule pipeline.
- Small, loosely coupled design: Still passes. The design isolates pathfinding from hero mutation and keeps rendering/interaction concerns behind narrow state and controller seams.
- Artifact consistency: Still passes. Plan, research, data model, contracts, quickstart, and AGENTS all describe the same preview-confirm-continue route workflow.

## Project Structure

### Documentation (this feature)

```text
specs/006-pathfinding-route/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- route-preview-state.md
|   `-- route-preview-ux.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- scene-controller/
|   |   `-- mapInputController.ts
|   `-- state/
|       `-- gameState.ts
|-- engine/
|   |-- map/
|   |   |-- heroActions.ts
|   |   |-- routeRules.ts
|   |   |-- routePathfinding.ts
|   |   |-- routePreviewState.ts
|   |   `-- terrainFeedback.ts
|   `-- scenario/
|       `-- types.ts
|-- render/
|   |-- canvas/
|   |   `-- renderMapScene.ts
|   `-- sprites/
|       `-- placeholders.ts
|-- ui/
|   |-- hud/
|   |   `-- mapHud.ts
|   `-- overlays/
|       `-- guardStatusOverlay.ts
`-- main.ts

tests/
|-- acceptance/
|-- contract/
`-- integration/
```

**Structure Decision**: Keep the existing single frontend web application and extend the current adventure-map engine with a dedicated weighted-pathfinding seam in `src/engine/map/`. Add a preview-state seam for route ownership and continuation, wire click behavior through `mapInputController.ts`, and limit UI changes to route rendering plus HUD/overlay explanation.

## Complexity Tracking

No constitution violations currently require justification.
