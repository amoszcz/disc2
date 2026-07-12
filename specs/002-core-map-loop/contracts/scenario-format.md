# Contract: Scenario Format

## Purpose

Define the repository content contract for the handcrafted scenario data used by the first playable slice.

## Scenario Definition Contract

A scenario definition must provide:

- Scenario identity and display name
- Map dimensions or equivalent playfield bounds
- Player definitions
- Initial hero placement
- Initial hero force composition
- Resource pickup placements
- Guarded location placements
- Guard force compositions
- Default elimination victory rule

## Required Relationships

- Every hero must belong to an existing player.
- Every guard force must be linked to an existing guarded location.
- Every guarded location must have a valid map position inside scenario bounds.
- Every pickup must have a valid map position inside scenario bounds.
- Every unit referenced by a hero or guard force must be defined in the scenario roster or content set.

## Runtime Guarantees

- Scenario loading must fail fast if required references are missing.
- Invalid scenario data must not start a playable session in a partially broken state.
- Loaded scenario data must be transformed into the authoritative runtime state before player interaction begins.

## First-Slice Scope

The scenario format for this slice does not need to support:

- Cities or building trees
- Recruitment pools
- Multi-hero starting rosters per side beyond the minimal scenario need
- Custom victory rules beyond default elimination
- Scripting for events, dialogue, or cutscenes
