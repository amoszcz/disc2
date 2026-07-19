# Implementation Plan: Configurable Fog of War

**Branch**: `021-fog-of-war` | **Date**: 2026-07-19 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/021-fog-of-war/spec.md`

## Summary

Add a world-tile-aligned fog layer to the adventure map. Active-player heroes reveal a configurable six-tile default radius; never-visible tiles retain terrain but conceal map content under 15% unexplored fog, while previously visible tiles outside current vision use 50% visited fog. Settings can disable fog without changing map rules.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, Vitest, Playwright, Canvas 2D rendering

**Storage**: Existing persisted game-settings record for fog preferences; in-memory per-scenario exploration memory

**Testing**: Vitest contract and integration coverage; Playwright acceptance scenarios

**Target Platform**: Modern desktop and mobile browsers

**Project Type**: Single-project browser application

**Performance Goals**: Maintain responsive map pan, zoom, and route interaction while updating fog coverage for active heroes and viewport changes.

**Constraints**: No new dependencies; fog is visual/information-only and must not alter game rules, interaction targeting, or route behavior; unexplored terrain remains readable at 15% overlay opacity and visited fog remains fixed at 50% opacity.

**Scale/Scope**: Current multi-map scenarios, all active-player heroes, one default six-tile radius, configurable radius and enabled state, and exploration memory for the current scenario session.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The work is defined by [spec.md](spec.md) and will proceed through this plan and tasks.
- Independent slices: Pass. US1 provides unexplored terrain-only fog; US2 adds remembered visited fog; US3 adds player settings without changing the visual rules.
- Feature-proving tests: Pass. Contracts will define fog states and settings; integration tests will exercise visibility, memory, and map changes; acceptance tests will verify player-visible overlays and disabled fog.
- Minimal dependencies, real integrations: Pass. Existing Canvas rendering and game settings are sufficient; no new libraries are needed.
- Small, loosely coupled design: Pass. Visibility calculation, exploration memory, fog rendering, and settings form separate seams around existing map state and rendering.
- Artifact consistency: Pass. This plan, [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md), and [contracts/fog-of-war-ui.md](contracts/fog-of-war-ui.md) describe the same feature.

### Post-Design Constitution Check

- Spec before code: Still passes; the design stays within map visibility and presentation.
- Independent slices: Still passes; each story has behavior-level validation and clear boundaries.
- Feature-proving tests: Still passes; public rendering, settings, and map-transition behavior are covered.
- Minimal dependencies, real integrations: Still passes; browser-native rendering and existing settings persistence remain sufficient.
- Small, loosely coupled design: Still passes; map rules remain independent from fog state.
- Artifact consistency: Still passes; the Phase 0 and Phase 1 artifacts align with the specification.

## Project Structure

### Documentation (this feature)

```text
specs/021-fog-of-war/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── fog-of-war-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── state/gameSettings.ts
│   └── state/gameState.ts
├── engine/
│   ├── map/fogOfWar.ts
│   └── scenario/types.ts
├── render/canvas/
│   └── renderMapScene.ts
└── ui/
    └── overlays/settingsPanel.ts

tests/
├── contract/
├── integration/
└── acceptance/
```

**Structure Decision**: Keep visibility and explored-tile state in a focused map-domain module, attach session memory to game state, render fog in the existing map canvas pipeline, and extend the existing settings experience for the enabled state and radius. This keeps information hiding separate from map rules and input targeting.

## Implementation Approach

1. Define fog settings, tile-state, current-visibility, and per-map exploration-memory types.
2. Compute current visibility from active-player available heroes and merge it into session exploration memory on scenario start, hero movement, active-map changes, and map re-entry.
3. Render terrain first, conceal unexplored map content, then draw 15% unexplored or 50% visited fog above the map world while preserving interaction feedback.
4. Extend Settings with fog enablement and visibility-radius controls, preserving normal unrestricted rendering when disabled.
5. Add contract, integration, and acceptance proof for initial radius, object concealment, visited fog, map travel, viewport alignment, settings, and disabled fog.

## Complexity Tracking

No constitution violations require justification.
