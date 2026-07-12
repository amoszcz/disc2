# Contract: Scenario Terrain Format

## Purpose

Define the scenario-content contract for the 64x64 terrain-enhanced map.

## Scenario Terrain Contract

A terrain-enhanced scenario definition must provide:

- Scenario identity and display name
- Fixed map dimensions of 64 by 64
- Terrain region definitions
- Hero starting placements
- Any existing scenario objects that remain on the map
- Supported movement terrain types and their implied behavior

## Terrain Region Contract

Each terrain region must provide:

- Region identity
- One terrain type
- Coverage definition that maps to one or more tiles
- Deterministic precedence if overlapping regions are allowed internally

## Required Guarantees

- Every tile queried during movement must resolve to one effective terrain type.
- Terrain regions must never leave a tile in an indeterminate state.
- Region-defined terrain must support roads, grass, plains, mud, woods, mountains, lakes, and rivers.
- Rivers and lakes must resolve as blocked terrain unless a future bridge feature changes that rule.

## Movement Mapping Guarantees

- Road resolves to traversable cost 1.
- Grass and plains resolve to traversable cost 2.
- Mud and woods resolve to traversable cost 3.
- Mountains, lakes, and rivers resolve as non-traversable.
- Diagonal movement uses the destination tile's normal terrain cost.

## Out of Scope for This Contract

- Event scripting
- Procedural terrain generation
- Bridge or water-crossing exception rules
- Terrain-based combat modifiers
