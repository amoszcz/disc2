# Implementation Plan: Dedicated Visual Templates

**Branch**: `011-unit-tile-templates` | **Date**: 2026-07-16 | **Spec**: [spec.md](/C:/programy/disc2/specs/011-unit-tile-templates/spec.md)

**Input**: Feature specification from `/specs/011-unit-tile-templates/spec.md`

## Summary

Replace the current placeholder-only battlefield, map-object, hero, and terrain rendering with a small asset-template system that can choose dedicated visuals per unit, map object, and tile type while preserving the existing placeholder path as a safe fallback. The feature should keep the current Canvas 2D rendering flow, add reusable asset mappings for the currently supported scenario content, and keep rendering and tests stable even when only part of the dedicated visual set is present.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, browser-native Canvas 2D rendering, existing scenario/type definitions

**Storage**: Repository file assets plus in-memory runtime mappings

**Testing**: Vitest contract and integration suites, Playwright acceptance coverage, and lightweight rendering-state verification through public render seams

**Target Platform**: Modern desktop and mobile browsers supported by the current game

**Project Type**: Single-project web application

**Performance Goals**: Preserve the current responsive rendering feel during map and battle play, keep visual template lookup effectively instantaneous for current scenario sizes, and avoid visible lag during pan, zoom, battle updates, or mobile layout changes

**Constraints**: Browser-only runtime, Canvas 2D rendering, no new rendering framework, preserve current gameplay rules, preserve placeholder fallback behavior, and keep the first dedicated assets only modestly more advanced than the current placeholders

**Scale/Scope**: Current supported unit roster, current supported movement-object and guarded-location visual types, current supported terrain types, one reusable mapping layer, and both existing scenarios across map and battle scenes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving artifact is [spec.md](/C:/programy/disc2/specs/011-unit-tile-templates/spec.md), and the work will continue through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 covers dedicated visuals for units and map objects as an independently valuable presentation upgrade. US2 layers terrain tile templates on top of that for map readability. US3 preserves placeholder fallback behavior so rollout can remain incremental. The only practical dependency is that US2 and US3 should reuse the same visual-template mapping seam introduced for US1.
- Feature-proving tests: Pass. US1 can be proven with rendering-state contract and acceptance checks for units and objects. US2 can be proven with terrain-focused map rendering checks in the larger scenario. US3 can be proven with fallback-path contract and integration coverage that intentionally mixes dedicated templates and placeholders.
- Minimal dependencies, real integrations: Pass. No new external libraries are required. The work should stay within the existing Canvas 2D renderer, static asset files, and current test stack.
- Small, loosely coupled design: Pass. A dedicated asset registry, render-facing resolver helpers, and scene-specific drawing adapters keep the visual-template system small and separate from gameplay state and rules.
- Artifact consistency: Pass with planned updates. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` under `specs/011-unit-tile-templates/`. No constitution or global template changes are expected.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains focused on visual-template selection and fallback rendering rather than expanding into animation, content editing, or gameplay changes.
- Independent slices: Still passes. Units/objects, terrain tiles, and fallback behavior remain separable stories that can be validated independently once the shared mapping seam exists.
- Feature-proving tests: Still passes. The design exposes public seams for template selection, fallback resolution, and map/battle rendering behavior that can be exercised through contract, integration, and acceptance coverage.
- Minimal dependencies, real integrations: Still passes. Existing browser asset loading and Canvas 2D rendering remain sufficient, and the design avoids introducing rendering middleware or third-party sprite systems.
- Small, loosely coupled design: Still passes. The feature can be implemented through a narrow asset-template registry plus scene-level render helpers instead of spreading visual-selection logic across unrelated gameplay modules.
- Artifact consistency: Still passes. The plan, research, data model, contracts, and quickstart all describe the same dedicated-template plus fallback-rendering slice.

## Project Structure

### Documentation (this feature)

```text
specs/011-unit-tile-templates/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── visual-template-mapping.md
│   └── map-battle-visual-readability.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── content/
│   └── scenarios/
├── engine/
│   └── scenario/
│       └── types.ts
├── render/
│   ├── canvas/
│   │   ├── renderBattleScene.ts
│   │   ├── renderGuardedLocations.ts
│   │   ├── renderMapScene.ts
│   │   └── viewportRender.ts
│   └── sprites/
│       ├── placeholders.ts
│       ├── visualTemplateCatalog.ts
│       ├── visualTemplateResolver.ts
│       └── assets/
└── ui/

tests/
├── acceptance/
├── contract/
└── integration/
```

**Structure Decision**: Keep the existing single frontend application and extend the current renderer with a small visual-template catalog plus resolver under `src/render/sprites/`. Map and battle scenes should ask the resolver for dedicated or fallback visuals rather than hardcoding colors and glyphs inline. This keeps gameplay state untouched while isolating asset selection in one rendering-focused seam.

## Complexity Tracking

No constitution violations currently require justification.
