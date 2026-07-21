# Implementation Plan: Strategy UX Clarity

**Branch**: `023-strategy-ux` | **Date**: 2026-07-21 | **Spec**: [spec.md](spec.md)

## Summary

Make map, battle, and turn decisions understandable before commitment with consistent decision previews, unavailable-action explanations, and reversible selection paths. Reuse current game state and controls rather than changing game rules.

## Technical Context

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: Existing Vite browser application; no new dependencies  
**Storage**: In-memory game state only  
**Testing**: Vitest contracts/integration flows and Playwright desktop/mobile acceptance flows  
**Target Platform**: Modern desktop and touch-capable mobile browsers  
**Project Type**: Single browser application  
**Performance Goals**: Decision feedback updates within the same UI refresh as input state  
**Constraints**: Preserve game rules and hidden information; retain responsive layouts  
**Scale/Scope**: Map route planning, end-turn feedback, battle availability, and shared responsive controls

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. [spec.md](spec.md) is the feature source of truth.
- Independent slices: Pass. Map decisions (P1), battle/turn availability (P2), and cross-device consistency (P3) are independently demonstrable.
- Feature-proving tests: Pass. Add public UI contracts and desktop/mobile flows for each decision state and recovery path.
- Minimal dependencies, real integrations: Pass. Use existing state, browser semantics, and test stack; add no dependency.
- Small, loosely coupled design: Pass. Keep derived explanation text in focused presentation helpers; preserve map and battle rule engines.
- Strategy UX clarity: Pass. Each primary action shows selection and known consequences before commitment, explains unavailable states, and offers recovery without hover-only information.
- Artifact consistency: Pass. This feature adds plan, research, data model, UI contract, and quickstart artifacts.

### Post-Design Constitution Check

- All checks still pass. The design derives presentations from existing route, battle, traversal, and turn state and requires browser proof for touch and keyboard paths.

## Project Structure

```text
src/
├── app/scene-controller/{mapInputController,battleInputController}.ts
├── ui/{hud/mapHud,overlays/battleHud,panels/mapActionBar}.ts
└── engine/map/routePreviewState.ts

tests/{contract,integration,acceptance}/
```

**Structure Decision**: Add small presentation helpers beside existing HUDs and bind recovery actions through current input/action controllers. Derive previews and availability from existing state.

## Complexity Tracking

No constitution violations require justification.
