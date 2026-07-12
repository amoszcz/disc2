# Data Model: Advanced Terrain Scenario

## Scenario Map

- **Purpose**: Represents the 64x64 playable map and its terrain-driven movement context.
- **Fields**:
  - `width`
  - `height`
  - `terrainRegions`
  - `heroPlacements`
  - `interactiveObjects`
- **Relationships**:
  - Owns the terrain-region set for the scenario.
  - Provides bounds for terrain lookup and hero movement.
- **Validation Rules**:
  - Must be exactly 64 by 64 for this feature slice.
  - Every terrain region must resolve only to in-bounds tiles.

## Terrain Region

- **Purpose**: Defines a painted area that assigns one terrain type to its covered tiles.
- **Fields**:
  - `id`
  - `terrainType`
  - `coverage`
  - `priority`
- **Relationships**:
  - Belongs to one scenario map.
  - Resolves tile behavior for every covered cell.
- **Validation Rules**:
  - Every region must reference a supported terrain type.
  - Coverage must be deterministic so each tile resolves to one effective terrain type.
  - If overlapping regions are allowed internally, priority must unambiguously determine the winner.

## Terrain Tile (Resolved View)

- **Purpose**: The effective tile-level terrain state used during gameplay.
- **Fields**:
  - `position`
  - `terrainType`
  - `isTraversable`
  - `movementCost`
- **Relationships**:
  - Derived from one terrain region at evaluation time.
  - Consumed by route validation and movement spending.
- **Validation Rules**:
  - Roads resolve to traversable cost 1.
  - Grass and plains resolve to traversable cost 2.
  - Mud and woods resolve to traversable cost 3.
  - Mountains, lakes, and rivers resolve to non-traversable state.

## Terrain Type

- **Purpose**: Canonical definition of a terrain category's movement behavior.
- **Fields**:
  - `name`
  - `movementCost`
  - `traversable`
  - `visualClass`
- **Relationships**:
  - Referenced by terrain regions and resolved tiles.
- **Validation Rules**:
  - Must match one of the supported terrain classes in the spec.

## Route Attempt

- **Purpose**: Captures a player-selected movement attempt from one tile to another.
- **Fields**:
  - `heroId`
  - `fromPosition`
  - `toPosition`
  - `direction`
  - `resolvedTerrain`
  - `movementCost`
  - `isLegal`
  - `failureReason`
- **Relationships**:
  - Uses resolved terrain tiles to determine legal movement.
- **Validation Rules**:
  - Legal moves must be 8-directional and adjacent unless a later system introduces path previews.
  - Cost is based on the destination tile's terrain cost.
  - Illegal moves must not mutate hero position or remaining movement.

## Route Feedback

- **Purpose**: Player-visible explanation of terrain cost or blocked movement.
- **Fields**:
  - `destinationPosition`
  - `terrainLabel`
  - `movementImpact`
  - `blockedReason`
- **Relationships**:
  - Derived from route attempts and resolved terrain tiles.
- **Validation Rules**:
  - Must explain blocked terrain distinctly from insufficient remaining movement.

## State Transitions

### Terrain Resolution

1. Scenario loads terrain-region definitions.
2. Region membership resolves an effective terrain type for each queried tile.
3. The resolved tile exposes traversability and movement cost.

### Movement Attempt

1. Player selects a destination.
2. Direction legality is checked for 8-direction adjacency.
3. Destination tile terrain is resolved from region membership.
4. If the tile is blocked or too expensive, movement is rejected without state mutation.
5. If legal, hero position updates and remaining movement is reduced by the destination tile cost.

### Terrain Feedback

1. Player hovers, selects, previews, or attempts a route.
2. The UI derives terrain type and movement effect from the resolved tile.
3. Feedback is shown as cost or blocked reason.
