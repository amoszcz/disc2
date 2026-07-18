# Implementation Plan: Sprite Mapping Tool

**Branch**: `015-sprite-mapping-tool` | **Date**: 2026-07-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/015-sprite-mapping-tool/spec.md`

## Summary

Add a developer-only Sprite Mapping page that loads the WIP atlas PNG and `game-atlas.json`, presents every mapped crop as a review gallery, and shows a selected crop boundary over a pannable image canvas. A shared x/y alignment offset changes every preview in real time. Saving validates the entire adjusted map and, only in the local development workflow, persists the corrected coordinates to the selected WIP JSON before reloading it. The page reuses the existing scene/menu/storybook composition patterns, Canvas rendering, and Vite tooling; it does not change normal game rendering or introduce a UI library.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, browser-native Canvas 2D and pointer events, Vite local development server middleware, Vitest, Playwright

**Storage**: WIP PNG atlas and JSON coordinate map in the repository; in-memory editor state while reviewing; local development server writes only validated JSON saves

**Testing**: Vitest contract and integration suites for atlas parsing, dimension mismatch detection, offset application, validation, save payload construction, and state transitions; Playwright acceptance coverage for gallery review, canvas panning, reset, invalid-save prevention, and successful local save/reload behavior

**Target Platform**: Local developer browsers running the repository's Vite development server; ordinary game browser builds remain read-only

**Project Type**: Single-project web application with a developer-only local file-writing integration

**Performance Goals**: Render all current atlas entries and refresh selected/gallery previews within one animation frame after a pan update; prevent save until whole-map validation completes without perceptible delay for the current atlas

**Constraints**: No new dependencies; preserve normal menu, storybook, map, and battle flows; developer page must not be player-facing; save access must be limited to the local development server and the configured WIP coordinate map; the shared correction is translation only

**Scale/Scope**: One current WIP atlas image, one coordinate JSON with roughly 100 sprite entries, one developer scene/page, one global x/y alignment offset, and one local development save endpoint

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. [spec.md](spec.md) drives the feature, which will continue through `tasks.md` before implementation.
- Independent slices: Pass. US1 supplies atlas review and data-quality feedback, US2 adds non-persistent alignment, and US3 adds validated local persistence. US2 builds on a reviewable loaded atlas; US3 builds on the same pure validation/offset seam but does not change review or panning behavior.
- Feature-proving tests: Pass. US1 will use parser/gallery contracts and browser gallery review. US2 will use offset/viewport integration coverage and pointer-driven browser flows. US3 will use save-boundary contracts plus local-development acceptance coverage that reloads persisted corrected coordinates. Existing gameplay tests remain unaffected.
- Minimal dependencies, real integrations: Pass. Browser-native Canvas and pointer APIs satisfy visual alignment. The existing Vite development server supplies the minimal local write boundary; no UI, canvas, file-picker, or server framework is added. Tests exercise the real local save adapter rather than a mock-only replacement.
- Small, loosely coupled design: Pass. Atlas parsing/validation, shared offset math, canvas presentation, gallery UI, developer scene state, and the local persistence adapter remain separate. Gameplay visual-template catalog and ordinary scene rendering are not coupled to the editor.
- Artifact consistency: Pass with planned additions. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and the sprite-mapping UI/save contract under `specs/015-sprite-mapping-tool/`. Vite configuration gains a documented developer-only save seam.

### Post-Design Constitution Check

- Spec before code: Still passes. The design only implements the specified developer review, shared alignment, and explicit save workflow.
- Independent slices: Still passes. Review and validation can ship independently; panning adds reversible editor state; persistence is the final independently demonstrable slice.
- Feature-proving tests: Still passes. The plan includes public contracts for source validation and persistence and end-to-end browser checks for the actual developer workflow.
- Minimal dependencies, real integrations: Still passes. Canvas, pointer input, fetch, and Vite middleware are existing platform/tooling capabilities.
- Small, loosely coupled design: Still passes. Pure atlas functions own parsing, coordinate transformation, and validation; only the local adapter writes the configured JSON file; UI modules own rendering and events.
- Artifact consistency: Still passes. Plan, research, data model, contract, and quickstart use the same current WIP atlas, shared offset, validation, and local-only save boundaries.

## Project Structure

### Documentation (this feature)

```text
specs/015-sprite-mapping-tool/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── sprite-mapping-tool.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── bootstrap/startGame.ts
│   ├── scene-controller/
│   │   ├── sceneController.ts
│   │   └── spriteMappingScene.ts
│   └── state/gameState.ts
├── developer/
│   └── sprite-mapping/
│       ├── atlasMapping.ts
│       ├── atlasMappingClient.ts
│       └── spriteMappingState.ts
├── render/canvas/
│   └── renderSpriteMappingScene.ts
└── ui/overlays/
    ├── mainMenu.ts
    └── spriteMappingPanel.ts

tests/
├── acceptance/
├── contract/
└── integration/

vite.config.ts
wip/sprite-atlas/
├── a_sprite_sheet_sheet_in_2d_digital_art_displays_fa.png
└── game-atlas.json
```

**Structure Decision**: Keep the existing single application and add one developer scene reachable from the main menu. Place pure atlas parsing, shared-offset transformation, and validation under `src/developer/sprite-mapping/`; scene orchestration and Canvas drawing remain thin adapters. Add a narrowly scoped Vite development middleware route that reads/writes only the configured WIP coordinate JSON and rejects production/preview writes. This avoids a general file API and keeps normal game visual-template code independent of atlas editing.

## Complexity Tracking

No constitution violations currently require justification.

## Amendment: Independent Rectangle Editing

The active design is extended beyond shared alignment. Editor state maintains pending per-entry x/y/width/height overrides separately from visual zoom and view pan. A single effective crop rectangle per entry drives selected rendering, gallery previews, bounds validation, and save construction. Explicit entry fields override any optional bulk alignment for that entry.

Canvas dragging converts screen movement through the current canvas scale and zoom into source-pixel changes for the selected entry only. Width and height sliders emit positive whole-pixel proposals. The existing constrained local save boundary accepts a rectangle change set, resolves all entries, validates the entire resulting atlas against actual image dimensions, and writes only x/y/width/height fields while preserving all other JSON metadata.

Additional automated evidence is required for selected-only drag, zoom-independent data state, slider changes, invalid resized crops, and mixed rectangle save/reload. These requirements must be added to the task list before further implementation.
