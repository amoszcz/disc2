# Contract: Campaign Map Data and Validation

## Purpose

Defines the repository-facing contract between scenario loading/generation, traversal, validation, and the Canvas renderer. It is a TypeScript application contract, not a network API.

## Semantic Map Provider

```text
resolveCampaignMap(scenario, activeMapId) -> GeneratedCampaignMap
```

Required guarantees:

- A resolved map has a stable `mapId`, seed/config identity, dimensions, cells, regions, locations, connections, metadata, and validation result.
- Repeated resolution with the same supported scenario/generation inputs produces identical gameplay-relevant output.
- The current scenario-map adapter preserves existing coordinates, terrain legality/costs, bridges, map links, and objective identities.
- A renderer can consume the output without importing route or hero-action logic.

## Traversal Lookup

```text
resolveCampaignTraversal(map, from, to) -> { walkable, movementCost, crossing, explanation }
```

- Coordinates outside the map are unavailable with a specific explanation.
- Impassable water, mountains, or blocked cells are unavailable unless a semantic crossing/pass applies.
- Decorative stamp placement, label layout, texture choice, and cache state cannot affect this result.
- Existing route preview/cancel/confirm behavior calls this seam or an equivalent adapter and retains its current public feedback states.

## Validation

```text
validateCampaignMap(map, requirements) -> MapValidationResult
```

The result contains `valid`, `score`, `errors`, `warnings`, and numeric metrics. Validation must check:

- essential locations and objectives are reachable;
- road paths connect their stated endpoints and do not cross an impassable barrier without a crossing;
- required passes/crossings exist;
- start-area choices and enemy progression satisfy scenario constraints;
- location spacing, biome diversity, reasonable density, and optional route loops satisfy configured bounds.

Generated maps failing essential checks must be repaired/retried within a bounded deterministic strategy or rejected before player use. Adapted existing maps may report warnings while compatibility behavior remains unchanged until explicitly migrated.

## Serialization

Any future persisted campaign map must include a schema version. Deserialization must either reproduce equivalent semantic gameplay data or fail explicitly with a migration path; it must not silently alter locations, routes, costs, or fogged progress.
