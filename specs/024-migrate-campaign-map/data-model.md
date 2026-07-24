# Data Model: Campaign Map Migration

## Model Boundaries

`GeneratedCampaignMap` is immutable semantic gameplay data. Rendering reads it but never mutates it or determines traversal. Runtime state stores only cache, diagnostic, and map-revision references; current `GameState` remains the authority for heroes, routes, fog, selection, and turn progression.

## Core Entities

### Generated campaign map

| Field | Meaning | Validation |
|---|---|---|
| `schemaVersion` | Versioned semantic-map serialization format | Supported known version |
| `mapId`, `seed`, `configFingerprint` | Stable identity and deterministic inputs | Non-empty ID; equal inputs reproduce semantic output |
| `width`, `height`, `cells` | Logical grid used by traversal, fog, and indexing | Positive dimensions; exactly `width × height` cells |
| `regions` | Small set of named broad areas | Stable IDs; non-empty coverage; no excessive micro-regions |
| `locations` | Named strategic landmarks/objectives | Unique IDs; in bounds; valid type and placement |
| `connections` | Logical roads/trails between locations | Valid endpoint IDs; contiguous legal path |
| `rivers`, `mountainRanges` | Semantic barriers and crossing context | In bounds; passes/crossings explicitly represented |
| `metadata` | Generator version, stream metadata, map revision | Supports diagnostics and compatibility |
| `validation` | Recorded acceptance status and metrics | Must pass before procedural play |

### Campaign cell

| Field | Meaning |
|---|---|
| `position` | Integer map coordinate |
| `elevation`, `moisture`, `corruption`, `temperature` | Normalized terrain inputs retained for validation/debugging |
| `biome`, `regionId` | Broad terrain identity and owning region |
| `walkable`, `movementCost` | Gameplay traversal decision inputs |
| `roadType`, `riverFlow`, `crossing` | Road/river semantics; a crossing permits a legal barrier traversal |
| `tags` | Optional scenario and migration annotations |

### Region, location, and connection

| Entity | Required fields | Relationships |
|---|---|---|
| `CampaignRegion` | `id`, `name`, `biome`, `danger`, `corruption`, optional `factionId`, cells/boundary | Owns zero or more locations; references cells |
| `CampaignLocation` | `id`, `name`, `type`, `position`, `importance`, optional `factionId`, `tags` | Maps existing guarded locations, pickups, passes, settlements, and objectives into named strategic points |
| `CampaignConnection` | `id`, `fromLocationId`, `toLocationId`, `path`, `travelCost`, `roadType` | Endpoints exist; path is legal and crossing-aware |
| `River` / `MountainRange` | `id`, world path, intensity/width, crossing or pass references | Inform cell semantics and renderer layers, not direct hero position |

### Generation configuration and streams

- `CampaignMapGenerationConfig`: dimensions, requested landmarks/objectives, biome thresholds, generation version, and scenario constraints.
- `SeedStreams`: stable named streams (`terrain`, `regions`, `landmarks`, `roads`, `rivers`, `decoration`, `labels`, `ambient`). A stream's changes must not alter a different stream's gameplay output.
- `MapValidationResult`: `valid`, numeric `score`, `errors`, `warnings`, and named metrics.

### Runtime rendering and diagnostics

- `CampaignMapRenderCache`: map identity, revision, device scale, zoom bucket, and cache surfaces for terrain, decoration, roads, labels, and optional fog mask.
- `CampaignMapDebugState`: enabled overlay names, selected diagnostic seed, optional regeneration request, and latest validation result. It is developer-only and does not mutate semantic map data.

## Current-System Adapter

`adaptScenarioWorldMap(scenario, worldMap)` produces a `GeneratedCampaignMap` from `MapDefinition`, rectangular terrain regions, movement-object regions, guarded locations, pickups, heroes, and links. It assigns stable map-derived IDs and semantic tags, converts bridges and exits into crossings/connections where applicable, and preserves the existing logical cell coordinates.

The adapter is the compatibility path for `core-map-loop`, `advanced-terrain-scenario`, and submaps until each map has an explicit generator configuration. It must not change current terrain costs, bridge behavior, route legality, fog coordinates, map links, or visual-template selection contracts.

## State Transitions

```text
scenario definition
  → adapted semantic map OR generated semantic map
  → validation pending
  → accepted | repaired/retried | developer-visible rejection
  → static-cache build/invalidation
  → render + dynamic overlays
```

```text
hero selected → route previewed → confirmed | cancelled | continued
```

The latter is existing `GameState` behavior. Semantic route costs are queried while preserving its current feedback and state transitions.

## Serialization Boundary

No active campaign-save payload currently exists. If one is introduced, store `schemaVersion`, map identity, seed/config fingerprint, semantic map payload or deterministic regeneration recipe, current map ID, hero/route/fog progress, and generator version. Reject unknown incompatible versions with a player-visible migration message; never silently regenerate a different strategic map over progress.

Adapter-backed maps are intentionally retained for legacy world maps and linked submaps. Generated campaign maps are reproducible from the scenario-owned seed and configuration fingerprint; decoration streams never change traversal data.
