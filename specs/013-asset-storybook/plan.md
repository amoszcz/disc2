# Implementation Plan: Asset Storybook

**Branch**: `013-asset-storybook` | **Date**: 2026-07-16 | **Spec**: [spec.md](/C:/programy/disc2/specs/013-asset-storybook/spec.md)

**Input**: Feature specification from `/specs/013-asset-storybook/spec.md`

## Summary

Add a menu-selectable asset storybook scene that lists supported heroes, battle units, and map objects in isolated preview tiles. The implementation should reuse the existing visual-template catalog, animation-state profiles, and resolver seams so every preview is rendered through the same logic as gameplay, while introducing a lightweight storybook scene mode, preview-specific state selection data, and UI controls for switching each subject between its supported states.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, browser-native Canvas 2D rendering, current scene/bootstrap state flow, current visual-template catalog and resolver, existing Vitest and Playwright suites

**Storage**: In-memory runtime state plus repository asset files and static rendering metadata

**Testing**: Vitest contract and integration suites, Playwright acceptance coverage, and existing render diagnostics exposed through public render seams

**Target Platform**: Modern desktop and mobile browsers supported by the current game

**Project Type**: Single-project web application

**Performance Goals**: Keep menu-to-storybook navigation immediate, keep storybook preview updates visually responsive during repeated state switching, and avoid noticeable lag while rendering the full list of currently supported preview subjects

**Constraints**: Browser-only runtime, Canvas 2D rendering, no new rendering framework, preserve current scenario and battle flows, reuse the exact same subject-resolution logic as gameplay, and keep the first slice focused on isolated review tiles rather than advanced animation-authoring tools

**Scale/Scope**: One new scene mode, one menu entry, current supported hero/unit/object visual subjects, one shared storybook subject catalog, and current supported animation/object states across desktop and mobile layouts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The work is driven by [spec.md](/C:/programy/disc2/specs/013-asset-storybook/spec.md) and will continue through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 provides independent value by making the storybook reachable from the menu and safely returnable. US2 delivers the core preview-and-selector experience for supported subjects. US3 adds transition and fallback review hardening on top of the shared storybook surface. The only shared dependency is the new storybook scene seam and preview catalog that US2 and US3 both reuse.
- Feature-proving tests: Pass. US1 can be proven through menu contract and acceptance navigation coverage. US2 can be proven through integration and acceptance checks that preview subjects resolve through the same visual logic as gameplay. US3 can be proven through fallback-oriented contract or integration checks plus browser verification of state switching visibility.
- Minimal dependencies, real integrations: Pass. No new external library is required. The feature should reuse the existing menu rendering, game state, Canvas 2D preview drawing, and visual-template resolver rather than introducing a component framework, router, or separate asset-review stack.
- Small, loosely coupled design: Pass. The design can stay within narrow seams around scene mode, menu overlay rendering, a dedicated storybook renderer/controller pair, and shared preview subject resolution helpers without changing map or battle rule logic.
- Artifact consistency: Pass with planned updates. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` under `specs/013-asset-storybook/`. No constitution or global template change is expected.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains focused on a review scene and does not expand into asset editing, export workflows, or new gameplay mechanics.
- Independent slices: Still passes. Menu access, subject previewing, and fallback/transition review remain independently demonstrable once the shared storybook subject seam exists.
- Feature-proving tests: Still passes. The design exposes public seams for menu state, storybook subject catalogs, preview state switching, resolver-backed preview rendering, and storybook acceptance flows.
- Minimal dependencies, real integrations: Still passes. Existing browser APIs, repository render seams, and current test tooling are sufficient; no third-party UI or animation library is needed.
- Small, loosely coupled design: Still passes. Scene selection, storybook state, preview rendering, and sidebar/menu controls remain isolated enough to evolve independently from map and battle logic.
- Artifact consistency: Still passes. The plan, research, data model, contracts, and quickstart all describe the same menu-accessible, resolver-backed storybook design.

## Project Structure

### Documentation (this feature)

```text
specs/013-asset-storybook/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- storybook-menu-access.md
|   `-- storybook-preview-readability.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- bootstrap/
|   |   `-- startGame.ts
|   |-- scene-controller/
|   |   |-- battleScene.ts
|   |   |-- mapScene.ts
|   |   |-- sceneController.ts
|   |   `-- storybookScene.ts
|   `-- state/
|       `-- gameState.ts
|-- engine/
|   `-- scenario/
|       `-- types.ts
|-- render/
|   |-- canvas/
|   |   `-- renderStorybookScene.ts
|   `-- sprites/
|       |-- visualTemplateCatalog.ts
|       `-- visualTemplateResolver.ts
`-- ui/
    `-- overlays/
        |-- mainMenu.ts
        `-- storybookPanel.ts

tests/
|-- acceptance/
|-- contract/
`-- integration/
```

**Structure Decision**: Keep the existing single frontend application and add a dedicated `storybook` scene mode plus a narrow rendering/controller seam for isolated previews. Shared subject/state metadata should live close to the existing visual-template catalog and resolver so the storybook reuses gameplay logic instead of introducing a second asset-mapping system.

## Complexity Tracking

No constitution violations currently require justification.
