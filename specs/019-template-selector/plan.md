# Implementation Plan: Switch Visual Templates

**Branch**: `019-template-selector` | **Date**: 2026-07-18 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/019-template-selector/spec.md`

## Summary

Introduce one visual-template catalog containing valid same-base-name PNG and JSON pairs, with the default template identifier declared in the game configuration. Initialize session state from that configured default, then expose its shared selection through dropdowns in gameplay, the asset storybook, and the sprite mapper. Replace the current fixed runtime atlas and fixed mapper endpoint with selected-template adapters so every renderer resolves its frames and image from the active catalog entry. The mapper will retain its existing validation and dirty-change protections while loading and saving only the chosen template's map.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app and development-server middleware, browser-native Canvas 2D, fetch, pointer events, Vitest, and Playwright

**Storage**: Repository PNG/JSON template pairs in one catalog; game configuration identifies the default catalog entry; session-only in-memory active-template state; local Vite development middleware writes the selected validated JSON map

**Testing**: Vitest contract and integration tests for template discovery, active-selection state, resolver behavior, and mapper source isolation; Playwright acceptance coverage for each dropdown and selected-map save behavior

**Target Platform**: Modern desktop and mobile browsers; template-map saving remains available only through the local development server

**Project Type**: Single-project web application with a narrowly scoped developer-only file-writing adapter

**Performance Goals**: Change template and update visible gameplay/storybook/mapper previews within one render cycle for the current atlas sizes; avoid perceptible delay when listing the currently available pairs

**Constraints**: No new dependencies; a valid template requires PNG and JSON files with the same base name and one catalog entry; game configuration must name a valid default catalog entry; preserve gameplay session progress, storybook selections, fallback rendering, and mapper unsaved-change warnings; do not expose arbitrary filesystem reads or writes

**Scale/Scope**: Two initial templates (current and WIP) with future same-name pairs discoverable through the configured asset directories; one active session selection shared by map, battle, storybook, and mapper

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. [spec.md](spec.md) drives the feature and it will proceed to a dependency-ordered `tasks.md` before implementation.
- Independent slices: Pass. US1 establishes the active-template registry and gameplay selector, US2 reuses that public selection in storybook review, and US3 connects the mapper's isolated load/save flow. The shared registry is a deliberate foundation, but each surface remains independently demonstrable.
- Feature-proving tests: Pass. Discovery and active-selection contracts prove paired-source behavior; resolver/state integration tests prove game and storybook rendering uses the active source; mapper-client/save-boundary tests and browser flows prove selected-map isolation and unsaved-change protection.
- Minimal dependencies, real integrations: Pass. Existing Canvas, fetch, Vite middleware, and test tooling are sufficient. The Vite adapter continues to exercise real local file reads/writes without adding a server framework or file API.
- Small, loosely coupled design: Pass. One catalog owns pair discovery and identifiers, game configuration owns only the default identifier, catalog construction/resolution owns rendering metadata, UI controls only update session state, and the mapper client owns selected-source transport. This prevents map and battle logic from depending on developer editing details.
- Artifact consistency: Pass with planned additions. This feature adds this plan, research, data model, quickstart, and a cross-surface template-selection contract under `specs/019-template-selector/`. Existing mapper contract and tests will be extended during task generation to reflect a selected source rather than one hard-coded atlas.

### Post-Design Constitution Check

- Spec before code: Still passes. The design is limited to selecting existing asset pairs and their rendering/editing adapters.
- Independent slices: Still passes. A selector with current-template rendering is useful before WIP mapper persistence; storybook and mapper consume the same stable selection seam without requiring gameplay-rule changes.
- Feature-proving tests: Still passes. Public dropdown, state, source-list, resolver, and mapper boundaries provide behavior-level evidence for all stories.
- Minimal dependencies, real integrations: Still passes. One catalog and the existing game configuration can be served through the current build/development configuration; no package is introduced.
- Small, loosely coupled design: Still passes. A typed `VisualTemplateSource` boundary prevents frame lookup, image loading, UI state, and file persistence from sharing mutable state directly.
- Artifact consistency: Still passes. Plan, research, data model, UI contract, and quickstart consistently define valid paired sources, session selection, fallback behavior, and selected-map-only persistence.

## Project Structure

### Documentation (this feature)

```text
specs/019-template-selector/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── template-selection.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── bootstrap/startGame.ts
│   ├── scene-controller/
│   │   ├── spriteMappingScene.ts
│   │   └── storybookScene.ts
│   └── state/gameState.ts
├── developer/sprite-mapping/
│   └── atlasMappingClient.ts
├── engine/scenario/types.ts
├── render/
│   ├── canvas/
│   │   ├── renderMapScene.ts
│   │   └── renderStorybookScene.ts
│   └── sprites/
│       ├── visualTemplateCatalog.ts
│       ├── visualTemplateConfig.ts
│       ├── visualTemplateRegistry.ts
│       └── visualTemplateResolver.ts
└── ui/
    ├── hud/mapHud.ts
    └── overlays/
        ├── battleHud.ts
        ├── spriteMappingPanel.ts
        └── storybookPanel.ts

tests/
├── acceptance/
├── contract/
└── integration/

vite.config.ts
wip/sprite-atlas/
└── <template-name>.png + <template-name>.json
```

**Structure Decision**: Keep the single web application. Add one focused visual-template catalog beside the current renderer catalog to construct immutable source descriptors from paired assets. Add a small game-configuration module that chooses one catalog identifier as the default; it does not duplicate catalog metadata. Keep session state and selector event wiring in existing application/UI seams. Adapt the mapper client and Vite middleware to explicitly receive a catalog identifier and constrain every read/write to its registered pair. No game-rule, scenario, or generic filesystem abstraction is introduced.

## Complexity Tracking

No constitution violations currently require justification.
