# Contract: Visual Template Mapping

## Purpose

Define the mapping contract that connects supported units, map objects, heroes, location markers, and terrain tiles to dedicated or fallback visual templates.

## Mapping Guarantees

- Every supported rendered subject must resolve to one renderable visual template.
- Dedicated templates should be preferred whenever they are available for the requested subject.
- Fallback templates must remain available when a dedicated template is missing, incomplete, or intentionally omitted for testing.
- The same subject should resolve consistently across repeated renders unless its content mapping changes.

## Coverage Guarantees

- Current hero and unit types must be coverable through the mapping contract.
- Current movement-object types and guarded-location markers must be coverable through the mapping contract.
- Current terrain tile types must be coverable through the mapping contract.
- The contract must support mixed coverage, where some subjects use dedicated templates and others use fallback templates in the same scene.

## Fallback Guarantees

- Missing dedicated assets must not make supported subjects disappear from the scene.
- Fallback rendering must remain sufficiently readable to support gameplay and testing.
- The system must be able to report or infer whether a resolved template is dedicated or fallback for testing purposes.
- Asset-loading behavior should allow the scene to repaint once a dedicated template becomes available after an initial fallback draw.

## Maintenance Notes

- New supported units, map objects, guarded-location states, terrain types, or resource pickups should add catalog entries before scene-specific render logic changes.
- Dedicated assets should remain small reusable files that fit the current Canvas 2D rendering flow without introducing a separate sprite runtime.

## Acceptance Signals

- A tester can verify which current subjects have dedicated coverage and which still rely on fallback.
- A renderer can request a visual template without embedding subject-specific asset-selection rules inline.
