# Implementation Plan: Grid Combat Tactics

**Branch**: `007-combat-grid` | **Date**: 2026-07-15 | **Spec**: [spec.md](/C:/programy/disc2/specs/007-combat-grid/spec.md)

**Input**: Feature specification from `/specs/007-combat-grid/spec.md`

## Summary

Upgrade the current battle flow from automatic lowest-health targeting into a formation-based tactics layer. Battles will render units on a 3x4-per-side grid, expose player-driven target selection for strike actions, apply distinct melee, ranged, and area-of-effect targeting rules, and add a defend action that halves incoming damage until the defending unit’s next turn begins. The implementation will preserve the existing queue-driven battle lifecycle and map-to-battle transition while adding explicit battle interaction state, formation metadata, and behavior-level coverage across engine, scene controller, HUD, and canvas rendering.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite app tooling, Vitest for contract and integration tests, Playwright for browser acceptance coverage

**Storage**: In-memory runtime state plus static scenario content files in the repository

**Testing**: Vitest contract and integration suites for formation rules, attack targeting, defend-state resolution, and queue behavior; Playwright acceptance flows for player-driven target selection, strike, defend, and full battle completion

**Target Platform**: Modern desktop browsers with mouse input

**Project Type**: Single-project web application

**Performance Goals**: Keep battle input and rendering responsive with immediate target feedback and action resolution at the current small battle size without visible lag

**Constraints**: Browser-only runtime, Canvas 2D rendering, no new combat dependency libraries, preserve the existing battle entry and victory flow, keep one action per turn, and support system-driven turns for non-player-controlled sides using the same legality model

**Scale/Scope**: One formation-based battle slice covering slot layout, attack categories, target selection, strike/defend actions, temporary defend mitigation, and AI-compatible rule reuse without battle movement

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. The driving spec is [spec.md](/C:/programy/disc2/specs/007-combat-grid/spec.md), and implementation should proceed through this plan and a dedicated `tasks.md` before combat behavior changes.
- Independent slices: Pass. US1 delivers explicit target selection for player turns and is independently valuable. US2 layers attack-category targeting rules on top of that interaction. US3 adds defend-state tactics without requiring a redesign of earlier stories. The main unavoidable dependency is that US2 and US3 rely on the acting-unit and target-selection seams introduced in US1.
- Feature-proving tests: Pass. US1 will be proven with battle interaction contract, integration, and acceptance flows. US2 will be proven with rule-specific engine and UI-level tests for melee, ranged, and area effects. US3 will be proven with defend-state engine and acceptance coverage.
- Minimal dependencies, real integrations: Pass. No new libraries are required. The feature extends the existing battle engine, rendering, and UI seams using the current TypeScript/Vite/Vitest/Playwright toolchain.
- Small, loosely coupled design: Pass. Formation state, targeting rules, action resolution, and battle UI can be separated into focused seams so battle logic stays locally understandable.
- Artifact consistency: Pass. This plan will refresh `research.md`, `data-model.md`, `quickstart.md`, and `contracts/` for feature `007`, and update `AGENTS.md` to point to this active combat plan.

### Post-Design Constitution Check

- Spec before code: Still passes. The design remains bounded to tactical battle interaction and does not broaden into unit movement, new reward systems, or adventure-map combat entry changes.
- Independent slices: Still passes. Target selection, attack-category reach, and defend-state mitigation remain separable user stories with clear proofs.
- Feature-proving tests: Still passes. The design exposes public seams for formation placement, legal-target resolution, defend-state expiration, and UI action flow that can be exercised through contract, integration, and acceptance coverage.
- Minimal dependencies, real integrations: Still passes. The feature continues to use the existing browser stack and real battle scene/controller flow.
- Small, loosely coupled design: Still passes. Formation data, target legality, damage mitigation, and UI action state each live behind narrow boundaries.
- Artifact consistency: Still passes. Plan, research, data model, contracts, quickstart, and AGENTS all describe the same grid-battle, target-selection, and defend workflow.

## Project Structure

### Documentation (this feature)

```text
specs/007-combat-grid/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   |-- battle-targeting-state.md
|   `-- battle-formation-ux.md
`-- tasks.md
```

### Source Code (repository root)

```text
src/
|-- app/
|   |-- scene-controller/
|   |   |-- battleInputController.ts
|   |   `-- battleScene.ts
|   `-- state/
|       `-- gameState.ts
|-- engine/
|   |-- battle/
|   |   |-- battleFormation.ts
|   |   |-- battleTurnEngine.ts
|   |   |-- battleTargeting.ts
|   |   `-- createBattle.ts
|   `-- scenario/
|       `-- types.ts
|-- render/
|   |-- canvas/
|   |   `-- renderBattleScene.ts
|   `-- sprites/
|       `-- placeholders.ts
|-- ui/
|   `-- overlays/
|       `-- battleHud.ts
`-- main.ts

tests/
|-- acceptance/
|-- contract/
`-- integration/
```

**Structure Decision**: Keep the existing single frontend application and extend the current battle engine with dedicated formation and targeting seams under `src/engine/battle/`. Player interaction state will stay in `battleInputController.ts` and `gameState.ts`, while rendering and action affordances remain in `renderBattleScene.ts` and `battleHud.ts`. This preserves the current map-to-battle transition while keeping tactical combat rules isolated from adventure-map logic.

## Complexity Tracking

No constitution violations currently require justification.
