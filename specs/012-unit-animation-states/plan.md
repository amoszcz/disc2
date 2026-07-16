# Implementation Plan: Unit And Object Animation States

**Branch**: `012-unit-animation-states` | **Date**: 2026-07-16 | **Spec**: [spec.md](/C:/programy/disc2/specs/012-unit-animation-states/spec.md)

**Input**: Feature specification from `/specs/012-unit-animation-states/spec.md`

## Summary

Extend the existing dedicated-visual system with an approved animation-state vocabulary for map heroes, battle units, and eligible map objects. The implementation should preserve the current Canvas 2D rendering flow, reuse the visual-template catalog and resolver seams, add state-aware subject profiles and fallback rules, and keep the first slice focused on readable state selection rather than full production animation timing or advanced sprite runtime behavior.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser app, browser-native Canvas 2D rendering, current scenario/type definitions, current visual-template catalog and resolver

**Storage**: Repository image assets plus in-memory runtime state/mapping metadata

**Testing**: Vitest contract and integration suites, Playwright acceptance coverage, and lightweight rendering diagnostics exposed through public render seams

**Target Platform**: Modern desktop and mobile browsers supported by the current game

**Project Type**: Single-project web application

**Performance Goals**: Preserve the current responsive map and battle rendering feel, keep state-selection lookup effectively instantaneous for current scenario sizes, and avoid visible lag when stateful visuals refresh during movement, battle actions, or fallback replacement

**Constraints**: Browser-only runtime, Canvas 2D rendering, no new rendering framework, preserve current gameplay rules, preserve fallback readability, and keep the first animation slice focused on state selection and asset mapping rather than full timing-heavy animation polish

**Scale/Scope**: Current supported hero roster, current supported battle-capable units, current supported interactable object types, one shared animation-state catalog, and both existing scenarios across map and battle scenes

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The work is driven by [spec.md](/C:/programy/disc2/specs/012-unit-animation-states/spec.md) and will continue through this plan and a follow-up `tasks.md` before implementation.
- Independent slices: Pass. US1 covers map-hero movement and event states as a valuable MVP slice. US2 covers battle-unit action and outcome states independently through battle readability. US3 adds the shared catalog and asset-preparation contract needed to keep future art work consistent. The only practical dependency is that US1 and US2 both reuse the shared state vocabulary introduced for US3.
- Feature-proving tests: Pass. US1 can be proven through map-scene integration and acceptance flows that validate directional hero state selection. US2 can be proven through battle rendering and combat-flow checks that validate action, defend, hit, victory, and perish state mapping. US3 can be proven through contract coverage for vocabulary, profile coverage, and fallback behavior.
- Minimal dependencies, real integrations: Pass. No new external libraries are required. The work should stay within the existing Canvas 2D renderer, static asset files, visual-template mappings, and current test stack.
- Small, loosely coupled design: Pass. The feature can live in narrow seams around scenario/render-facing types, the visual-template catalog, the visual resolver, and map/battle render helpers instead of spreading animation-state selection across gameplay rules.
- Artifact consistency: Pass with planned updates. This feature adds `plan.md`, `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` under `specs/012-unit-animation-states/`. No constitution or global template changes are expected.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains focused on naming, coverage, resolution, and validation of animation states rather than expanding into new gameplay mechanics or external tooling.
- Independent slices: Still passes. Hero movement readability, battle-state readability, and shared asset-vocabulary governance remain independently demonstrable once the shared resolver seam exists.
- Feature-proving tests: Still passes. The design exposes public seams for state vocabulary, subject-state profiles, fallback behavior, and map/battle rendering diagnostics that can be exercised through contract, integration, and acceptance coverage.
- Minimal dependencies, real integrations: Still passes. Existing browser APIs, repository rendering seams, and current tooling remain sufficient; no third-party animation runtime is needed.
- Small, loosely coupled design: Still passes. State vocabulary, state resolution, and scene-specific rendering hooks can evolve independently while reusing the existing visual-template system.
- Artifact consistency: Still passes. The plan, research, data model, contracts, and quickstart all describe the same state-catalog and fallback-first design.

## Project Structure

### Documentation (this feature)

```text
specs/012-unit-animation-states/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- animation-state-catalog.md
|   `-- map-battle-animation-readability.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- bootstrap/
|   |   `-- startGame.ts
|   `-- scene-controller/
|       |-- battleScene.ts
|       `-- mapScene.ts
|-- engine/
|   |-- battle/
|   |   |-- battleTargeting.ts
|   |   `-- battleTurnEngine.ts
|   |-- map/
|   |   `-- heroActions.ts
|   `-- scenario/
|       `-- types.ts
|-- render/
|   |-- canvas/
|   |   |-- renderBattleScene.ts
|   |   |-- renderGuardedLocations.ts
|   |   `-- renderMapScene.ts
|   `-- sprites/
|       |-- assets/
|       |-- placeholders.ts
|       |-- visualTemplateCatalog.ts
|       `-- visualTemplateResolver.ts
`-- ui/

tests/
|-- acceptance/
|-- contract/
`-- integration/
```

**Structure Decision**: Keep the existing single frontend application and extend the current renderer with animation-state aware catalog entries and resolver logic under `src/render/sprites/`. Scene renderers should request subject states through a shared seam instead of hardcoding animation choices inline. Existing battle/map gameplay modules may supply the state-selection signals they already imply, but the rules themselves remain unchanged.

## Complexity Tracking

No constitution violations currently require justification.
