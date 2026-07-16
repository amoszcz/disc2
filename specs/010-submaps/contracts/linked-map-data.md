# Contract: Linked Map Data

## Purpose

Define the scenario-data contract for linked submap travel.

## World Map Contract

- A scenario may define one main world map and zero or more linked submaps.
- Every world map in a scenario must have a stable unique identifier.
- A linked submap must be addressable by scenario data without relying on implicit ordering.

## Link Definition Contract

- Every travel link must define a source map, source position, destination map, and destination position.
- Travel links must support cave-style entry, teleport-style entry, and equivalent scenario-defined trigger semantics through the same shared structure.
- Exit links must be able to target specific return positions on the main map or another linked map.
- Multiple links may coexist in the same scenario without overwriting one another.

## Validation Contract

- Broken map identifiers, invalid coordinates, and incomplete travel links must fail safely.
- Invalid link definitions must not mutate active session state before validation succeeds.
- Repeated use of the same link must resolve to the same configured destination unless a future feature explicitly changes that rule.
# Linked Map Data Contract

## Scenario Shape

- A linked-map scenario exposes `worldMaps[]` with exactly one `kind: "main"` map and zero or more `kind: "submap"` maps.
- Each hero, pickup, and guarded location stores a `mapId` that resolves to one of the scenario world maps.
- `mapLinks[]` contains directed travel links between world maps with `sourceMapId`, `sourcePosition`, `triggerKind`, `destinationMapId`, and `destinationPosition`.

## Validation Rules

- Every `worldMap.id` must be unique within the scenario.
- Every `mapId`, `sourceMapId`, and `destinationMapId` must reference an existing world map in the same scenario.
- Every hero, pickup, guarded location, and travel-link coordinate must be in bounds for its referenced world map.
- Invalid links must fail safely at runtime instead of mutating the session into an unreachable map state.

## Runtime Expectations

- The active session starts on the scenario's main world map.
- Enter links such as `cave` and `teleport` move the hero into a linked submap without restarting the scenario session.
- Exit links keep their distinct return destinations so one submap can lead back to multiple main-map tiles.
- Repeated travel preserves the same session state, including prior pickup, guard, and hero progress.
