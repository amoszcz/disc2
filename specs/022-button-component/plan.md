# Implementation Plan: Shared Tactile Button Component

**Branch**: `022-button-component` | **Date**: 2026-07-21 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/022-button-component/spec.md`

## Summary

Create one reusable button renderer for every application control, then migrate the menus, map actions, battle actions, settings, storybook, victory, and sprite-mapping controls to it. The renderer will preserve existing action hooks and availability rules while exposing the visual and accessible states needed for tactile interaction; shared presentation rules will provide rest, hover, pressed, focus, disabled, busy, and selected feedback.

## Technical Context

**Language/Version**: TypeScript 5.x

**Primary Dependencies**: Existing Vite browser application; no new dependencies

**Storage**: In-memory UI and game state; no new persisted data

**Testing**: Vitest contract and integration suites; Playwright browser acceptance coverage where interaction feedback needs browser-level proof

**Target Platform**: Modern desktop and touch-capable mobile browsers

**Project Type**: Single-project browser application

**Performance Goals**: State feedback is immediate to the user and introduces no observable delay to existing button actions

**Constraints**: Preserve all existing button labels, icons, identifiers, test hooks, action data, event bindings, and enabled/disabled rules; maintain existing responsive layouts; avoid new UI dependencies

**Scale/Scope**: One shared button presentation and every button currently rendered across map, battle, menu, settings, storybook, victory, and sprite-mapping surfaces

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Spec before code: Pass. [spec.md](spec.md) defines the shared-button behavior and this plan traces its delivery and validation.
- Independent slices: Pass. The P1 migration preserves all player controls; P2 adds interaction feedback; P3 completes the reusable configuration contract. Each can be demonstrated through rendered UI surfaces and representative controls.
- Feature-proving tests: Pass. Add a shared-button contract and retain or extend UI-surface contracts for migrated identifiers and availability. Use browser checks for focus and pointer-visible states if contract checks cannot provide adequate evidence.
- Minimal dependencies, real integrations: Pass. Use the existing rendering and browser styling model; no dependency or external integration is needed.
- Small, loosely coupled design: Pass. Keep button markup generation in one UI helper, state-specific presentation in existing shared stylesheet rules, and existing screen event binding in place. This avoids coupling game actions to button rendering.
- Artifact consistency: Pass. This feature adds a plan, research, data model, UI contract, and validation guide under `specs/022-button-component/`; no template or constitution amendment is required.

### Post-Design Constitution Check

- Spec before code: Still passes. The design maps the feature requirements to a single explicit UI contract and implementation seams.
- Independent slices: Still passes. The renderer and migration deliver P1; semantic and tactile states satisfy P2; the documented property model satisfies P3 without requiring new game behavior.
- Feature-proving tests: Still passes. The contract specifies public markup and state outcomes, and the quickstart requires both focused checks and existing UI-flow regression coverage.
- Minimal dependencies, real integrations: Still passes. The browser's native button semantics and existing test stack meet all requirements.
- Small, loosely coupled design: Still passes. Individual renderers supply configuration only, while the shared renderer owns common semantics and styles own visual states.
- Artifact consistency: Still passes. All Phase 0 and Phase 1 artifacts describe the same scope and validation approach.

## Project Structure

### Documentation (this feature)

```text
specs/022-button-component/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── button-ui-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── ui/
│   ├── components/
│   │   └── button.ts
│   ├── hud/
│   ├── overlays/
│   └── panels/
└── app/
    └── scene-controller/

index.html                 # Shared UI presentation rules
tests/
├── contract/              # Markup and semantic-state contracts
├── integration/           # Existing UI interaction flows
└── acceptance/            # Browser-visible behavior
```

**Structure Decision**: Keep the current single browser application. Add one focused shared UI component under `src/ui/components`, update existing UI renderers to consume it, retain the existing controller bindings, and keep shared interaction styling in the existing application stylesheet.

## Complexity Tracking

No constitution violations require justification.
